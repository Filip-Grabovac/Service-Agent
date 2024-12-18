// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
const User = require('../User.js');
const { fillTable, updateActiveElement, updateActiveRole } = require('../Table.js');


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