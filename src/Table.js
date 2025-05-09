import User from './User.js';
import Document from './Document.js';
import ShippingTariff from './ShippingTariff.js';
import Certificate from './Certificate.js';
import TableRow from './TableRow.js';

const user = new User();
const documentFile = new Document();
const shippingTariff = new ShippingTariff();
const tableRow = new TableRow();
const certificate = new Certificate();

let allData = [];

let url = '';
let method = '';
let modalName = '';
let activeElement;
let activeRole;
let activeUserDetailsElement;
let selectedUserId = null;
let hasActiveCertificate;
let hasAnyActiveNonMedicalCertificate;
let isReminderEventAttached = false;

let iti = null;

let emailChanged = false;
let oldEmail = '';

const usersTable = document.getElementById('users-table');
const usersDetails = document.getElementById('users-details');
const usersDetailsClose = document.getElementById('users-details-close');
if (usersDetailsClose) {
    usersDetailsClose.addEventListener('click', (e) => {
        e.preventDefault();

        usersTable.classList.remove('hide');
        usersDetails.classList.add('hide');
    })
}

const loader = document.getElementById('loader');
const successWrapper = document.getElementById('success-wrapper');
const successMessage = document.getElementById('success-message');
const successClose = document.getElementById('success-close');
const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

successClose.addEventListener('click', (e) => {
    successWrapper.classList.add('hide');
})
errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

const searchInputs = document.getElementsByClassName('search-input');
let lastSearchInput = '';

let authUserData;
user.me().then((data) => {
    authUserData = data;
});


export function updateActiveElement(element) {
    activeElement = element
}

export function updateActiveRole(role) {
    activeRole = role
}

Array.from(searchInputs).forEach(input => {
    let typingTimer;
    const typingDelay = 2000;

    const handleTypingFinished = () => {
        loader.style.display = 'flex';

        fillTable(
            Number(input.getAttribute('data-menu')),
            Number(input.getAttribute('data-tab')),
            input.getAttribute('data-status-ids'),
            Number(input.getAttribute('data-page'))
        );
    };

    input.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(handleTypingFinished, typingDelay);
    });
});

Array.from(searchInputs).forEach(input => {
    const form = input.closest('form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
        });
    }
});

export function resetSearchInput() {
    Array.from(searchInputs).forEach(input => {
        input.value = '';
        lastSearchInput = ''
    });
}

export function fillTable(menu, tab, statusIds = null, page = 1) {
    let isUserDocumentsInAdmin = false;
    if (menu === 2) {
        if (tab === 2 || tab === 3 || tab === 4) {
            isUserDocumentsInAdmin = true;
        }
    }
    if (statusIds === 'null') {
        statusIds = null
    }
    const columns = getColumns(menu, tab);
    const columnElements = [];
    const rowHTML = [];

    columns.forEach(column => {
        columnElements[column] = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-' + column);
    })

    const text = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-text');
    const number = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-number');
    const table = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-table');
    const emptyTable = table.parentElement.querySelector('.empty-table');
    const pagination = table.getElementsByClassName('pagination-buttons')[0];
    const search = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-search');

    if (!isUserDocumentsInAdmin && menu !== 7) {
        search.setAttribute('data-menu', menu)
        search.setAttribute('data-tab', tab)
        search.setAttribute('data-status-ids', statusIds)
        search.setAttribute('data-page', page)

        if (search.value !== lastSearchInput) {
            page = 1;
        }
        lastSearchInput = search.value
    }

    let status, statusBadgeColor;

    let model = documentFile;
    let modelName = 'document';
    if (menu === 5 || menu === 6) {
        modelName = 'user_document'
    } else if (menu === 2 && tab === 1) {
        model = user;
        modelName = 'user'
    } else if (menu === 2 && tab === 2) {
        modelName = 'user_document_admin'
    } else if (menu === 2 && tab === 3) {
        model = certificate;
        modelName = 'aircraft_certificates'
    } else if (menu === 2 && tab === 4) {
        model = certificate;
        modelName = 'airman_certificates'
    } else if (menu === 4) {
        model = shippingTariff;
        modelName = 'shippingTariff'
    } else if (menu === 7 && tab === 1) {
        model = certificate;
        modelName = 'aircraft_certificates'
    } else if (menu === 7 && tab === 2) {
        model = certificate;
        modelName = 'airman_certificates'
    }

    let methodName = 'getAll';
    let archived = null
    if (activeRole === 'user' && (menu === 5 || menu === 6)) {
        archived = statusIds
        statusIds = null
        methodName = 'getAllByAuthUser'
    }
    if (modelName === 'user_document_admin'){
        methodName = 'getAllByUser'
    }
    if ((menu === 2 && tab === 3) || (menu === 2 && tab === 4)) {
        methodName = 'getAllByUser'
    }

    model.callMethod(methodName, page, 10, search ? search.value : '', statusIds !== null ? statusIds : undefined, archived !== null ? archived : undefined, selectedUserId !== null ? selectedUserId : undefined).then((data) => {
        if (!isUserDocumentsInAdmin) {
            number.innerHTML = data.itemsTotal
        }

        if (!isUserDocumentsInAdmin && menu !== 7) {
            if (search.value === '' && activeRole === 'admin') {
                text.innerHTML = getTabTitle(menu, tab) + ` (${data.itemsTotal})`
            }
        }

        if (!Array.isArray(allData[menu])) {
            allData[menu] = [];
        }
        allData[menu][tab] = data.items;

        table.style.display = 'grid';
        if (!isUserDocumentsInAdmin) {
            table.style.display = 'flex';
        }
        emptyTable.style.display = 'none';
        if (data.items.length < 1) {
            table.style.display = 'none';
            emptyTable.style.display = 'flex';
        }

        data.items.forEach((item) => {
            if (menu === 7 && item.is_active === true && item.is_free === false && item.type === 'airman_certificate') {
                hasActiveCertificate = true;
            }
            if (menu === 7 && item.is_active === true && item.is_medical === false && item.existing_certificate !== 'part_67') {
                hasAnyActiveNonMedicalCertificate = true;
            }
            status = item._document_status?.status_label;
            if (status) {
                if (status === 'paid' || status === 'delivered') {
                    statusBadgeColor = 'green'
                } else if (status === 'shipped') {
                    statusBadgeColor = 'blue'
                } else {
                    statusBadgeColor = 'orange'
                }
            }

            columns.forEach(column => {
                if (!rowHTML[column]) {
                    rowHTML[column] = [];
                }

                let number;
                if (menu === 7) {
                    if (item.type === 'airman') {
                        if (item.applicant_id_number) {
                            number = item.applicant_id_number;
                        } else if (item.iarca_tracking_number) {
                            number = item.iarca_tracking_number;
                        } else {
                            number = item.ffa_certificate_number;
                        }
                    } else if (item.type === 'aircraft') {
                        number = item.aircraft_serial_number;
                    }

                    item.number = number;
                }

                if (column === 'actions') {
                    rowHTML[column].push(tableRow.getActionRow(menu, tab, item));
                } else {
                    rowHTML[column].push(tableRow.getTableRow(modelName, column, item, statusBadgeColor));
                }
            })
        })

        Object.entries(columnElements).forEach(([key, columnElement]) => {
            let children = columnElement.children;

            for (let i = children.length - 1; i > 0; i--) {
                columnElement.removeChild(children[i]);
            }

            if (rowHTML[key] && rowHTML[key].length) {
                rowHTML[key].forEach(item => {
                    columnElement.innerHTML += item;
                })
            }
        });

        setModals(menu);

        if (menu === 2) {
            setUserDetails();
        }
        // if (menu === 7) {
        //     setBillingLinks()
        // }

        if (menu === 7) {
            const payment = document.querySelectorAll('[data-payment-open]');
            payment.forEach(element => {
                element.addEventListener('click', function (event) {
                    certificatePayment(element.getAttribute('data-id-certificates-id'), element.getAttribute('data-payment-open'))
                })
            });
        }

        createPagination(menu, tab, statusIds, pagination, data);

        loader.style.display = 'none';
    })
}

