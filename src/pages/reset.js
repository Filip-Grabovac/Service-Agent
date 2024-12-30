// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const resetBtn = document.getElementById('reset');
const passwordInput = document.getElementById('New-Password');
const confirmInput = document.getElementById('Confirm-Password');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

user.authenticate();

resetBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const url = window.location.href;
    const params = new URLSearchParams(new URL(url).search);
    const token = params.get('token');

    const data = {
        password: passwordInput.value,
        confirmPassword: confirmInput.value,
        token: token,
    };

    if (validateData(data) === 1) {
        errorMessage.innerHTML = 'Please, fill in all fields. Passwords must match.';
        errorWrapper.classList.remove('hide');

        setTimeout(function() {
            errorWrapper.classList.add('hide');
        }, 3000);

        return;
    }

    user.reset(data);
});

function validateData(data) {
    let hasErrors = 0;

    Object.entries(data).forEach(([key, value]) => {
        if (value.length === 0) {
            hasErrors = 1;
        }
    });

    if (data.password !== data.confirmPassword) {
        hasErrors = 1;
    }

    return hasErrors;
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}