// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://service-agent.pages.dev/src/User.js';
import {
    fillTable,
    updateActiveElement,
    updateActiveRole,
    setModals
} from 'https://service-agent.pages.dev/src/Table.js';

const user = new User();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const profileImages = document.getElementsByClassName('profile-image');
const gear = document.getElementById('gear');

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');

user.authenticate();

Array.from(logout).forEach((element) => {
    element.addEventListener('click', function (event) {
        user.logOut()
    })
});

userMenu1.addEventListener('click', function (event) {
    updateActiveElement(userMenu1)
    updateActiveRole('user')

    fillTable(5, 1, 0)
})
userMenu2.addEventListener('click', function (event) {
    updateActiveElement(userMenu2)
    updateActiveRole('user')

    fillTable(6, 1, 1)
})

userMenu1.click()
user.me().then((data) => {
    Array.from(profileImages).forEach((element) => {
        element.setAttribute('data-modal-open', 'edit-user-popup');
        element.setAttribute('data-fill-auth-id', '1');
        element.setAttribute('data-id-user-id', data.id);
    })
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);
    setModals('initial-user');
});

document.addEventListener('DOMContentLoaded', function () {
    // Funkcija za deaktivaciju tabova
    function disableTabs() {
        // Selektuj tab linkove sa custom atributom
        var disabledTabs = document.querySelectorAll('[data-disabled-tab="true"]');

        // Dodaj event listener na svaki od njih
        disabledTabs.forEach(function (tab) {
            tab.addEventListener('click', function (event) {
                event.stopImmediatePropagation(); // Sprečava Webflow event
                event.preventDefault(); // Sprečava default ponašanje linka
                console.log('Klik na deaktiviran tab link.');
            });
        });
    }

    // Pozovi funkciju odmah
    disableTabs();

    // Posmatrač promene DOM-a za dinamički sadržaj
    var observer = new MutationObserver(function () {
        disableTabs(); // Ponovo inicijalizuj funkciju na promenu DOM-a
    });

    // Posmatraj promene na celom dokumentu
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});