function certificatePayment(id, type, certificateData = null) {
    const currentDomain = window.location.hostname;

    let isFreeMedical = false;
    if (hasAnyActiveNonMedicalCertificate && type === 'airman') {
        if (certificateData && (certificateData.is_medical || certificateData.existing_certificate === 'part_67')) {
            isFreeMedical = true;
        }
    }

    // if (isFreeMedical) {
    //     return;
    // }

    let price = "";
    let certificate = "";
    if (type === 'aircraft') {
        certificate = "aircraft_75";
        if (currentDomain.includes('webflow.io')) {
            price = "price_1QfGqbCA20rcDWGhGrIUBQVr";
        } else {
            price = "price_1Qrbi9CA20rcDWGhZg72KAVO";
        }
    } else if (type === 'airman') {
        if (hasActiveCertificate) {
            certificate = "airman_35";
            if (currentDomain.includes('webflow.io')) {
                price = "price_1QfGwoCA20rcDWGh4qFwuPTJ";
            } else {
                price = "price_1Qrbi2CA20rcDWGhJFtiXTwu";
            }
        } else {
            certificate = "airman_75";
            if (currentDomain.includes('webflow.io')) {
                price = "price_1QfGuICA20rcDWGhM3Y5GQb7";
            } else {
                price = "price_1Qrbi2CA20rcDWGhoyhcf8hs";
            }
        }
    }

    if (price === '') {
        return
    }

    loader.style.display = 'flex';
    let data = {
        success_url: "https://" + window.location.hostname + "/user-dashboard?certificate=" + certificate,
        cancel_url: "https://" + window.location.hostname + "/user-dashboard",
        certificates_id: id,
        email: authUserData.email,
        line_items: [
            {
                price: price,
                quantity: "1",
            }
        ]
    };

    if(authUserData.is_active){
        console.log("Skipping payment as the user is active!");

        window.location.href = window.location.pathname + "?certificate=" + certificate

        return;
    }else{
        throw new Error("User is inactive, he has to finish his registration process first!");
    }

    user.initialPayment(data).then(result => {
        loader.style.display = 'none';
        window.location.href = result.url
    });
}

function createPagination(menu, tab, statusIds, pagination, data) {
    let paginationHTML = '';

    if (data.prevPage) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, 'Prev', data.prevPage);
    }

    if (data.curPage > 2) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, '...', null, true);
    }

    if (data.curPage !== 1) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, data.curPage - 1, data.curPage - 1, true);
    }

    paginationHTML += createPaginationButton(menu, tab, statusIds, data.curPage, data.curPage, true, true);

    if (data.curPage !== data.pageTotal) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, data.curPage + 1, data.curPage + 1, true);
    }

    if ((data.pageTotal - data.curPage) > 1) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, '...', null, true);
    }

    if (data.nextPage) {
        paginationHTML += createPaginationButton(menu, tab, statusIds, 'Next', data.nextPage);
    }

    pagination.innerHTML = paginationHTML
}

function createPaginationButton(menu, tab, statusIds, label, page = null, isNumber = false, isActive = false) {
    if (isActive) {
        page = null;
    }
    const pageData = page !== null ? ` data-menu="${menu}" data-tab="${tab}" data-status-ids="${statusIds}" data-page="${page}"` : '';
    const numberClass = isNumber ? ' number' : '';
    const activeStyle = isActive ? 'style="border: 1px solid black"' : '';
    return `
        <div ${activeStyle} class="pagination-btn${numberClass}" ${pageData}>
            <div class="pagination-btn-txt">${label}</div>
        </div>
    `;
}

let paginationFunctionRun = false;
document.addEventListener('DOMContentLoaded', function () {
    if (paginationFunctionRun === false) {
        paginationClick();
        paginationFunctionRun = true;
    }
});

if ((document.readyState === 'complete' || document.readyState === 'interactive') && paginationFunctionRun === false) {
    paginationClick();
    paginationFunctionRun = true;
}

function paginationClick() {
    document.body.addEventListener('click', function(event) {
        let button;
        if (event.target.classList.contains('pagination-btn')) {
            button = event.target;
        } else if (event.target.closest('.pagination-btn')) {
            button = event.target.closest('.pagination-btn');
        } else {
            return;
        }

        if (!button.hasAttribute('data-menu')) {
            return;
        }

        fillTable(
            Number(button.getAttribute('data-menu')),
            Number(button.getAttribute('data-tab')),
            button.getAttribute('data-status-ids'),
            Number(button.getAttribute('data-page'))
        );
    });
}

export function getTabTitle(menu, tab) {
    const tabTitles = {
        1: {
            1: 'All Requests',
            2: 'Forwarding Requests',
            3: 'Forwarding Pending',
            4: 'Payment Received',
            5: 'All Sent',
            6: 'Shred Requests',
        },
        2: {
            1: 'All Users',
        },
        3: {
            1: 'Requests',
            2: 'Shredded',
        },
        4: {
            1: 'All Tariffs',
        }
    };

    return tabTitles[menu]?.[tab] || 'Unknown Option';
}

function getColumns(menu, tab) {
    const columns = {
        1: {
            1: ['id', 'name', 'user', 'price', 'status', 'blank', 'actions'],
            2: ['id', 'name', 'user', 'status', 'blank', 'actions'],
            3: ['id', 'name', 'user', 'price', 'status', 'blank', 'actions'],
            4: ['id', 'name', 'user', 'price', 'status', 'blank', 'actions'],
            5: ['id', 'name', 'user', 'price', 'status', 'blank', 'actions'],
            6: ['id', 'name', 'user', 'price', 'status', 'blank', 'actions'],
        },
        2: {
            1: ['id', 'name', 'address', 'email', 'blank', 'actions'],
            2: ['id', 'name', 'status', 'actions'],
            3: ['id', 'details', 'make', 'model', 'serial_number', 'status', 'actions'],
            4: ['id', 'ffa_certificate_number', 'applicant_id_number', 'iarca_tracking_number', 'existing_certificate', 'status', 'actions'],
        },
        3: {
            1: ['id', 'name', 'user', 'status', 'blank', 'actions'],
            2: ['id', 'name', 'user', 'status', 'blank', 'actions'],
        },
        4: {
            1: ['id', 'name', 'price', 'region', 'blank', 'actions'],
        },
        5: {
            1: ['id', 'name', 'description', 'price', 'status', 'blank', 'actions'],
        },
        6: {
            1: ['id', 'name', 'description', 'price', 'status', 'blank', 'actions'],
        },
        7: {
            1: ['id', 'details', 'make', 'model', 'serial_number', 'blank', 'actions'],
            2: ['id', 'ffa_certificate_number', 'applicant_id_number', 'iarca_tracking_number', 'existing_certificate', 'blank', 'actions'],
        },
    };

    return columns[menu]?.[tab] || 'unknown';
}

