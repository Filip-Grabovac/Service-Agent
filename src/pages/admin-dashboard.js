import User from '../User.js';
import {fillTable, updateActiveElement, updateActiveRole, populateSelectWithUsers, populateSelectWithShippingTariffs, setModals, resetSearchInput, getTabCount} from '../Table.js';


const user = new User();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const gear = document.getElementById('gear');
const gearWrapper = document.getElementById('gear-wrapper');
const newDocumentMenuWrapper = document.getElementById('new-document-menu-wrapper');
const usersLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 3"]`);

const adminMenu1 = document.getElementById('admin-menu1');
const adminMenu1Tab1 = document.getElementById('admin-menu1-tab1');
const adminMenu1Tab2 = document.getElementById('admin-menu1-tab2');
const adminMenu1Tab3 = document.getElementById('admin-menu1-tab3');
const adminMenu1Tab4 = document.getElementById('admin-menu1-tab4');
const adminMenu1Tab5 = document.getElementById('admin-menu1-tab5');
const adminMenu1Tab6 = document.getElementById('admin-menu1-tab6');
const adminMenu2 = document.getElementById('admin-menu2');
const adminMenu2Tab1 = document.getElementById('admin-menu2-tab1');
const adminMenu3 = document.getElementById('admin-menu3');
const adminMenu3Tab1 = document.getElementById('admin-menu3-tab1');
const adminMenu3Tab2 = document.getElementById('admin-menu3-tab2');
const adminMenu4 = document.getElementById('admin-menu4');
const adminMenu4Tab1 = document.getElementById('admin-menu4-tab1');

user.authenticate();

// window.addEventListener("popstate", function(event) {
//     const urlParams = new URLSearchParams(window.location.search);
//
//     if (urlParams.has('page')) {
//         if (urlParams.get('page') === 'documents') {
//             adminMenu1.click();
//         }
//         if (urlParams.get('page') === 'shreaded-documents') {
//             adminMenu2.click();
//         }
//     }
// });

Array.from(logout).forEach((element) => {
    element.addEventListener('click', function (event) {
        user.logOut()
    })
});

usersLink.addEventListener('click', function (event) {
    const userDetailsTable = document.getElementById('users-details');

    if (!userDetailsTable.classList.contains('hide')) {
        const userDetailsTableClose = document.getElementById('users-details-close');

        userDetailsTableClose.click();
    }
})

updateActiveRole('admin')

adminMenu1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1)
    resetSearchInput()

    fillTable(1, 1, '1,2,3,4,5,6,7,8')

    // history.pushState({ page: 1 }, "documents", "?page=documents");
})
adminMenu1Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab1)
    resetSearchInput()

    fillTable(1, 1, '1,2,3,4,5,6,7,8')
})
adminMenu1Tab2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab2)
    resetSearchInput()

    fillTable(1, 2, '2')
})
adminMenu1Tab3.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab3)
    resetSearchInput()

    fillTable(1, 3, '3')
})
adminMenu1Tab4.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab4)
    resetSearchInput()

    fillTable(1, 4, '4')
})
adminMenu1Tab5.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab5)
    resetSearchInput()

    fillTable(1, 5, '5,6')
})
adminMenu1Tab6.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab6)
    resetSearchInput()

    fillTable(1, 6, '7')
})

adminMenu2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu2)
    resetSearchInput()

    fillTable(2, 1)

    // history.pushState({ page: 2 }, "shreaded documents", "?page=shreaded-documents");
})
adminMenu2Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu2Tab1)
    resetSearchInput()

    fillTable(2, 1)
})

adminMenu3.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3)
    resetSearchInput()

    fillTable(3, 1, '7')
})
adminMenu3Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3Tab1)
    resetSearchInput()

    fillTable(3, 1, '7')
})
adminMenu3Tab2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3Tab2)
    resetSearchInput()

    fillTable(3, 2, '8')
})

adminMenu4.addEventListener('click', function (event) {
    updateActiveElement(adminMenu4)
    resetSearchInput()

    fillTable(4, 1)
})
adminMenu4Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu4Tab1)
    resetSearchInput()

    fillTable(4, 1)
})

adminMenu1.click()
populateSelectWithUsers()
populateSelectWithShippingTariffs()
getTabCount()

home.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const dashboardLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 2"]`);
    dashboardLink.click();
})
gearWrapper.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})
newDocumentMenuWrapper.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})

user.me().then((data) => {
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);

    setModals('initial-admin');
});