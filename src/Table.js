// import User from './User';
// import Document from './Document';
// import ShippingTariff from './ShippingTariff';
// import TableRow from './TableRow';
// import User from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/User.js';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/User.js';
// import Document from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/Document.js';
import Document from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/Document.js';
// import ShippingTariff from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/ShippingTariff.js';
import ShippingTariff from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/ShippingTariff.js';
// import TableRow from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/TableRow.js';
import TableRow from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/TableRow.js';

const user = new User();
const documentFile = new Document();
const shippingTariff = new ShippingTariff();
const tableRow = new TableRow();

let allData = [];

let url = '';
let method = '';
let activeElement;
let activeRole;

const searchInputs = document.getElementsByClassName('search-input');
let lastSearchInput = '';

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

function resetSearchInput() {
    Array.from(searchInputs).forEach(input => {
        input.value = '';
        lastSearchInput = ''
    });
}

export function fillTable(menu, tab, statusIds = null, page = 1) {
    resetSearchInput()

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
    const pagination = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-table').getElementsByClassName('pagination-buttons')[0];
    const search = document.getElementById(activeRole + '-menu' + menu + '-tab' + tab + '-search');

    search.setAttribute('data-menu', menu)
    search.setAttribute('data-tab', tab)
    search.setAttribute('data-status-ids', statusIds)
    search.setAttribute('data-page', page)

    if (search.value !== lastSearchInput) {
        page = 1;
    }
    lastSearchInput = search.value

    let status, statusBadgeColor;

    let model = documentFile;
    let modelName = 'document';
    if (activeRole === 'user') {
        modelName = 'user_document'
    } else if (menu === 2) {
        model = user;
        modelName = 'user'
    } else if (menu === 4) {
        model = shippingTariff;
        modelName = 'shippingTariff'
    }

    let methodName = 'getAll';
    if (activeRole === 'user') {
        methodName = 'getAllByUser'
    }

    model.callMethod(methodName, page, 10, search.value, statusIds !== null ? statusIds : undefined).then((data) => {
        number.innerHTML = data.itemsTotal

        if (search.value === '' && activeRole === 'admin') {
            text.innerHTML = getTabTitle(menu, tab) + ` (${data.itemsTotal})`
        }

        if (!Array.isArray(allData[menu])) {
            allData[menu] = [];
        }
        allData[menu][tab] = data.items;

        data.items.forEach((item) => {
            if (statusIds) {
                status = item._document_status.status_label;
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

        setModals(menu);

        createPagination(menu, tab, statusIds, pagination, data);
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

    paginationHTML += createPaginationButton(menu, tab, statusIds, data.curPage, data.curPage, true);

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

function createPaginationButton(menu, tab, statusIds, label, page = null, isNumber = false) {
    const pageData = page !== null ? ` data-menu="${menu}" data-tab="${tab}" data-status-ids="${statusIds}" data-page="${page}"` : '';
    const numberClass = isNumber ? ' number' : '';
    return `
        <div class="pagination-btn${numberClass}" ${pageData}>
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

function getTabTitle(menu, tab) {
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
            1: 'All Requests',
            2: 'Shred Requests',
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
    };

    return columns[menu]?.[tab] || 'unknown';
}

if (activeRole === 'admin') {
    setModals('initial');
}

function setModals(menu) {
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

                let idAttribute = Array.from(button.attributes).find(attr => attr.name.startsWith('data-id-'));
                if (idAttribute) {
                    let idAttributeName = idAttribute.name
                        .replace('data-id-', '')
                        .replace(/-([a-z])/g, (_, char) => `_${char}`);

                    if (item.action.includes(idAttributeName)) {
                        url = item.action.replace(`{${idAttributeName}}`, idAttribute.value);
                        method = item.method;
                    } else {
                        let parts = item.action.split("/");
                        parts[parts.length - 1] = idAttribute.value;
                        url = parts.join("/");
                        method = item.method;
                    }
                }

                let fillAttribute = Array.from(button.attributes).find(attr => attr.name.startsWith('data-fill-'));
                if (fillAttribute) {
                    let fillAttributeName = fillAttribute.name
                        .replace('data-fill-', '')

                    let tab = fillAttributeName.split('-');

                    let fillData = Array.from(allData[tab[0]][tab[1]]).find(item => item.id.toString().match(fillAttribute.value))
                    let elementsWithName = form.querySelectorAll('[name]');

                    elementsWithName.forEach(element => {
                        if (element.getAttribute('name').includes(".")) {
                            let parts = element.getAttribute('name').split(".");
                            element.value = fillData['_' + parts[0]][parts[1]] ?? "";
                        } else {
                            element.value = fillData[element.getAttribute('name')] ?? "";
                        }

                        if (element.getAttribute('name').includes("document_user_address")) {
                            let address = fillData?._user?._user_addresses_of_user;

                            if (address) {
                                element.value = address.street + ' ' + address.number + ', ' + address.zip + ' ' + address.city + ' - ' + address.country
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

                modal.classList.remove('hide');
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault()

                modal.classList.add('hide');
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

                if (item.modal === 'request-forward-document-popup') {
                    formData.delete('shipping_type');
                    const selectedShippingType = document.querySelector('input[name="shipping_type"]:checked');
                    if (selectedShippingType) {
                        const selectedValue = selectedShippingType.getAttribute("data-choice-value");

                        formData.append('shipping_type', selectedValue);
                    } else {
                        formData.append('shipping_type', '');
                    }
                }

                for (const [key, value] of formData.entries()) {
                    if (!value.trim()) {
                        console.log(key)
                        console.error(`Fields empty.`);

                        return;
                    }
                }

                if (item.modal === 'request-forward-document-popup') {
                    formData.append('document_status_id', 2)
                } else if (item.modal === 'request-shred-document-popup') {
                    formData.append('document_status_id', 7)
                }  else if (item.modal === 'shred-document-popup') {
                    formData.append('document_status_id', 8)
                }  else if (item.modal === 'payment-document-popup') {
                    formData.append('document_status_id', 3)
                }  else if (item.modal === 'forward-document-popup') {
                    formData.append('document_status_id', 5)
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
            }
            console.log(requestData.body)

            fetch(url, requestData)
                .then((response) => {
                    if (!response.ok) {
                        console.error("Error:", error);
                    }
                    return response.json();
                })
                .then((data) => {
                    modal.classList.add('hide');

                    activeElement.click()

                    if (form) {
                        form.reset();

                        dropZones.forEach(dropZone => {
                            const outputDivs = dropZone.querySelectorAll(".output");
                            outputDivs.forEach(div => div.remove());
                            dropZone.firstElementChild.style.display = 'flex';
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }

        if (!submitButton.hasAttribute('data-clicked')) {
            submitButton.addEventListener("click", function() {
                handleClick(key);
            });
            submitButton.setAttribute('data-clicked', key)
        }
    })
}

function getModals(menu) {
    const modals = {
        'initial': {
            1: {
                modal: 'add-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents',
                method: 'POST',
                files: []
            },
            2: {
                modal: 'add-tariff-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:SB0L29DX/shipping_tariffs',
                method: 'POST',
                files: []
            },
        },
        1: {
            1: {
                modal: 'shred-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            2: {
                modal: 'delete-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: []
            },
            3: {
                modal: 'edit-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            4: {
                modal: 'forward-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            5: {
                modal: 'payment-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            }
        },
        2: {
            1: {
                modal: 'edit-user-popup',
                action: '',
                method: 'PATCH',
                files: []
            },
            2: {
                modal: 'delete-user-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:wGjIQByJ/user/{user_id}',
                method: 'DELETE',
                files: []
            }
        },
        3: {
            1: {
                modal: 'shred-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            2: {
                modal: 'delete-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: []
            }
        },
        4: {
            1: {
                modal: 'edit-tariff-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:SB0L29DX/shipping_tariffs/{shipping_tariffs_id}',
                method: 'PATCH',
                files: []
            },
            2: {
                modal: 'delete-tariff-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:SB0L29DX/shipping_tariffs/{shipping_tariffs_id}',
                method: 'DELETE',
                files: []
            },
        },
        5: {
            1: {
                modal: 'request-forward-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            2: {
                modal: 'request-shred-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:JGAigVjM/documents/{documents_id}',
                method: 'PATCH',
                files: []
            },
            3: {
                modal: 'delete-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: []
            }
        },
        6: {
            1: {
                modal: 'delete-document-popup',
                action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents/{documents_id}',
                method: 'DELETE',
                files: []
            }
        }
    }

    return modals[menu] || 'unknown';
}

function createDropZone(dropZone, item, fileName) {
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
        item.files[fileName].length = 0
        item.files[fileName].push(e.dataTransfer.files)

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
    const forwardDocumentShippingTariff = document.getElementById('forward-document-shipping-tariff');
    const paymentDocumentShippingTariff = document.getElementById('payment-document-shipping-tariff');

    shippingTariff.getAll(1, 999999).then((shippingTariffs) => {
        if (shippingTariffs.items.length) {
            let shippingTariffsOptions = '';
            shippingTariffs.items.forEach((shippingTariff) => {
                shippingTariffsOptions += `<option value="${shippingTariff.id}">${shippingTariff.region} ${shippingTariff.label.charAt(0).toUpperCase() + shippingTariff.label.slice(1)}</option>`
            })

            editDocumentShippingTariff.innerHTML += shippingTariffsOptions;
            forwardDocumentShippingTariff.innerHTML += shippingTariffsOptions;
            paymentDocumentShippingTariff.innerHTML += shippingTariffsOptions;
        }
    })
}