export function setModals(menu) {
    const modals = getModals(menu);

    Object.entries(modals).forEach(([key, item]) => {
        const modal = document.getElementById(item.modal);
        const openButtons = document.querySelectorAll(`[data-modal-open="${item.modal}"]`);
        const closeButtons = modal.querySelectorAll('[data-modal-action="close"]');
        const submitButton = modal.querySelectorAll('[data-modal-action="submit"]')[0];
        const dropZones = modal.querySelectorAll('[data-modal-action="dropzone"]');
        const form = modal.getElementsByTagName("form")[0];

        openButtons.forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault()

                const changeDocumentAddress = modal.querySelector('#change-document-address');

                if (changeDocumentAddress) {
                    changeDocumentAddress.addEventListener('click', function () {
                        modal.classList.add('hide');

                        const closestElement = button.parentElement.querySelector(
                            `[data-modal-open="edit-document-address-popup"]`
                        );

                        closestElement.click()
                    })
                }

                method = item.method;
                modalName = item.modal
                let idAttribute = Array.from(button.attributes).find(attr => attr.name.startsWith('data-id-'));
                if (idAttribute) {
                    let idAttributeName = idAttribute.name
                        .replace('data-id-', '')
                        .replace(/-([a-z])/g, (_, char) => `_${char}`);

                    if (item.action.includes(idAttributeName)) {
                        url = item.action.replace(`{${idAttributeName}}`, idAttribute.value);
                    } else {
                        let parts = item.action.split("/");
                        parts[parts.length - 1] = idAttribute.value;
                        url = parts.join("/");
                    }
                } else {
                    url = item.action
                }

                let fillAttribute = Array.from(button.attributes).find(attr => attr.name.startsWith('data-fill-'));
                if (fillAttribute) {
                    let fillAttributeName = fillAttribute.name
                        .replace('data-fill-', '')

                    let fillData
                    if (fillAttributeName === 'auth-id') {
                        fillData = authUserData;
                    } else {
                        let tab = fillAttributeName.split('-');

                        fillData = Array.from(allData[tab[0]][tab[1]]).find(item => item.id.toString().match(fillAttribute.value))
                    }

                    let changeDocumentAddress = modal.querySelector('#change-document-address');
                    if (changeDocumentAddress) {
                        changeDocumentAddress.style.display = 'flex';
                        if (!fillData._document_addresses_of_documents) {
                            changeDocumentAddress.style.display = 'none';
                        }
                    }

                    if (form) {
                        let elementsWithName = form.querySelectorAll('[name]');

                        elementsWithName.forEach(element => {
                            if (element.getAttribute('name').includes(".")) {
                                let parts = element.getAttribute('name').split(".");
                                element.value = fillData['_' + parts[0]][parts[1]] ?? "";
                            } else {
                                element.value = fillData[element.getAttribute('name')] ?? "";
                            }

                            if (element.getAttribute('name').includes("email")) {
                                oldEmail = fillData[element.getAttribute('name')];
                            }

                            if (element.getAttribute('name').includes("document_user_address")) {
                                let address = fillData?._document_addresses_of_documents;

                                if (!address) {
                                    address = fillData?._user?._user_addresses_of_user;
                                }

                                if (address) {
                                    element.value = address.street + ' ' + address.number + ', ' + address.zip + ' ' + address.city + ' - ' + address.country
                                }
                            }

                            if (element.getAttribute('name').includes("choosed_shipping_tariff")) {
                                let tariff = fillData?._choosed_shipping_tariffs;

                                if (tariff) {
                                    const newOption = document.createElement("option");
                                    newOption.value = "1";
                                    newOption.text = tariff.region + ' ' + tariff.label.charAt(0).toUpperCase() + tariff.label.slice(1);

                                    element.appendChild(newOption);
                                    newOption.selected = true;
                                }
                            }

                            if (element.getAttribute('type') === 'radio') {
                                console.log(element.getAttribute('name'))
                                console.log(fillData[element.getAttribute('name')])
                                console.log(element.getAttribute('data-choice-value'))
                                element.checked = false;
                                if (fillData[element.getAttribute('name')] !== '' && element.getAttribute('data-choice-value') === fillData[element.getAttribute('name')]) {
                                    console.log(element.getAttribute('data-choice-value'))
                                    element.checked = true;
                                }
                            }

                            if (element.hasAttribute('data-readonly')) {
                                element.setAttribute("readonly", true);
                            }
                            if (element.hasAttribute('data-disabled')) {
                                element.setAttribute("disabled", true);
                            }

                            if (modalName === 'edit-airman-popup') {
                                if (element.value === '') {
                                    element.setAttribute("data-disabled", true);
                                    element.setAttribute("disabled", true);
                                } else {
                                    element.removeAttribute("data-disabled");
                                    element.removeAttribute("disabled");
                                }

                                modal.querySelector('[name=existing_certificate]').addEventListener('change', (event) => {
                                    const applicantIdNumber = modal.querySelector('[name=applicant_id_number]');
                                    const ffaCertificateNumber = modal.querySelector('[name=ffa_certificate_number]');
                                    console.log(event.target.value);
                                    if (event.target.value === 'part_67') {
                                        ffaCertificateNumber.setAttribute("data-disabled", true);
                                        ffaCertificateNumber.setAttribute("disabled", true);
                                        ffaCertificateNumber.value = '';

                                        applicantIdNumber.removeAttribute("data-disabled");
                                        applicantIdNumber.removeAttribute("disabled");
                                    } else {
                                        applicantIdNumber.setAttribute("data-disabled", true);
                                        applicantIdNumber.setAttribute("disabled", true);
                                        applicantIdNumber.value = '';

                                        ffaCertificateNumber.removeAttribute("data-disabled");
                                        ffaCertificateNumber.removeAttribute("disabled");
                                    }
                                })
                            }

                            if (modalName === 'edit-user-popup' && element.getAttribute('name').includes("phone_number")) {
                                if (iti) {
                                    iti.setCountry(fillData['phone_country']);
                                } else {
                                    iti = window.intlTelInput(element, {
                                        initialCountry: fillData['phone_country'],
                                        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
                                        formatOnDisplay: false,
                                        separateDialCode: true,
                                        autoPlaceholder: "off",
                                    });
                                }
                            }
                        });
                    }

                    if (modalName === 'details-document-popup') {
                        fillDocumentDetails(fillData, menu, modal);
                    }
                }

                modal.classList.remove('hide');
                if (modalName === 'add-certificate-popup') {
                    const certificatesTable = document.getElementById('certificate-tables');
                    const afterRegisterSection = document.querySelector(`#after-register-section`);
                    const certificateNext = document.querySelector(`#certificate-next`);
                    const certificateStep1 = document.querySelector(`#certificate-step-1`);
                    const certificateStep2 = document.querySelector(`#certificate-step-2`);

                    certificatesTable.classList.add('hide');
                    afterRegisterSection.classList.add('hide');

                    certificateNext.addEventListener('click', () => {
                        certificateStep1.classList.add('hide');
                        certificateStep2.classList.remove('hide');
                    })
                }

                if (modalName === 'add-document-popup') {
                    let addDocumentPopupIn = false;
                    $(document).ready(function() {
                        if (addDocumentPopupIn === false) {
                            addDocumentPopupIn = true;

                            const selectCertificateElement = document.getElementById('certificates_id');
                            selectCertificateElement.innerHTML = '';

                            const addDocumentButton = document.getElementById('create-document-btn');
                            const addDocumentUserError = document.getElementById('add-document-user-error');
                            const addDocumentUserErrorLink = document.getElementById('add-document-user-error-link');

                            addDocumentButton.style.pointerEvents = "auto";
                            addDocumentButton.style.opacity = "1";
                            addDocumentUserError.style.display = "none";
                            let selectedUser;

                            $('#create-document-user').on('select2:select', function (e) {
                                // $('#create-document-user').off('select2:select');
                                selectCertificateElement.innerHTML = '';

                                const selectedValue = e.params.data.id;

                                certificate.getAllByUser(1, 9999, '', '', null, selectedValue).then((data) => {
                                    const options = [];
                                    const defaultOption = document.createElement('option');
                                    defaultOption.value = '';
                                    defaultOption.textContent = 'Choose certificate';
                                    options.push(defaultOption);

                                    data.items.forEach(cert => {
                                        const option = document.createElement('option');
                                        option.value = cert.id;
                                        option.setAttribute('data-active', cert.is_active)

                                        let type = cert.type.split('_')[0]
                                        let typeFormated = type.charAt(0).toUpperCase() + type.slice(1);

                                        let secondString;
                                        if (type === 'airman') {
                                            if (cert.applicant_id_number) {
                                                secondString = cert.applicant_id_number;
                                            } else if (cert.iarca_tracking_number) {
                                                secondString = cert.iarca_tracking_number;
                                            } else {
                                                secondString = cert.ffa_certificate_number;
                                            }
                                        } else if (type === 'aircraft') {
                                            secondString = cert.aircraft_serial_number;
                                        }

                                        option.textContent = typeFormated + ' ' + secondString;
                                        options.push(option);
                                    });

                                    selectCertificateElement.innerHTML = '';
                                    selectCertificateElement.append(...options);
                                })

                                selectedUser = selectedValue;
                                let isActive = $(e.params.data.element).data('active');

                                if (!isActive) {
                                    addDocumentButton.style.pointerEvents = "none";
                                    addDocumentButton.style.opacity = "0.5";
                                    addDocumentUserError.style.display = "block";
                                } else {
                                    addDocumentButton.style.pointerEvents = "auto";
                                    addDocumentButton.style.opacity = "1";
                                    addDocumentUserError.style.display = "none";
                                }
                            });

                            if (!isReminderEventAttached) {
                                isReminderEventAttached = true;

                                addDocumentUserErrorLink.addEventListener("click", function() {
                                    user.sendReminder(selectedUser).then((success) => {
                                        if (success) {
                                            successMessage.innerHTML = 'Payment reminder has been successfully sent!';
                                            successWrapper.classList.remove('hide');

                                            setTimeout(function () {
                                                successWrapper.classList.add('hide');
                                            }, 3000);
                                        }
                                    })
                                });
                            }
                        }
                    });
                }

                if (modalName === 'delete-certificate-popup' && menu !== 2) {
                    const certificateNumber = document.querySelector('#delete-certificate-number');

                    certificateNumber.textContent = Array.from(button.attributes).find(attr => attr.name.startsWith('data-certificate-number')).value;
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault()

                modal.classList.add('hide');
                if (modalName === 'add-certificate-popup') {
                    const certificatesTable = document.getElementById('certificate-tables');

                    certificatesTable.classList.remove('hide');
                }

                if (modalName === 'add-document-popup') {
                    $('#create-document-user').off('select2:select');

                    const select2Element = document.getElementById('create-document-user');
                    if (select2Element) {
                        select2Element.value = '';
                        const event = new Event('change', {bubbles: true});
                        select2Element.dispatchEvent(event);
                    }
                }
            });
        });

        dropZones.forEach(dropZone => {
            const fileName = dropZone.getAttribute('data-dropzone-name')

            createDropZone(dropZone, item, fileName);
        });

        const handleClick = () => {
            if (modalName === 'delete-user-popup') {
                const deleteInput = document.getElementById('delete_confirmation');

                if (deleteInput.value !== 'DELETE') {
                    return;
                }
            }

            const formData = new FormData(form);

            const authToken =  localStorage.getItem('authToken');
            let requestData = {
                method: method
            }

            if (modalName === 'request-forward-document-popup') {
                formData.append('document_status_id', 2)
            } else if (modalName === 'request-shred-document-popup') {
                formData.append('document_status_id', 7)
            }  else if (modalName === 'shred-document-popup') {
                formData.append('document_status_id', 8)
            }  else if (modalName === 'payment-document-popup' || modalName === 'edit-document-popup') {
                formData.append('document_status_id', 3)
            }  else if (modalName === 'forward-document-popup') {
                formData.append('document_status_id', 5)
            }  else if (modalName === 'archive-document-popup') {
                formData.append('archived', true)
            }

            if (typeof form !== 'undefined') {
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (!checkbox.checked) {
                        formData.append(checkbox.name, 0);
                    } else {
                        formData.delete(checkbox.name);
                        formData.append(checkbox.name, 1);
                    }
                });

                Array.from(form.elements).forEach(element => {
                    if (element.hasAttribute('disabled')) {
                        formData.delete(element.name);
                    }
                });

                if (modalName === 'edit-user-popup') {
                    formData.append('phone_country', iti.getSelectedCountryData().iso2);
                }

                if (modalName === 'request-forward-document-popup') {
                    formData.delete('shipping_type');
                    const selectedShippingType = document.querySelector('input[name="shipping_type"]:checked');
                    if (selectedShippingType) {
                        const selectedValue = selectedShippingType.getAttribute("data-choice-value");

                        formData.append('shipping_type', selectedValue);
                    } else {
                        formData.append('shipping_type', '');
                    }
                }

                if (modalName === 'add-certificate-popup') {
                    const entries = Array.from(formData.entries());

                    const typeValue = entries.find(item => item[0] === 'type')?.[1];

                    if (typeValue === 'aircraft_registration_certificate') {
                        formData.delete('existing_certificate');
                        formData.delete('ffa_certificate_number');
                        formData.delete('applicant_id_number');
                        formData.delete('iarca_tracking_number');
                    } else {
                        formData.delete('aircraft_details');
                        formData.delete('aircraft_make');
                        formData.delete('aircraft_model');
                        formData.delete('aircraft_serial_number');

                        const existingValue = entries.find(item => item[0] === 'is_existing')?.[1];

                        if (existingValue === 'false') {
                            formData.delete('existing_certificate');
                            formData.delete('ffa_certificate_number');

                            const medicalValue = entries.find(item => item[0] === 'is_medical')?.[1];

                            if (medicalValue === 'false') {
                                formData.delete('applicant_id_number');
                            } else {
                                formData.delete('iarca_tracking_number');
                            }
                        } else {
                            formData.delete('is_medical');
                            formData.delete('iarca_tracking_number');
                            const existingCertificate = entries.find(item => item[0] === 'existing_certificate')?.[1];
                            if (existingCertificate === 'part_67') {
                                formData.delete('ffa_certificate_number');
                            } else {
                                formData.delete('applicant_id_number');
                            }
                        }
                    }
                }

                if (modalName === 'add-certificate-popup') {
                    const errorElements = modal.querySelectorAll('[data-error]');

                    errorElements.forEach(el => {
                        el.style.display = 'none';
                    });
                }

                let hasErrors = false;
                const entries = Array.from(formData.entries());
                for (const [key, value] of entries) {
                    if (key.includes('.')) {
                        let modifiedKey = key.split('.').pop();

                        formData.delete(key);
                        formData.append(modifiedKey, value);
                    }

                    if (key === 'aircraft_details') {
                        const regex = /^N.{2,5}$/;

                        if (!regex.test(value)) {
                            if (modalName === 'add-certificate-popup') {
                                modal.querySelector('[data-error=' + key + ']').style.display = 'block';

                                hasErrors = true;
                            } else {
                                errorMessage.innerHTML = 'Aircraft Detail must start with "N" and have between 3 and 6 characters in total.';
                                errorWrapper.classList.remove('hide');

                                setTimeout(function () {
                                    errorWrapper.classList.add('hide');
                                }, 3000);

                                return;
                            }
                        }
                    }

                    if (!value.trim()) {
                        if (key === 'description') {
                            if (modalName === 'add-document-popup') {
                                formData.delete('description');
                                formData.append('description', null);
                            } else {
                                formData.delete('description');
                                formData.append('description', '');
                            }
                        } else if (key !== 'middle_name' && key !== 'user_addresses_of_user.address_additional' && key !== 'document_addresses_of_documents.address_additional') {
                            if (modalName === 'add-certificate-popup') {
                                modal.querySelector('[data-error=' + key + ']').style.display = 'block';

                                hasErrors = true;
                            } else {
                                errorMessage.innerHTML = 'Please, fill in all fields.';
                                errorWrapper.classList.remove('hide');

                                setTimeout(function () {
                                    errorWrapper.classList.add('hide');
                                }, 3000);

                                return;
                            }
                        }
                    }

                    if (key === 'email') {
                        if (value === oldEmail) {
                            formData.delete(key);
                        } else {
                            emailChanged = true
                            formData.delete(key);
                            formData.append('new_email', value);
                        }
                    }

                    if (key === 'shipping_tariffs_id' && value === '0') {
                        errorMessage.innerHTML = 'Please, fill in all fields.';
                        errorWrapper.classList.remove('hide');

                        setTimeout(function () {
                            errorWrapper.classList.add('hide');
                        }, 3000);

                        return;
                    }
                }

                if (hasErrors) {
                    return;
                }
            }

            const currentDomain = window.location.hostname;

            let dataSource = 'live';
            if (currentDomain.includes('webflow.io')) {
                dataSource = 'stage';
            }

            if (Object.keys(item.files).length !== 0) {
                Object.keys(item.files).forEach((fileName) => {
                    const fileArray = item.files[fileName];
                    fileArray.forEach((file, key) => {
                        formData.append(fileName, file[0]);
                    });
                });

                requestData.body = formData;

                requestData.headers = {
                    'Authorization': `Bearer ${authToken}`,
                    'X-Data-Source': dataSource,
                }
            } else {
                if (modalName === 'add-document-popup') {
                    errorMessage.innerHTML = 'Please, fill in all fields.';
                    errorWrapper.classList.remove('hide');

                    setTimeout(function () {
                        errorWrapper.classList.add('hide');
                    }, 3000);

                    return;
                }

                let jsonObject = {};

                formData.forEach((value, key) => {
                    jsonObject[key] = value;
                });

                requestData.body = JSON.stringify(jsonObject);

                requestData.headers = {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'X-Data-Source': dataSource,
                }
            }

            loader.style.display = 'flex'

            fetch(url, requestData)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Server responded with an error!');
                    }

                    return response.json();
                })
                .then((data) => {
                    if (modalName === 'delete-certificate-popup' && menu !== 2) {
                        window.location.href = window.location.pathname + "?certificate-deleted=1"
                    }

                    if (modalName === 'delete-user-popup' && activeRole === 'user') {
                        user.logOut()
                    }

                    modal.classList.add('hide');

                    item.files = [];

                    if (modalName === 'add-document-popup') {
                        $('#create-document-user').off('select2:select');
                    }

                    if (activeUserDetailsElement) {
                        localStorage.setItem('noFill', '1');
                    }

                    if (activeUserDetailsElement) {
                        activeUserDetailsElement.click()
                    } else {
                        activeElement.click()
                    }

                    user.me().then((data) => {
                        authUserData = data;
                    });

                    if (form) {
                        form.reset();

                        dropZones.forEach(dropZone => {
                            const outputDivs = dropZone.querySelectorAll(".output");
                            outputDivs.forEach(div => div.remove());
                            dropZone.firstElementChild.style.display = 'flex';
                        });

                        const select2Element = document.getElementById('create-document-user');
                        if (select2Element) {
                            select2Element.value = '';
                            const event = new Event('change', {bubbles: true});
                            select2Element.dispatchEvent(event);
                        }

                        document.querySelectorAll('.w--redirected-checked').forEach(el => {
                            el.classList.remove('w--redirected-checked');
                        });
                    }

                    if (modalName === 'add-certificate-popup') {
                        const radioOption1 = document.getElementById('radio-option-1');
                        const radioOption2 = document.getElementById('radio-option-2');
                        const chooseMedicalWrapper = document.getElementById('choose-medical-wrapper');
                        const applicantIdWrapper = document.getElementById('applicant_id_wrapper');
                        const trackingNumberWrapper = document.getElementById('tracking_number_wrapper');
                        const existingCertificateWrapper = document.getElementById('existing_certificate_wrapper');
                        const ffaCertificateNumberWrapper = document.getElementById('ffa_certificate_number_wrapper');

                        radioOption1.classList.add('hidden');
                        radioOption2.classList.add('hidden');
                        chooseMedicalWrapper.classList.add('hidden');
                        applicantIdWrapper.classList.add('hidden');
                        trackingNumberWrapper.classList.add('hidden');
                        existingCertificateWrapper.classList.add('hidden');
                        ffaCertificateNumberWrapper.classList.add('hidden');
                    }

                    successMessage.innerHTML = item.success_message;
                    successWrapper.classList.remove('hide');

                    setTimeout(function() {
                        successWrapper.classList.add('hide');
                    }, 3000);

                    loader.style.display = 'none'

                    if (usersTable && usersTable.classList.contains('hide') && (modalName === 'delete-user-popup' || modalName === 'edit-user-popup')) {
                        usersDetails.classList.add("hide");
                        usersTable.classList.remove("hide");
                    }

                    if (menu === 4 || menu === 'initial-admin') {
                        populateSelectWithShippingTariffs()
                    }
                    if (menu === 2) {
                        populateSelectWithUsers()
                    }
                    if (menu === 1 || menu === 3) {
                        getTabCount()
                    }

                    if (modalName === 'add-certificate-popup') {
                        const certificatesTable = document.getElementById('certificate-tables');

                        certificatesTable.classList.remove('hide');

                        certificatePayment(data.id, data.type.split('_')[0], data)
                    }

                    if (emailChanged) {
                        window.location.href = '/email-verification';
                    }
                })
                .catch((error) => {
                    if (emailChanged) {
                        errorMessage.innerHTML = 'Email already taken.';
                    } else {
                        errorMessage.innerHTML = 'Server Error! Please, try again or contact support.';
                    }
                    errorWrapper.classList.remove('hide');

                    loader.style.display = 'none'

                    setTimeout(function() {
                        errorWrapper.classList.add('hide');
                    }, 3000);
                });
        }

        if (submitButton) {
            if (!submitButton.hasAttribute('data-clicked')) {
                submitButton.addEventListener("click", function () {
                    handleClick(key);
                });
                submitButton.setAttribute('data-clicked', key)
            }
        }
    })
}

