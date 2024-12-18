// import User from '../User';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@8722c25d082e952afa1d6ed16fad79151e984150/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const passwordInput = document.getElementById('Password');
const confirmPasswordInput = document.getElementById('Confirm-Password');

user.authenticate();

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let registerData = JSON.parse(localStorage.getItem('registerData'));

    let passwordData = {
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
    }

    if (validateData(passwordData) === 1) {
        console.log('Error validating form');

        return;
    }

    registerData.password = passwordData.password;

    user.register(registerData);
});

function validateData(passwordData) {
    let hasErrors = 0;

    Object.entries(passwordData).forEach(([key, value]) => {
        if (value.length === 0) {
            hasErrors = 1;
        }
    });

    if (passwordData.password !== passwordData.confirmPassword) {
        hasErrors = 1;
    }

    return hasErrors;
}