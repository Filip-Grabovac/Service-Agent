// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const secondStepInputs = document.getElementById('second-step-inputs');
const companyRadio = document.getElementById('company');
const individualRadio = document.getElementById('individual');
const companyNameWrapper = document.getElementById('Company-Name-Wrapper');
const companyNameInput = document.getElementById('Company-Name');
const dateOfBirthInput = document.getElementById('Date-of-Birth');
const firstNameInput = document.getElementById('First-name');
const lastNameInput = document.getElementById('Last-name');
const countrySelect = document.getElementById('Country');
const stateSelect = document.getElementById('State-2');
const cityInput = document.getElementById('City');
const zipInput = document.getElementById('Zip-Code');
const streetInput = document.getElementById('Street');
const numberInput = document.getElementById('Number');
const emailInput = document.getElementById('E-mail');
const phoneInput = document.getElementById('Phone');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

let isCompany;

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

user.authenticate();

companyRadio.addEventListener('click', function (event) {
    companyNameWrapper.style.display = 'flex';
    dateOfBirthInput.style.display = 'none';

    isCompany = true;
})

individualRadio.addEventListener('click', function (event) {
    companyNameWrapper.style.display = 'none';
    dateOfBirthInput.style.display = 'flex';

    isCompany = false;
})

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    if (secondStepInputs.classList.contains('hidden')) {
        secondStepInputs.classList.remove('hidden');
    } else {
        const registerData = {
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
            country: countrySelect.value,
            state: stateSelect.value,
            city: cityInput.value,
            zip: zipInput.value,
            street: streetInput.value,
            number: numberInput.value,
            email: emailInput.value,
            phone_number: phoneInput.value,
            is_company: isCompany,
        };

        if (isCompany) {
            registerData.company_name = companyNameInput.value;
        } else {
            registerData.date_of_birth = dateOfBirthInput.value;
        }

        if (validateData(registerData) === 1) {
            errorMessage.innerHTML = 'Please, fill in all fields.';
            errorWrapper.classList.remove('hide');

            setTimeout(function() {
                errorWrapper.classList.add('hide');
            }, 3000);

            return;
        }

        localStorage.setItem('registerData', JSON.stringify(registerData));

        window.location.href = '/registration-2-4';
    }
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

document.addEventListener('DOMContentLoaded', function () {
    const countriesText = `
      Afghanistan
      Albania
      Algeria
      Andorra
      Angola
      Antigua & Deps
      Argentina
      Armenia
      Australia
      Austria
      Azerbaijan
      Bahamas
      Bahrain
      Bangladesh
      Barbados
      Belarus
      Belgium
      Belize
      Benin
      Bhutan
      Bolivia
      Bosnia Herzegovina
      Botswana
      Brazil
      Brunei
      Bulgaria
      Burkina
      Burundi
      Cambodia
      Cameroon
      Canada
      Cape Verde
      Central African Rep
      Chad
      Channel Islands
      Chile
      China
      Colombia
      Comoros
      Congo
      Congo {Democratic Rep}
      Costa Rica
      Croatia
      Cuba
      Cyprus
      Czech Republic
      Denmark
      Djibouti
      Dominica
      Dominican Republic
      East Timor
      Ecuador
      Egypt
      El Salvador
      Equatorial Guinea
      Eritrea
      Estonia
      Ethiopia
      Fiji
      Finland
      France
      Gabon
      Gambia
      Georgia
      Germany
      Ghana
      Greece
      Grenada
      Guatemala
      Guinea
      Guinea-Bissau
      Guyana
      Haiti
      Honduras
      Hungary
      Iceland
      India
      Indonesia
      Iran
      Iraq
      Ireland {Republic}
      Israel
      Italy
      Ivory Coast
      Jamaica
      Japan
      Jordan
      Kazakhstan
      Kenya
      Kiribati
      Korea North
      Korea South
      Kosovo
      Kuwait
      Kyrgyzstan
      Laos
      Latvia
      Lebanon
      Lesotho
      Liberia
      Libya
      Liechtenstein
      Lithuania
      Luxembourg
      Macedonia
      Madagascar
      Malawi
      Malaysia
      Maldives
      Mali
      Malta
      Marshall Islands
      Mauritania
      Mauritius
      Mexico
      Micronesia
      Moldova
      Monaco
      Mongolia
      Montenegro
      Morocco
      Mozambique
      Myanmar, {Burma}
      Namibia
      Nauru
      Nepal
      Netherlands
      New Zealand
      Nicaragua
      Niger
      Nigeria
      Norway
      Oman
      Pakistan
      Palau
      Panama
      Papua New Guinea
      Paraguay
      Peru
      Philippines
      Poland
      Portugal
      Qatar
      Romania
      Russian Federation
      Rwanda
      St Kitts & Nevis
      St Lucia
      Saint Vincent & the Grenadines
      Samoa
      San Marino
      Sao Tome & Principe
      Saudi Arabia
      Senegal
      Serbia
      Seychelles
      Sierra Leone
      Singapore
      Slovakia
      Slovenia
      Solomon Islands
      Somalia
      South Africa
      South Sudan
      Spain
      Sri Lanka
      Sudan
      Suriname
      Swaziland
      Sweden
      Switzerland
      Syria
      Taiwan
      Tajikistan
      Tanzania
      Thailand
      Togo
      Tonga
      Trinidad & Tobago
      Tunisia
      Turkey
      Turkmenistan
      Tuvalu
      Uganda
      Ukraine
      United Arab Emirates
      United Kingdom
      United States
      Uruguay
      Uzbekistan
      Vanuatu
      Vatican City
      Venezuela
      Vietnam
      Yemen
      Zambia
      Zimbabwe
    `;

    const countries = countriesText.trim().split("\n");

    countries.forEach(country => {
        const option = document.createElement("option");
        option.textContent = country;
        option.value = country;
        countrySelect.appendChild(option);
    });
});