function getModals(menu) {
    const currentDomain = window.location.hostname;

    let branch = '';
    if (currentDomain.includes('webflow.io')) {
        branch = ':stage';
    }

    const modals = {
        'initial-admin': {
            1: {
                modal: 'add-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents`,
                method: 'POST',
                files: [],
                success_message: 'The document has been successfully uploaded and assigned to a user.',
            },
            2: {
                modal: 'add-tariff-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX${branch}/shipping_tariffs`,
                method: 'POST',
                files: [],
                success_message: 'The tariff has been successfully created.',
            },
            3: {
                modal: 'edit-user-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${branch}/user/{user_id}`,
                method: 'PUT',
                files: [],
                success_message: 'The user has been successfully updated.',
            },
        },
        'initial-user': {
            1: {
                modal: 'edit-user-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${branch}/user/{user_id}`,
                method: 'PUT',
                files: [],
                success_message: 'Your profile has been successfully updated.',
            },
            2: {
                modal: 'delete-user-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${branch}/user/{user_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The user has been successfully deleted.',
            },
            3: {
                modal: 'add-certificate-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates`,
                method: 'POST',
                files: [],
                success_message: 'The certificate has been successfully created.',
            },
        },
        1: {
            1: {
                modal: 'shred-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully shredded.',
            },
            2: {
                modal: 'delete-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            },
            3: {
                modal: 'edit-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            4: {
                modal: 'forward-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            5: {
                modal: 'payment-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            }
        },
        2: {
            1: {
                modal: 'edit-user-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${branch}/user/{user_id}`,
                method: 'PUT',
                files: [],
                success_message: 'The user has been successfully updated.',
            },
            2: {
                modal: 'delete-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            },
            3: {
                modal: 'delete-user-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${branch}/user/{user_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The user has been successfully deleted.',
            },
            4: {
                modal: 'delete-certificate-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The certificate has been successfully deleted.',
            },
            5: {
                modal: 'edit-aircraft-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The certificate has been successfully updated.',
            },
            6: {
                modal: 'edit-airman-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The certificate has been successfully updated.',
            },
            7: {
                modal: 'shred-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully shredded.',
            },
            8: {
                modal: 'edit-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            9: {
                modal: 'forward-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            10: {
                modal: 'payment-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            }
        },
        3: {
            1: {
                modal: 'shred-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully shredded.',
            },
            2: {
                modal: 'delete-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            }
        },
        4: {
            1: {
                modal: 'edit-tariff-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX${branch}/shipping_tariffs/{shipping_tariffs_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The tariff has been successfully updated.',
            },
            2: {
                modal: 'delete-tariff-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX${branch}/shipping_tariffs/{shipping_tariffs_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The tariff has been successfully deleted.',
            },
        },
        5: {
            1: {
                modal: 'details-document-popup',
                action: '',
                method: 'GET',
                files: []
            },
            2: {
                modal: 'request-forward-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The forwarding has been successfully requested.',
            },
            3: {
                modal: 'request-shred-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The shredding has been successfully requested.',
            },
            4: {
                modal: 'delete-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            },
            5: {
                modal: 'archive-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully archived.',
            },
            6: {
                modal: 'edit-document-address-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/document_addresses/{document_addresses_id}`,
                method: 'PUT',
                files: [],
                success_message: 'The document address has been successfully updated.',
            },
        },
        6: {
            1: {
                modal: 'details-document-popup',
                action: '',
                method: 'GET',
                files: []
            },
            2: {
                modal: 'delete-document-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2${branch}/documents/{documents_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            }
        },
        7: {
            1: {
                modal: 'edit-aircraft-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The certificate has been successfully updated.',
            },
            2: {
                modal: 'edit-airman-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'PATCH',
                files: [],
                success_message: 'The certificate has been successfully updated.',
            },
            3: {
                modal: 'delete-certificate-popup',
                action: `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${branch}/certificates/{certificates_id}`,
                method: 'DELETE',
                files: [],
                success_message: 'The certificate has been successfully deleted.',
            }
        }
    }

    return modals[menu] || 'unknown';
}

function createDropZone(dropZone, item, fileName) {
    const fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', function () {
        if (fileInput.files.length > 0) {
            const files = Array.from(fileInput.files).filter(file => file.type === "application/pdf");

            if (files.length === 0) {
                errorMessage.innerHTML = "Only PDF files are allowed.";
                errorWrapper.classList.remove('hide');

                setTimeout(() => {
                    errorWrapper.classList.add('hide');
                }, 3000);

                return;
            }

            if (typeof item.files[fileName] === 'undefined') {
                item.files[fileName] = [];
            }

            item.files[fileName].length = 0
            item.files[fileName].push(files)

            handleFiles(item.files[fileName]);
        }
    });

    const dropzoneDisplay = dropZone.firstElementChild;

    ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
        dropZone.addEventListener(event, e => e.preventDefault());
        dropZone.addEventListener(event, e => e.stopPropagation());
    });

    ["dragenter", "dragover"].forEach(event => {
        dropZone.addEventListener(event, () => dropZone.classList.add("dragover"));
    });

    ["dragleave", "drop"].forEach(event => {
        dropZone.addEventListener(event, () => dropZone.classList.remove("dragover"));
    });

    dropZone.addEventListener("drop", e => {
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === "application/pdf");

        if (files.length === 0) {
            errorMessage.innerHTML = "Only PDF files are allowed.";
            errorWrapper.classList.remove('hide');

            setTimeout(() => {
                errorWrapper.classList.add('hide');
            }, 3000);

            return;
        }

        if (typeof item.files[fileName] === 'undefined') {
            item.files[fileName] = [];
        }

        item.files[fileName].length = 0
        item.files[fileName].push(files)

        handleFiles(item.files[fileName]);
    });

    function handleFiles(allFiles) {
        const output = document.createElement("div");
        output.classList.add("output");
        allFiles = Array.from(allFiles);
        allFiles.forEach(file => {
            const fileInfo = document.createElement("p");
            fileInfo.textContent = `Name: ${file[0].name}, Size: ${file[0].size} bytes`;
            output.appendChild(fileInfo);
        });

        dropzoneDisplay.style.display = 'none';

        const outputDivs = dropZone.querySelectorAll(".output");
        outputDivs.forEach(div => div.remove());

        dropZone.appendChild(output);
    }
}

export function populateSelectWithUsers() {
    const createDocumentUser = document.getElementById('create-document-user');
    const editDocumentUser = document.getElementById('edit-document-user');
    const forwardDocumentUser = document.getElementById('forward-document-user');
    const paymentDocumentUser = document.getElementById('payment-document-user');

    user.getAll(1, 999999).then((users) => {
        if (users.items.length) {
            let userOptions = '';
            users.items.forEach((user) => {
                userOptions += `<option data-active="${user.is_active}" value="${user.id}">${user.first_name} ${user.last_name}</option>`
            })

            createDocumentUser.innerHTML += userOptions;
            editDocumentUser.innerHTML += userOptions;
            forwardDocumentUser.innerHTML += userOptions;
            paymentDocumentUser.innerHTML += userOptions;
        }
    })
}

export function populateSelectWithShippingTariffs() {
    const editDocumentShippingTariff = document.getElementById('edit-document-shipping-tariff');
    const paymentDocumentShippingTariff = document.getElementById('payment-document-shipping-tariff');

    editDocumentShippingTariff.innerHTML = '';
    paymentDocumentShippingTariff.innerHTML = '';
    let shippingTariffsOptions = '<option value="0">Choose shipping tariff</option>';
    shippingTariff.getAll(1, 999999).then((shippingTariffs) => {
        if (shippingTariffs.items.length) {
            shippingTariffs.items.forEach((shippingTariff) => {
                shippingTariffsOptions += `<option value="${shippingTariff.id}">${shippingTariff.region} ${shippingTariff.label.charAt(0).toUpperCase() + shippingTariff.label.slice(1)}</option>`
            })

            editDocumentShippingTariff.innerHTML += shippingTariffsOptions;
            paymentDocumentShippingTariff.innerHTML += shippingTariffsOptions;
        }
    })
}

function fillDocumentDetails(data, menu, modal) {
    const id = document.getElementById('document-id');
    const title = document.getElementById('document-title');

    const status = document.getElementById('document-status');

    const shippingName = document.getElementById('document-shipping-name');
    const shippingAddress = document.getElementById('document-shipping-address');
    const shippingCity = document.getElementById('document-shipping-city');
    const shippingAddressBox = document.getElementById('document-shipping-address-box');

    const assignedAt = document.getElementById('document-assigned-at');
    const deliveryRequestedAt = document.getElementById('document-delivery-requested-at');
    const paidAt = document.getElementById('document-paid-at');
    const shippedAt = document.getElementById('document-shipped-at');
    const shredRequestedAt = document.getElementById('document-shred-requested-at');
    const shreddedAt = document.getElementById('document-shredded-at');

    const assignedAtBox = document.getElementById('document-assigned-at-box');
    const deliveryRequestedAtBox = document.getElementById('document-delivery-requested-at-box');
    const paidAtBox = document.getElementById('document-paid-at-box');
    const shippedAtBox = document.getElementById('document-shipped-at-box');
    const shredRequestedAtBox = document.getElementById('document-shred-requested-at-box');
    const shreddedAtBox = document.getElementById('document-shredded-at-box');

    const shippingType = document.getElementById('document-shipping-type');
    const price = document.getElementById('document-price');
    const trackingNumber = document.getElementById('document-tracking-number');
    const shippingTypeBox = document.getElementById('document-shipping-type-box');
    const priceBox = document.getElementById('document-price-box');
    const trackingNumberBox = document.getElementById('document-tracking-number-box');
    const dataBox = document.getElementById('document-data-box');

    const downloadDocument = document.getElementById('document-download-document');
    const requestShreddingBox = document.getElementById('document-request-shredding-box');
    const requestShredding = document.getElementById('document-request-shredding');
    const deleteDocumentBox = document.getElementById('document-delete-document-box');
    const deleteDocument = document.getElementById('document-delete-document');
    const archiveDocumentBox = document.getElementById('document-archive-document-box');
    const archiveDocument = document.getElementById('document-archive-document');
    const payment = document.getElementById('document-payment');

    requestShreddingBox.style.display = 'flex';
    deleteDocumentBox.style.display = 'flex';
    archiveDocumentBox.style.display = 'flex';
    payment.style.display = 'flex';
    shippingAddress.innerHTML = '...'
    shippingCity.innerHTML = '...'
    assignedAt.innerHTML = '...'
    deliveryRequestedAt.innerHTML = '...'
    paidAt.innerHTML = '...'
    shippedAt.innerHTML = '...'
    shredRequestedAt.innerHTML = '...'
    shreddedAt.innerHTML = '...'
    shippingType.innerHTML = '...'
    price.innerHTML = '...'
    trackingNumber.innerHTML = '...'

    id.innerHTML = '# ' + data.real_id;
    title.innerHTML = data.title;

    let statusBadgeColor = ''
    const documentStatus = data._document_status.status_label;
    if (documentStatus === 'paid' || documentStatus === 'delivered') {
        statusBadgeColor = 'green'
    } else if (documentStatus === 'shipped') {
        statusBadgeColor = 'blue'
    } else {
        statusBadgeColor = 'orange'
    }
    status.classList.add(statusBadgeColor)
    Array.from(status.children).forEach(child => {
        child.classList.add(statusBadgeColor)
        if (child.id === 'status-badge-text') {
            child.innerHTML = documentStatus
        }
    });

    if (data._document_status_changes_of_documents.assigned_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.assigned_at);

        assignedAt.innerHTML = timestamp.toLocaleString();
        assignedAtBox.style.display = 'flex';
    } else {
        assignedAtBox.style.display = 'none';
    }
    if (data._document_status_changes_of_documents.delivery_requested_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.delivery_requested_at);

        deliveryRequestedAt.innerHTML = timestamp.toLocaleString()
        deliveryRequestedAtBox.style.display = 'flex';
    } else {
        deliveryRequestedAtBox.style.display = 'none';
    }
    if (data._document_status_changes_of_documents.paid_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.paid_at);

        paidAt.innerHTML = timestamp.toLocaleString()
        paidAtBox.style.display = 'flex';
    } else {
        paidAtBox.style.display = 'none';
    }
    if (data._document_status_changes_of_documents.shipped_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shipped_at);

        shippedAt.innerHTML = timestamp.toLocaleString()
        shippedAtBox.style.display = 'flex';
    } else {
        shippedAtBox.style.display = 'none';
    }
    if (data._document_status_changes_of_documents.shred_requested_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shred_requested_at);

        shredRequestedAt.innerHTML = timestamp.toLocaleString()
        shredRequestedAtBox.style.display = 'flex';
    } else {
        shredRequestedAtBox.style.display = 'none';
    }
    if (data._document_status_changes_of_documents.shredded_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shredded_at);

        shreddedAt.innerHTML = timestamp.toLocaleString()
        shreddedAtBox.style.display = 'flex';
    } else {
        shreddedAtBox.style.display = 'none';
    }

    shippingName.innerHTML = data._user.first_name + ' ' + data._user.last_name;
    if (data._document_addresses_of_documents) {
        shippingAddress.innerHTML = data._document_addresses_of_documents.street + ' ' + data._document_addresses_of_documents.number;
        shippingCity.innerHTML = data._document_addresses_of_documents.zip + ' ' + data._document_addresses_of_documents.country;
        shippingAddressBox.style.display = 'flex';
    } else {
        shippingAddressBox.style.display = 'none';
    }

    let hideData = true;
    if (data.shipping_type) {
        hideData = false;
        shippingType.innerHTML = data.shipping_type;
        shippingTypeBox.style.display = 'flex';
    } else {
        shippingTypeBox.style.display = 'none';
    }
    if (data._choosed_shipping_tariffs) {
        hideData = false;
        price.innerHTML = data._choosed_shipping_tariffs.price + ' $';
        priceBox.style.display = 'flex';
    } else {
        priceBox.style.display = 'none';
    }
    if (data.tracking_code) {
        hideData = false;
        trackingNumber.innerHTML = data.tracking_code;
        trackingNumberBox.style.display = 'flex';
    } else {
        trackingNumberBox.style.display = 'none';
    }
    if (hideData) {
        dataBox.style.display = 'none';
    } else {
        dataBox.style.display = 'flex';
    }

    downloadDocument.addEventListener("click", function() {
        const pdfUrl = data._files_of_documents.file.url;
        const fileName = pdfUrl.split('/').pop().split('?')[0];

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = fileName;
        link.target = '_blank';
        link.click();
    });
    if (documentStatus !== 'new' && documentStatus !== 'waiting_for_payment') {
        requestShreddingBox.style.display = 'none';
    } else {
        requestShredding.addEventListener('click', function () {
            modal.classList.add('hide');

            const closestElement = document.querySelector(
                `[data-modal-open="request-shred-document-popup"][data-id-documents-id="${data.id}"]`
            );

            closestElement.click()
        })
    }
    if (menu !== 6) {
        deleteDocumentBox.style.display = 'none';
    } else {
        deleteDocument.addEventListener('click', function () {
            modal.classList.add('hide');

            const closestElement = document.querySelector(
                `[data-modal-open="delete-document-popup"][data-id-documents-id="${data.id}"]`
            );

            closestElement.click()
        })
    }
    if ((documentStatus !== 'delivered' && documentStatus !== 'shredded') || data.archived === true) {
        archiveDocumentBox.style.display = 'none';
    } else {
        archiveDocument.addEventListener('click', function () {
            modal.classList.add('hide');

            const closestElement = document.querySelector(
                `[data-modal-open="archive-document-popup"][data-id-documents-id="${data.id}"]`
            );

            closestElement.click()
        })
    }
    if (data.payment_link === '' || documentStatus === 'paid' || documentStatus === 'shipped' || documentStatus === 'delivered') {
        payment.style.display = 'none';
    } else {
        payment.addEventListener('click', function () {
            window.open(data.payment_link, '_blank');
        })
    }

    setPdf(data._files_of_documents.file.url)
}

