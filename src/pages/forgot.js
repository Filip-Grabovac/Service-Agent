// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const resetBtn = document.getElementById('reset');
const emailInput = document.getElementById('email');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

user.authenticate();

resetBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const data = {
        email: emailInput.value,
    };

    if (validateData(data) === 1) {
        errorMessage.innerHTML = 'Please, fill in all fields.';
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