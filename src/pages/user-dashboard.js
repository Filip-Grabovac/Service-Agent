// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@217dddf285809ecb248c46ef87f83c5090fc54ba/src/User.js';
import {fillTable, updateActiveElement, updateActiveRole} from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@8f0e6cab12a1382e600a70950b41923b82498976/src/Table.js';

const user = new User();

const logout = document.getElementById('logout');

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');

user.authenticate();

logout.addEventListener('click', function (event) {
    user.logOut()
})

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