function setPdf(pdfUrl) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
        pdf.getPage(1).then((firstPage) => {
            const containerWidth = pdfContainer.clientWidth;
            const initialViewport = firstPage.getViewport({ scale: 1 });
            const scale = containerWidth / initialViewport.width;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                pdf.getPage(pageNum).then((page) => {
                    const pageContainer = document.createElement('div');
                    pageContainer.classList.add('page-container');

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    pageContainer.appendChild(canvas);
                    pdfContainer.appendChild(pageContainer);

                    const viewport = page.getViewport({ scale: scale });
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    page.render(renderContext);
                }).catch((error) => {
                    console.error(`Error while rendering page ${pageNum}:`, error);
                });
            }
        }).catch((error) => {
            console.error('Error while loading first page:', error);
        });
    }).catch((error) => {
        console.error('Error while loading PDF:', error);
    });
}

const countriesText = `
  Afghanistan
  Albania
  Algeria
  Andorra
  Angola
  Antigua & Deps
  Argentina
  Armenia
  Aruba
  Australia
  Austria
  Azerbaijan
  Bahamas
  Bahrain
  Bangladesh
  Barbados
  Belarus
  Belgium
  Belize
  Benin
  Bhutan
  Bolivia
  Bonaire, Sint Eustatius and Saba
  Bosnia Herzegovina
  Botswana
  Brazil
  Brunei
  Bulgaria
  Burkina
  Burundi
  Cambodia
  Cameroon
  Canada
  Cape Verde
  Central African Rep
  Chad
  Channel Islands
  Chile
  China
  Colombia
  Comoros
  Congo
  Congo {Democratic Rep}
  Costa Rica
  Croatia
  Cuba
  Curaçao
  Cyprus
  Czech Republic
  Denmark
  Djibouti
  Dominica
  Dominican Republic
  East Timor
  Ecuador
  Egypt
  El Salvador
  Equatorial Guinea
  Eritrea
  Estonia
  Ethiopia
  Fiji
  Finland
  France
  Gabon
  Gambia
  Georgia
  Germany
  Ghana
  Greece
  Grenada
  Guatemala
  Guinea
  Guinea-Bissau
  Guyana
  Haiti
  Honduras
  Hong Kong
  Hungary
  Iceland
  India
  Indonesia
  Iran
  Iraq
  Ireland {Republic}
  Israel
  Italy
  Ivory Coast
  Jamaica
  Japan
  Jordan
  Kazakhstan
  Kenya
  Kiribati
  Korea North
  Korea South
  Kosovo
  Kuwait
  Kyrgyzstan
  Laos
  Latvia
  Lebanon
  Lesotho
  Liberia
  Libya
  Liechtenstein
  Lithuania
  Luxembourg
  Macau
  Macedonia
  Madagascar
  Malawi
  Malaysia
  Maldives
  Mali
  Malta
  Marshall Islands
  Mauritania
  Mauritius
  Mexico
  Micronesia
  Moldova
  Monaco
  Mongolia
  Montenegro
  Morocco
  Mozambique
  Myanmar, {Burma}
  Namibia
  Nauru
  Nepal
  Netherlands
  New Zealand
  Nicaragua
  Niger
  Nigeria
  Norway
  Oman
  Pakistan
  Palau
  Panama
  Papua New Guinea
  Paraguay
  Peru
  Philippines
  Poland
  Portugal
  Qatar
  Romania
  Russian Federation
  Rwanda
  St Kitts & Nevis
  St Lucia
  Saint Vincent & the Grenadines
  Samoa
  San Marino
  Sao Tome & Principe
  Saudi Arabia
  Senegal
  Serbia
  Seychelles
  Sierra Leone
  Singapore
  Sint Maarten
  Slovakia
  Slovenia
  Solomon Islands
  Somalia
  South Africa
  South Sudan
  Spain
  Sri Lanka
  Sudan
  Suriname
  Swaziland
  Sweden
  Switzerland
  Syria
  Taiwan
  Tajikistan
  Tanzania
  Thailand
  Togo
  Tonga
  Trinidad & Tobago
  Tunisia
  Turkey
  Turkmenistan
  Tuvalu
  Uganda
  Ukraine
  United Arab Emirates
  United Kingdom
  United States
  Uruguay
  Uzbekistan
  Vanuatu
  Vatican City
  Venezuela
  Vietnam
  Yemen
  Zambia
  Zimbabwe
`;

