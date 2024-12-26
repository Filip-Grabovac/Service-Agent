// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

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

document.addEventListener('DOMContentLoaded', function () {
    const url = "https://gist.githubusercontent.com/kalinchernev/486393efcca01623b18d/raw/daa24c9fea66afb7d68f8d69f0c4b8eeb9406e83/countries";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching countries list");
            }
            // Ispisivanje odgovora kao tekst
            return response.text(); // Umesto response.json(), koristimo text()
        })
        .then(text => {
            console.log(text);  // Ispisivanje odgovora u konzoli
            // Ako je odgovor u validnom JSON formatu, parsiraj ga
            try {
                const data = JSON.parse(text);  // Parsiranje kao JSON
                const countries = Object.entries(data);

                // Pronalaženje "Chad" i umetanje "Channel Islands" posle njega
                const index = countries.findIndex(([code, name]) => name === "Chad");
                if (index !== -1) {
                    countries.splice(index + 1, 0, ["CI", "Channel Islands"]);
                }

                // Popunjavanje select elementa
                countries.forEach(([code, name]) => {
                    const option = document.createElement("option");
                    option.value = code;
                    option.textContent = name;
                    countrySelect.appendChild(option);
                });
            } catch (error) {
                console.error("JSON parsing error:", error);
            }
        })
        .catch(error => {
            console.error("An error occurred:", error);
        });
});

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