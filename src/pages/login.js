// import User from '../User';
// import User from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/User.js';

import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/User.js';
const user = new User();

const loginBtn = document.getElementById('login');
const emailInput = document.getElementById('E-mail');
const passwordInput = document.getElementById('Password');

user.authenticate();

loginBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const loginData = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    if (validateData(loginData) === 1) {
        console.log('Error validating form');

        return;
    }

    user.login(loginData);
});

function validateData(loginData) {
    let hasErrors = 0;

    Object.entries(loginData).forEach(([key, value]) => {
        if (value.length === 0) {
            hasErrors = 1;
        }

        if (key === 'email' && !isValidEmail(value)) {
            hasErrors = 1;
        }
    });

    return hasErrors;
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}