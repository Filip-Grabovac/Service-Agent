// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const passwordInput = document.getElementById('Password');
const confirmPasswordInput = document.getElementById('Confirm-Password');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

const loader = document.getElementById('loader');

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

user.authenticate();

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    loader.style.display = 'flex';

    let registerData = JSON.parse(localStorage.getItem('registerData'));

    let passwordData = {
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
    }

    if (validateData(passwordData) === 1) {
        loader.style.display = 'none';

        errorMessage.innerHTML = 'Please, fill in all fields. Passwords must match.';
        errorWrapper.classList.remove('hide');

        setTimeout(function() {
            errorWrapper.classList.add('hide');
        }, 3000);

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

const inputs = document.querySelectorAll('.input-rows-copy');

inputs.forEach(input => {
    input.querySelector('.eye-icon-show').addEventListener('click', function () {
        const passwordField = input.querySelector('.input-field');

        passwordField.type = 'password';

        input.querySelector('.eye-icon-show').classList.add('hidden');
        input.querySelector('.eye-icon-hide').classList.remove('hidden');
    });

    input.querySelector('.eye-icon-hide').addEventListener('click', function () {
        const passwordField = input.querySelector('.input-field');

        passwordField.type = 'text';

        input.querySelector('.eye-icon-show').classList.remove('hidden');
        input.querySelector('.eye-icon-hide').classList.add('hidden');
    });
})
