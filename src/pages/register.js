import User from "../User.js";

const user = new User();
//test
const nextBtn = document.getElementById("next-btn");
const secondStepInputs = document.getElementById("second-step-inputs");
const companyRadio = document.getElementById("company");
const individualRadio = document.getElementById("individual");
const companyNameWrapper = document.getElementById("Company-Name-Wrapper");
const companyNameInput = document.getElementById("Company-Name");
const dateOfBirthInput = document.getElementById("Date-of-Birth");
const dateOfBirthWrapper = document.getElementById("date-wrapper");
const firstNameInput = document.getElementById("First-name");
const lastNameInput = document.getElementById("Last-name");
const countrySelect = document.getElementById("Country");
const stateSelect = document.getElementById("State-2");
const cityInput = document.getElementById("City");
const zipInput = document.getElementById("Zip-Code");
const streetInput = document.getElementById("Street");
const numberInput = document.getElementById("Number");
const emailInput = document.getElementById("E-mail");
const phoneInput = document.getElementById("Phone");
const referralSource = document.getElementById("referral_source");
const middleName = document.getElementById("middle_name");
const addressAdditional = document.getElementById("address_additional");
const terms = document.getElementById("terms");
const sms = document.getElementById("sms");

const nameRow1 = document.getElementById("name-row-1");
const nameRow2 = document.getElementById("name-row-2");
const emailRow = document.getElementById("email-row");
const hrRow = document.getElementById("hr-row");

const errorWrapper = document.getElementById("error-wrapper");
const errorMessage = document.getElementById("error-message");
const errorClose = document.getElementById("error-close");

let isCompany;

errorClose.addEventListener("click", (e) => {
  errorWrapper.classList.add("hide");
});

user.authenticate();

const urlParams = new URLSearchParams(window.location.search);

let prepopulated_id = null;
if (urlParams.has("hash")) {
  user.getPrepopulatedUser(urlParams.get("hash")).then((prepopulatedUser) => {
    const removeQueryParam = (param) => {
      const url = new URL(window.location);
      url.searchParams.delete(param);
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
    };

    // removeQueryParam('hash');

    if (!prepopulatedUser || prepopulatedUser.signed_up) {
      return;
    }

    prepopulated_id = prepopulatedUser.id;

    individualRadio.click();

    firstNameInput.value = prepopulatedUser.first_name;
    lastNameInput.value = prepopulatedUser.last_name;
    middleName.value = prepopulatedUser.middle_name;
    streetInput.value = prepopulatedUser.street;
    addressAdditional.value = prepopulatedUser.address_additional;
    cityInput.value = prepopulatedUser.city;
    stateSelect.value = prepopulatedUser.state;
    zipInput.value = prepopulatedUser.zip;
    countrySelect.value = prepopulatedUser.country;
    emailInput.value = prepopulatedUser.email;
  });
}

const iti = window.intlTelInput(phoneInput, {
  initialCountry: "us",
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  formatOnDisplay: false,
  separateDialCode: true,
  autoPlaceholder: "off",
});

const today = new Date().toISOString().split("T")[0];
dateOfBirthInput.setAttribute("max", today);

hrRow.style.display = "none";
companyRadio.addEventListener("click", function (event) {
  secondStepInputs.insertBefore(nameRow1, emailRow);
  secondStepInputs.insertBefore(nameRow2, emailRow);
  hrRow.style.display = "flex";

  companyNameWrapper.style.display = "flex";
  dateOfBirthWrapper.style.display = "none";

  isCompany = true;

  if (secondStepInputs.classList.contains("hidden")) {
    secondStepInputs.classList.remove("hidden");
  }
});

individualRadio.addEventListener("click", function (event) {
  secondStepInputs.insertBefore(nameRow1, dateOfBirthWrapper);
  secondStepInputs.insertBefore(nameRow2, dateOfBirthWrapper);
  hrRow.style.display = "none";

  companyNameWrapper.style.display = "none";
  dateOfBirthWrapper.style.display = "flex";

  isCompany = false;

  if (secondStepInputs.classList.contains("hidden")) {
    secondStepInputs.classList.remove("hidden");
  }
});

function capitalizeWords(str) {
  if (str === str.toUpperCase()) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return str;
}

nextBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form from submitting

  const termsLabel = document.getElementById("terms-label");
  const termsLabelLinks = termsLabel.querySelectorAll("a");
  termsLabel.style.color = "#475467";
  termsLabelLinks.forEach(link => {
    link.style.color = "#475467";
  });
  if (!terms.checked) {
    termsLabel.style.color = "#ce0003";
    termsLabelLinks.forEach(link => {
      link.style.color = "#ce0003";
    });
    // errorMessage.innerHTML = 'You must agree to the Terms & Conditions.';
    // errorWrapper.classList.remove('hide');
    //
    // setTimeout(function() {
    //     errorWrapper.classList.add('hide');
    // }, 3000);

    return;
  }

  const smsLabel = document.getElementById("sms-label");
  smsLabel.style.color = "#475467";
  if (!sms.checked) {
    smsLabel.style.color = "#ce0003";

    return;
  }

  const dataForValidation = {
    first_name: firstNameInput,
    last_name: lastNameInput,
    country: countrySelect,
    state: stateSelect,
    city: cityInput,
    zip: zipInput,
    street: streetInput,
    number: numberInput,
    email: emailInput,
    phone_number: phoneInput,
  };

  const registerData = {
    first_name: capitalizeWords(firstNameInput.value),
    last_name: capitalizeWords(lastNameInput.value),
    country: countrySelect.value,
    state: stateSelect.value,
    city: cityInput.value,
    zip: zipInput.value,
    street: streetInput.value,
    number: numberInput.value,
    email: emailInput.value,
    phone_number: phoneInput.value,
    is_company: isCompany,
    phone_country: iti.getSelectedCountryData().iso2,
    referral_source: referralSource.value,
    middle_name: capitalizeWords(middleName.value),
    address_additional: addressAdditional.value,
    prepopulated_id: prepopulated_id,
  };

  if (isCompany) {
    dataForValidation.company_name = companyNameInput;
    registerData.company_name = companyNameInput.value;
  } else {
    dataForValidation.date_of_birth = dateOfBirthInput;
    registerData.date_of_birth = dateOfBirthInput.value;
  }

  if (validateData(dataForValidation) === 1) {
    // errorMessage.innerHTML = 'Please, fill in all fields.';
    // errorWrapper.classList.remove('hide');
    //
    // setTimeout(function() {
    //     errorWrapper.classList.add('hide');
    // }, 3000);

    return;
  }

  localStorage.setItem("registerData", JSON.stringify(registerData));

  window.location.href = "/registration-2-4";
});

function validateData(dataForValidation) {
  let hasErrors = 0;

  Object.entries(dataForValidation).forEach(([key, element]) => {
    let errorElement = element.parentElement.querySelector(
      ".register-input-error"
    );

    if (!errorElement) {
      errorElement = element.parentElement.parentElement.querySelector(
        ".register-input-error"
      );
    }

    element.style.borderColor = "#d3d6da";
    errorElement.style.display = "none";
    if (element.value.length === 0) {
      errorElement.style.display = "block";
      element.style.borderColor = "#ce0003";
      hasErrors = 1;
    }

    if (key === "email" && !isValidEmail(element.value)) {
      errorElement.style.display = "block";
      element.style.borderColor = "#ce0003";
      hasErrors = 1;
    }
  });

  return hasErrors;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

let countriesFunctionsRun = false;
document.addEventListener("DOMContentLoaded", function () {
  if (countriesFunctionsRun === false) {
    populateCountries();
    countriesFunctionsRun = true;
  }
});

if (
  (document.readyState === "complete" ||
    document.readyState === "interactive") &&
  countriesFunctionsRun === false
) {
  populateCountries();
  countriesFunctionsRun = true;
}

function populateCountries() {
  const countries = [
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antigua & Deps", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bonaire, Sint Eustatius and Saba", code: "BQ" },
    { name: "Bosnia Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Brazil", code: "BR" },
    { name: "Brunei", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cayman Islands", code: "KY" },
    { name: "Cape Verde", code: "CV" },
    { name: "Central African Rep", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Channel Islands", code: "JE" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo {Democratic Rep}", code: "CD" },
    { name: "Costa Rica", code: "CR" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Curaçao", code: "CW" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "East Timor", code: "TL" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Ethiopia", code: "ET" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Greece", code: "GR" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland {Republic}", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Ivory Coast", code: "CI" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea North", code: "KP" },
    { name: "Korea South", code: "KR" },
    { name: "Kosovo", code: "XK" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Laos", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macau", code: "MO" },
    { name: "Macedonia", code: "MK" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia", code: "FM" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar, {Burma}", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "North Macedonia", code: "MK" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Qatar", code: "QA" },
    { name: "Romania", code: "RO" },
    { name: "Russia", code: "RU" },
    { name: "Rwanda", code: "RW" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Sint Maarten", code: "SX" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Korea", code: "KR" },
    { name: "South Sudan", code: "SS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syria", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Togo", code: "TG" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Vatican City", code: "VA" },
    { name: "Venezuela", code: "VE" },
    { name: "Vietnam", code: "VN" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ];

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.textContent = country.name;
    option.value = country.name;
    option.setAttribute("data-code", country.code);
    countrySelect.appendChild(option);
  });

  countrySelect.addEventListener("change", function () {
    if (
      phoneInput.value === "" ||
      phoneInput.value === "+" + iti.getSelectedCountryData().dialCode
    ) {
      const selectedOption = this.options[this.selectedIndex];
      iti.setCountry(selectedOption.dataset.code);
    }
  });
}
