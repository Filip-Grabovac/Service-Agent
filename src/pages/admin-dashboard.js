import User from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/User.js';
import {fillTable, updateActiveElement, updateActiveRole, populateSelectWithUsers, populateSelectWithShippingTariffs} from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/Table.js';

const user = new User();

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

updateActiveRole('admin')

adminMenu1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1)

    fillTable(1, 1, '1,2,3,4,5,6,7,8')
})
adminMenu1Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab1)

    fillTable(1, 1, '1,2,3,4,5,6,7,8')
})
adminMenu1Tab2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab2)

    fillTable(1, 2, '2')
})
adminMenu1Tab3.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab3)

    fillTable(1, 3, '3')
})
adminMenu1Tab4.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab4)

    fillTable(1, 4, '4')
})
adminMenu1Tab5.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab5)

    fillTable(1, 5, '5,6')
})
adminMenu1Tab6.addEventListener('click', function (event) {
    updateActiveElement(adminMenu1Tab6)

    fillTable(1, 6, '7,8')
})

adminMenu2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu2)

    fillTable(2, 1)
})
adminMenu2Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu2Tab1)

    fillTable(2, 1)
})

adminMenu3.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3)

    fillTable(3, 1, '7')
})
adminMenu3Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3Tab1)

    fillTable(3, 1, '7')
})
adminMenu3Tab2.addEventListener('click', function (event) {
    updateActiveElement(adminMenu3Tab2)

    fillTable(3, 2, '8')
})

adminMenu4.addEventListener('click', function (event) {
    updateActiveElement(adminMenu4)

    fillTable(4, 1)
})
adminMenu4Tab1.addEventListener('click', function (event) {
    updateActiveElement(adminMenu4Tab1)

    fillTable(4, 1)
})

adminMenu1.click()
populateSelectWithUsers()
populateSelectWithShippingTariffs()