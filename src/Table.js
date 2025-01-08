// import User from './User';
// import Document from './Document';
// import ShippingTariff from './ShippingTariff';
// import TableRow from './TableRow';
import User from 'https://service-agent.pages.dev/src/User.js';
import Document from 'https://service-agent.pages.dev/src/Document.js';
import ShippingTariff from 'https://service-agent.pages.dev/src/ShippingTariff.js';
import TableRow from 'https://service-agent.pages.dev/src/TableRow.js';

const user = new User();
const documentFile = new Document();
const shippingTariff = new ShippingTariff();
const tableRow = new TableRow();

let allData = [];

let url = '';
let method = '';
let modalName = '';
let activeElement;
let activeRole;
let activeUserDetailsElement;
let selectedUserId = null;

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

export function resetSearchInput() {
    Array.from(searchInputs).forEach(input => {
        input.value = '';
        lastSearchInput = ''
    });
}

export function fillTable(menu, tab, statusIds = null, page = 1) {
    let isUserDocumentsInAdmin = false;
    if(menu === 2 && tab === 2) {
        isUserDocumentsInAdmin = true;
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

    if (!isUserDocumentsInAdmin) {
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
    if (activeRole === 'user') {
        modelName = 'user_document'
    } else if (menu === 2 && tab === 1) {
        model = user;
        modelName = 'user'
    } else if (menu === 2 && tab === 2) {
        modelName = 'user_document_admin'
    } else if (menu === 4) {
        model = shippingTariff;
        modelName = 'shippingTariff'
    }

    let methodName = 'getAll';
    let archived = null
    if (activeRole === 'user') {
        archived = statusIds
        statusIds = null
        methodName = 'getAllByAuthUser'
    }
    if (modelName === 'user_document_admin'){
        methodName = 'getAllByUser'
    }

    model.callMethod(methodName, page, 10, search ? search.value : '', statusIds !== null ? statusIds : undefined, archived !== null ? archived : undefined, selectedUserId !== null ? selectedUserId : undefined).then((data) => {
        if (!isUserDocumentsInAdmin) {
            number.innerHTML = data.itemsTotal

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

        if (!isUserDocumentsInAdmin) {
            setModals(menu);
        } else {
            setModals(1);
        }
        if (menu === 2) {
            setUserDetails();
        }

        createPagination(menu, tab, statusIds, pagination, data);

        loader.style.display = 'none';
    })
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

document.addEventListener('DOMContentLoaded', () => {
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
});

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
                                element.checked = false;
                                if (fillData[element.getAttribute('name')] !== '' && element.value === fillData[element.getAttribute('name')]) {
                                    element.checked = true;
                                }
                            }

                            if (element.hasAttribute('data-readonly')) {
                                element.setAttribute("readonly", true);
                            }
                            if (element.hasAttribute('data-disabled')) {
                                element.setAttribute("disabled", true);
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

                    certificatesTable.classList.add('hide');
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
            });
        });

        dropZones.forEach(dropZone => {
            const fileName = dropZone.getAttribute('data-dropzone-name')

            item.files[fileName] = [];

            createDropZone(dropZone, item, fileName);
        });

        const handleClick = () => {
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

                if (modalName !== 'add-certificate-popup') {
                    const entries = Array.from(formData.entries());
                    for (const [key, value] of entries) {
                        if (key.includes('.')) {
                            let modifiedKey = key.split('.').pop();

                            formData.delete(key);
                            formData.append(modifiedKey, value);
                        }

                        if (!value.trim()) {
                            errorMessage.innerHTML = 'Please, fill in all fields.';
                            errorWrapper.classList.remove('hide');

                            setTimeout(function () {
                                errorWrapper.classList.add('hide');
                            }, 3000);

                            return;
                        }
                    }
                }
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
                }
            } else {
                let jsonObject = {};

                formData.forEach((value, key) => {
                    jsonObject[key] = value;
                });

                requestData.body = JSON.stringify(jsonObject);

                requestData.headers = {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            }

            loader.style.display = 'flex'

            fetch(url, requestData)
                .then((response) => {
                    if (!response.ok) {
                        errorMessage.innerHTML = 'Server Error! Please, try again or contact support.';
                        errorWrapper.classList.remove('hide');

                        setTimeout(function() {
                            errorWrapper.classList.add('hide');
                        }, 3000);
                    }
                })
                .then((data) => {
                    modal.classList.add('hide');

                    activeElement.click()
                    if (activeUserDetailsElement) {
                        activeUserDetailsElement.click()
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

                    if (menu === 4) {
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
                    }
                })
                .catch((error) => {
                    errorMessage.innerHTML = 'Server Error! Please, try again or contact support.';
                    errorWrapper.classList.remove('hide');

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
    const modals = {
        'initial-admin': {
            1: {
                modal: 'add-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents',
                method: 'POST',
                files: [],
                success_message: 'The document has been successfully uploaded and assigned to a user.',
            },
            2: {
                modal: 'add-tariff-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX/shipping_tariffs',
                method: 'POST',
                files: [],
                success_message: 'The tariff has been successfully created.',
            },
            3: {
                modal: 'edit-user-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/user/{user_id}',
                method: 'PUT',
                files: [],
                success_message: 'The user has been successfully updated.',
            },
        },
        'initial-user': {
            1: {
                modal: 'edit-user-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/user/{user_id}',
                method: 'PUT',
                files: [],
                success_message: 'Your profile has been successfully updated.',
            },
            2: {
                modal: 'add-certificate-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1/certificates',
                method: 'POST',
                files: [],
                success_message: 'The certificate has been successfully created.',
            },
        },
        1: {
            1: {
                modal: 'shred-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully shredded.',
            },
            2: {
                modal: 'delete-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            },
            3: {
                modal: 'edit-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            4: {
                modal: 'forward-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            },
            5: {
                modal: 'payment-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully updated.',
            }
        },
        2: {
            1: {
                modal: 'edit-user-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/user/{user_id}',
                method: 'PUT',
                files: [],
                success_message: 'The user has been successfully updated.',
            },
            2: {
                modal: 'delete-user-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/user/{user_id}',
                method: 'DELETE',
                files: [],
                success_message: 'The user has been successfully deleted.',
            }
        },
        3: {
            1: {
                modal: 'shred-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully shredded.',
            },
            2: {
                modal: 'delete-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            }
        },
        4: {
            1: {
                modal: 'edit-tariff-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX/shipping_tariffs/{shipping_tariffs_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The tariff has been successfully updated.',
            },
            2: {
                modal: 'delete-tariff-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:SB0L29DX/shipping_tariffs/{shipping_tariffs_id}',
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
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The forwarding has been successfully requested.',
            },
            3: {
                modal: 'request-shred-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The shredding has been successfully requested.',
            },
            4: {
                modal: 'delete-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
            },
            5: {
                modal: 'archive-document-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'PATCH',
                files: [],
                success_message: 'The document has been successfully archived.',
            },
            6: {
                modal: 'edit-document-address-popup',
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/document_addresses/{document_addresses_id}',
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
                action: 'https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: [],
                success_message: 'The document has been successfully deleted.',
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
                userOptions += `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`
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
    shippingTariff.getAll(1, 999999).then((shippingTariffs) => {
        if (shippingTariffs.items.length) {
            let shippingTariffsOptions = '';
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

    const assignedAt = document.getElementById('document-assigned-at');
    const deliveryRequestedAt = document.getElementById('document-delivery-requested-at');
    const paidAt = document.getElementById('document-paid-at');
    const shippedAt = document.getElementById('document-shipped-at');
    const shredRequestedAt = document.getElementById('document-shred-requested-at');
    const shreddedAt = document.getElementById('document-shredded-at');

    const shippingType = document.getElementById('document-shipping-type');
    const price = document.getElementById('document-price');
    const trackingNumber = document.getElementById('document-tracking-number');

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
    }
    if (data._document_status_changes_of_documents.delivery_requested_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.delivery_requested_at);

        deliveryRequestedAt.innerHTML = timestamp.toLocaleString()
    }
    if (data._document_status_changes_of_documents.paid_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.paid_at);

        paidAt.innerHTML = timestamp.toLocaleString()
    }
    if (data._document_status_changes_of_documents.shipped_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shipped_at);

        shippedAt.innerHTML = timestamp.toLocaleString()
    }
    if (data._document_status_changes_of_documents.shred_requested_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shred_requested_at);

        shredRequestedAt.innerHTML = timestamp.toLocaleString()
    }
    if (data._document_status_changes_of_documents.shredded_at) {
        const timestamp = new Date(data._document_status_changes_of_documents.shredded_at);

        shreddedAt.innerHTML = timestamp.toLocaleString()
    }

    shippingName.innerHTML = data._user.first_name + ' ' + data._user.last_name;
    if (data._document_addresses_of_documents) {
        shippingAddress.innerHTML = data._document_addresses_of_documents.street + ' ' + data._document_addresses_of_documents.number;
    }
    if (data._document_addresses_of_documents) {
        shippingCity.innerHTML = data._document_addresses_of_documents.zip + ' ' + data._document_addresses_of_documents.country;
    }

    if (data.shipping_type) {
        shippingType.innerHTML = data.shipping_type;
    }
    if (data._choosed_shipping_tariffs) {
        price.innerHTML = data._choosed_shipping_tariffs.price + ' $';
    }
    if (data.tracking_code) {
        trackingNumber.innerHTML = data.tracking_code;
    }

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
        option.textContent = country.replace(/\s+/g, '');
        option.value = country.replace(/\s+/g, '');
        element.appendChild(option);
    });
})

function setUserDetails() {
    const usersDetailsElements = document.querySelectorAll('[data-users-details]');

    usersDetailsElements.forEach(element => {
        element.addEventListener("click", e => {
            let data = Array.from(allData[2][1]).find(item => item.id.toString().match(element.getAttribute("data-users-details")));

            fillUsersDetails(data);

            usersDetails.classList.remove("hide");
            usersTable.classList.add("hide");

            activeUserDetailsElement = element;
        })
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

    name.innerText = data.first_name + ' ' + data.last_name;
    id.innerHTML = '#' + data.id;
    city.innerHTML = data._user_addresses_of_user.street + ' ' + data._user_addresses_of_user.number + ','
    street.innerHTML = data._user_addresses_of_user.zip + ' ' + data._user_addresses_of_user.city + ','
    country.innerHTML = data._user_addresses_of_user.state + ', ' + data._user_addresses_of_user.country
    email.innerHTML = data.email
    phone.innerHTML = data.phone_number
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