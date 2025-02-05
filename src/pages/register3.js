// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const code = document.getElementById('Enter-Codee');
const resendCode = document.getElementById('resend-code');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

const loader = document.getElementById('loader');

const regCodeText = document.getElementById('reg-code-text');

let registerData = JSON.parse(localStorage.getItem('registerData'));

regCodeText.innerHTML = regCodeText.innerHTML.replace('{email}', registerData.email);

user.authenticate();

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})
resendCode.addEventListener('click', (e) => {
    user.resendCode();
})

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    loader.style.display = 'flex';

    if (validateData(code.value) === 1) {
        errorMessage.innerHTML = 'Confirmation code is not correct.';
        errorWrapper.classList.remove('hide');

        setTimeout(function() {
            errorWrapper.classList.add('hide');
        }, 3000);

        return;
    }

    let data = {
        email: registerData.email,
        confirmation_code: code.value
    };

    localStorage.removeItem('registerData');

    user.confirmCode(data);
});

function validateData(code) {
    let hasErrors = 0;

    if (code.length !== 6) {
        hasErrors = 1;
    }

    return hasErrors;
}