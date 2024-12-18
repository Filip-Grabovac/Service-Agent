// import User from '../User';
const User = require('../User.js');

const user = new User();

const nextBtn = document.getElementById('next-btn');
const firstNameInput = document.getElementById('First-name');
const lastNameInput = document.getElementById('Last-name');
const countrySelect = document.getElementById('Country');
const stateSelect = document.getElementById('State-2');
const cityInput = document.getElementById('City');
const zipInput = document.getElementById('Zip-Code');
const streetInput = document.getElementById('Street');
const emailInput = document.getElementById('E-mail');
const phoneInput = document.getElementById('Phone');

user.authenticate();

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const registerData = {
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        country: countrySelect.value,
        state: stateSelect.value,
        city: cityInput.value,
        zip: zipInput.value,
        street: streetInput.value,
        email: emailInput.value,
        phone_number: phoneInput.value,
    };

    if (validateData(registerData) === 1) {
        console.log('Error validating form');

        return;
    }

    localStorage.setItem('registerData', JSON.stringify(registerData));

    window.location.href = '/registration-2-4';
});

function validateData(registerData) {
    let hasErrors = 0;

    Object.entries(registerData).forEach(([key, value]) => {
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