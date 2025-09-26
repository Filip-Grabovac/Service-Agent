import User from '../User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const code = document.getElementById('Enter-Codee');
const resendCode = document.getElementById('resend-code');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

const loader = document.getElementById('loader');

const regCodeText = document.getElementById('reg-code-text');

let referral = null;
if (localStorage.getItem('referral')) {
    referral = localStorage.getItem('referral');
}

user.authenticate();

let userEmail = '';
user.me().then((data) => {
    userEmail = data.email;

    regCodeText.innerHTML = regCodeText.innerHTML.replace('{email}', data.email);
})

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
        loader.style.display = 'none';

        errorMessage.innerHTML = 'Invalid confirmation code!';
        errorWrapper.classList.remove('hide');

        setTimeout(function() {
            errorWrapper.classList.add('hide');
        }, 3000);

        return;
    }

    let data = {
        email: userEmail,
        confirmation_code: code.value
    };

    localStorage.removeItem('registerData');

    user.confirmCode(data).then((result) => {
        if (!result.is_verified) {
            return;
        }

        let price;
        if (currentDomain.includes('webflow.io')) {
            price = "price_1QfGqbCA20rcDWGhGrIUBQVr";
            referral = null;
        } else {
            price = "price_1Qrbi9CA20rcDWGhZg72KAVO";
        }

        let paymentData = {
            success_url: "https://" + window.location.hostname + "/user-dashboard?subscription=successful",
            cancel_url: "https://" + window.location.hostname + "/registration-4-4",
            email: userEmail,
            line_items: [
                {
                    price: price,
                    quantity: "1",
                }
            ],
            referral: referral
        };

        user.initialPayment(paymentData).then(result => {
            window.location.href = result.url
        });
    });
});

function validateData(code) {
    let hasErrors = 0;

    if (code.length !== 6) {
        hasErrors = 1;
    }

    return hasErrors;
}