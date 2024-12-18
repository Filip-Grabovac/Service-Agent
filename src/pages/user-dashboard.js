// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/User.js';
import {fillTable, updateActiveElement, updateActiveRole} from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c86faab2378b02d2b4a90017f086fcf3ae95cb0f/src/Table.js';

const user = new User();

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');

user.authenticate();

userMenu1.addEventListener('click', function (event) {
    updateActiveElement(userMenu1)
    updateActiveRole('user')

    fillTable(5, 1, '1,2,3,4,5,7')
})
userMenu2.addEventListener('click', function (event) {
    updateActiveElement(userMenu2)
    updateActiveRole('user')

    fillTable(6, 1, '6,8')
})

userMenu1.click()