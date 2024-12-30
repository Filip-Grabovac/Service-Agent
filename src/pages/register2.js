// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const passwordInput = document.getElementById('Password');
const confirmPasswordInput = document.getElementById('Confirm-Password');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

user.authenticate();

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let registerData = JSON.parse(localStorage.getItem('registerData'));

    let passwordData = {
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
    }

    if (validateData(passwordData) === 1) {
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