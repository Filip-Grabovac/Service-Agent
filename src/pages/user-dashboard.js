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

home.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})

user.me().then((data) => {
    Array.from(profileImages).forEach((element) => {
        element.setAttribute('data-modal-open', 'edit-user-popup');
        element.setAttribute('data-fill-auth-id', '1');
        element.setAttribute('data-id-user-id', data.id);
    })
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);

    gear.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    });

    gear.setAttribute('disabled', '');

    setModals('initial-user');
});