const countries = countriesText.trim().split("\n");
const elements = document.querySelectorAll('[data-name="country-select"]');

elements.forEach(element => {
    countries.forEach(country => {
        const option = document.createElement("option");
        option.textContent = country.trim();
        option.value = country.trim();
        element.appendChild(option);
    });
})

function setUserDetails() {
    const usersDetailsElements = document.querySelectorAll('[data-users-details]');

    usersDetailsElements.forEach(element => {
        if (!element.hasAttribute("data-click-listener-added")) {
            element.addEventListener("click", e => {
                let data = Array.from(allData[2][1]).find(item => item.id.toString().match(element.getAttribute("data-users-details")));

                fillUsersDetails(data);

                usersDetails.classList.remove("hide");
                usersTable.classList.add("hide");

                activeUserDetailsElement = element;
            })

            element.setAttribute("data-click-listener-added", "true");
        }
    })
}

function fillUsersDetails(data) {
    const name = document.getElementById('users-details-name');
    const id = document.getElementById('users-details-id');
    const city = document.getElementById('users-details-city');
    const street = document.getElementById('users-details-street');
    const country = document.getElementById('users-details-country');
    const email = document.getElementById('users-details-email');
    const phone = document.getElementById('users-details-phone');
    const since = document.getElementById('users-details-since');

    const phoneIcon = document.getElementById('users-details-phone-icon');
    const emailIcon = document.getElementById('users-details-email-icon');
    const editIcon = document.getElementById('users-details-edit-icon');
    const deleteIcon = document.getElementById('users-details-delete-icon');

    const hiddenInput = document.createElement("input");
    hiddenInput.style.display = "none";
    document.body.appendChild(hiddenInput);

    const iti = window.intlTelInput(hiddenInput, {
        initialCountry: data.phone_country,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    });

    const itiWrapper = hiddenInput.closest('.iti');
    if (itiWrapper) {
        itiWrapper.classList.add("hidden-iti");
    }

    name.innerText = data.first_name + ' ' + data.last_name;
    id.innerHTML = '#' + data.id;
    city.innerHTML = data._user_addresses_of_user.street + ' ' + data._user_addresses_of_user.number + ','
    street.innerHTML = data._user_addresses_of_user.zip + ' ' + data._user_addresses_of_user.city + ','
    country.innerHTML = data._user_addresses_of_user.state + ', ' + data._user_addresses_of_user.country
    email.innerHTML = data.email
    phone.innerHTML = "+" + iti.getSelectedCountryData().dialCode + data.phone_number
    const createdAt = new Date(data.created_at);
    since.innerHTML = createdAt.toLocaleString()

    phoneIcon.addEventListener("click", () => {
        window.location.href = `tel:${data.phone_number}`;
    });
    emailIcon.addEventListener("click", () => {
        window.location.href = `mailto:${data.email}`;
    });
    editIcon.setAttribute('data-modal-open', 'edit-user-popup');
    editIcon.setAttribute('data-fill-2-1', data.id);
    editIcon.setAttribute('data-id-user-id', data.id);
    deleteIcon.setAttribute('data-modal-open', 'delete-user-popup');
    deleteIcon.setAttribute('data-id-user-id', data.id);
    setModals(2);

    selectedUserId = data.id;

    fillTable(2, 2);
    fillTable(2, 3, 'aircraft_registration_certificate')
    fillTable(2, 4, 'airman_certificate')
}

