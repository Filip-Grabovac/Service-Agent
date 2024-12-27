// import User from '../User';
// import Document from '../Document';
// import {fillTable, updateActiveElement, updateActiveRole, populateSelectWithUsers, populateSelectWithShippingTariffs, setModals, resetSearchInput, getTabTitle} from '../Table.js';
import User from 'https://service-agent.pages.dev/src/User.js';
import Document from 'https://service-agent.pages.dev/src/Document.js';
import {fillTable, updateActiveElement, updateActiveRole, populateSelectWithUsers, populateSelectWithShippingTariffs, setModals, resetSearchInput, getTabTitle} from 'https://service-agent.pages.dev/src/Table.js';


const user = new User();
const documentFile = new Document();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const profileImages = document.getElementsByClassName('profile-image');
const gear = document.getElementById('gear');
const newDocumentMenu = document.getElementById('new-document-menu');

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

Array.from(logout).forEach((element) => {
    element.addEventListener('click', function (event) {
        user.logOut()
    })
});

updateActiveRole('admin')

adminMenu1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1)
    resetSearchInput()

    fillTable(1, 1, '1,2,3,4,5,6,7,8')
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

home.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})

adminMenu1.click()
populateSelectWithUsers()
populateSelectWithShippingTariffs()
getTabCount()

user.me().then((data) => {
    Array.from(profileImages).forEach((element) => {
        element.setAttribute('data-modal-open', 'edit-user-popup');
        element.setAttribute('data-fill-auth-id', '1');
        element.setAttribute('data-id-user-id', data.id);
    })
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);
    gear.setAttribute('disabled', "true");
    newDocumentMenu.setAttribute('disabled', "true");

    setModals('initial-admin');
});

function getTabCount() {
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