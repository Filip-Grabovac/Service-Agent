// import User from '../User';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@8722c25d082e952afa1d6ed16fad79151e984150/src/User.js';

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