export function getTabCount() {
    const menu1tab2 = document.getElementById('admin-menu1-tab2-text');
    const menu1tab3 = document.getElementById('admin-menu1-tab3-text');
    const menu1tab4 = document.getElementById('admin-menu1-tab4-text');
    const menu1tab5 = document.getElementById('admin-menu1-tab5-text');
    const menu1tab6 = document.getElementById('admin-menu1-tab6-text');
    const menu3tab1 = document.getElementById('admin-menu3-tab1-text');
    const menu3tab2 = document.getElementById('admin-menu3-tab2-text');

    documentFile.getCountByStatus().then(data => {
        menu1tab2.innerHTML = getTabTitle(1, 2) + ' (' + getCount(data, [2]) + ')'
        menu1tab3.innerHTML = getTabTitle(1, 3) + ' (' + getCount(data, [3]) + ')'
        menu1tab4.innerHTML = getTabTitle(1, 4) + ' (' + getCount(data, [4]) + ')'
        menu1tab5.innerHTML = getTabTitle(1, 5) + ' (' + getCount(data, [5, 6]) + ')'
        menu1tab6.innerHTML = getTabTitle(1, 6) + ' (' + getCount(data, [7]) + ')'
        menu3tab1.innerHTML = getTabTitle(3, 1) + ' (' + getCount(data, [7]) + ')'
        menu3tab2.innerHTML = getTabTitle(3, 2) + ' (' + getCount(data, [8]) + ')'
    })

    function getCount(data, tabs) {
        let sum = 0;

        tabs.forEach(id => {
            const item = data.find(entry => entry.documents_document_status_id === id);
            if (item) {
                sum += item._documents_of_document_status;
            }
        });

        return sum;
    }
}
