import User from '../User';
import Document from '../Document';
import ShippingTariff from '../ShippingTariff';
import TableRow from '../TableRow';

const user = new User();
const documentFile = new Document();
const shippingTariff = new ShippingTariff();
const tableRow = new TableRow();

const adminMenu1 = document.getElementById('admin-menu1');
const adminMenu2 = document.getElementById('admin-menu2');
const adminMenu3 = document.getElementById('admin-menu3');
const adminMenu4 = document.getElementById('admin-menu4');

const searchInputs = document.getElementsByClassName('search-input');
let lastSearchInput = '';

user.authenticate();

adminMenu1.addEventListener('click', function (event) {
    fillTable(1, 1)
    fillTable(1, 2, '2')
    fillTable(1, 3, '3')
    fillTable(1, 4, '4')
    fillTable(1, 5, '5,6')
    fillTable(1, 6, '7,8')

    resetSearchInput()
})
adminMenu2.addEventListener('click', function (event) {
    fillTable(2, 1)

    resetSearchInput()
})
adminMenu3.addEventListener('click', function (event) {
    fillTable(3, 1, '7')
    fillTable(3, 2, '8')

    resetSearchInput()
})
adminMenu4.addEventListener('click', function (event) {
    fillTable(4, 1)

    resetSearchInput()
})

adminMenu2.click()

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


function fillTable(menu, tab, statusIds = null, page = 1) {
    if (statusIds === 'null') {
        statusIds = null
    }
    const columns = getColumns(menu, tab);
    const columnElements = [];
    const rowHTML = [];

    columns.forEach(column => {
        columnElements[column] = document.getElementById('admin-menu' + menu + '-tab' + tab + '-' + column);
    })

    const text = document.getElementById('admin-menu' + menu + '-tab' + tab + '-text');
    const number = document.getElementById('admin-menu' + menu + '-tab' + tab + '-number');
    const pagination = document.getElementById('admin-menu' + menu + '-tab' + tab + '-table').getElementsByClassName('pagination-buttons')[0];
    const search = document.getElementById('admin-menu' + menu + '-tab' + tab + '-search');

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
    if (menu === 2) {
        model = user;
        modelName = 'user'
    } else if (menu === 4) {
        model = shippingTariff;
        modelName = 'shippingTariff'
    }

    model.getAll(page, 10, search.value, statusIds !== null ? statusIds : undefined).then((data) => {
        number.innerHTML = data.itemsTotal
        if (search.value === '') {
            text.innerHTML = getTabTitle(menu, tab) + ` (${data.itemsTotal})`
        }

        data.items.forEach((item) => {
            if (statusIds) {
                status = item._document_status.status_label;
                if (status === 'payed' || status === 'delivered') {
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
                    rowHTML[column].push(tableRow.getActionRow(menu, tab));
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
        },
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
    };

    return columns[menu]?.[tab] || 'unknown';
}


setModals();

function setModals() {
    const modals = getModals();

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

        submitButton.addEventListener("click", function (event) {
            const formData = new FormData(form);

            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    formData.append(checkbox.name, 0);
                } else {
                    formData.delete(checkbox.name);
                    formData.append(checkbox.name, 1);
                }
            });

            for (const [key, value] of formData.entries()) {
                if (!value.trim()) {
                    console.error(`Fields empty.`);
                    return;
                }
            }

            Object.keys(item.files).forEach((fileName) => {
                const fileArray = item.files[fileName];
                fileArray.forEach((file, key) => {
                    formData.append(fileName, file[0]);
                });
            });

            fetch(item.action, {
                method: item.method,
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        console.error("Error:", error);
                    }
                    return response.json();
                })
                .then((data) => {
                    modal.classList.add('hide');

                    form.reset();

                    dropZones.forEach(dropZone => {
                        const outputDivs = dropZone.querySelectorAll(".output");
                        outputDivs.forEach(div => div.remove());
                        dropZone.firstElementChild.style.display = 'flex';
                    });
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
    })
}

function getModals() {
    return {
        1: {
            modal: 'add-tariff-popup',
            action: 'https://x8ki-letl-twmt.n7.xano.io/api:SB0L29DX/shipping_tariffs',
            method: 'POST',
            files: []
        },
        2: {
            modal: 'add-document-popup',
            action: 'https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents',
            method: 'POST',
            files: []
        },
    }
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

const createUser = document.getElementById('create-document-user');

populateSelectWithUsers()

function populateSelectWithUsers() {
    user.getAll(1, 999999).then((users) => {
        if (users.items.length) {
            let userOptions = '';
            users.items.forEach((user) => {
                userOptions += `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`
            })

            createUser.innerHTML += userOptions;
        }
    })
}