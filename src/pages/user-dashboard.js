// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://service-agent.pages.dev/src/User.js';
import {
    fillTable,
    updateActiveElement,
    updateActiveRole,
    setModals
} from 'https://service-agent.pages.dev/src/Table.js';

const user = new User();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const gearWrapper = document.getElementById('gear-wrapper');
const gear = document.getElementById('gear');

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');

user.authenticate();

Array.from(logout).forEach((element) => {
    element.addEventListener('click', function (event) {
        user.logOut()
    })
});

userMenu1.addEventListener('click', function (event) {
    updateActiveElement(userMenu1)
    updateActiveRole('user')

    fillTable(5, 1, 0)
})
userMenu2.addEventListener('click', function (event) {
    updateActiveElement(userMenu2)
    updateActiveRole('user')

    fillTable(6, 1, 1)
})

userMenu1.click()

home.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})
gearWrapper.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})

user.me().then((data) => {
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);

    setModals('initial-user');
});

const aircraft = document.querySelector('input[type="radio"][value="aircraft_registration_certificate"]');
const airman = document.querySelector('input[type="radio"][value="airman_certificate"]');
const newCertificate = document.querySelector('input[type="radio"][name="is_existing"][value="false"]');
const existingCertificate = document.querySelector('input[type="radio"][name="is_existing"][value="true"]');
const nonMedical = document.querySelector('input[type="radio"][name="is_medical"][value="false"]');
const isMedical = document.querySelector('input[type="radio"][name="is_medical"][value="true"]');

const radioOption1 = document.getElementById('radio-option-1');
const radioOption2 = document.getElementById('radio-option-2');
const chooseMedicalWrapper = document.getElementById('choose-medical-wrapper');
const applicantIdWrapper = document.getElementById('applicant_id_wrapper');
const trackingNumberWrapper = document.getElementById('tracking_number_wrapper');
const existingCertificateWrapper = document.getElementById('existing_certificate_wrapper');
const ffaCertificateNumberWrapper = document.getElementById('ffa_certificate_number_wrapper');

aircraft.addEventListener('click', function (event) {
    radioOption1.style.display = 'flex';
    radioOption2.style.display = 'none';
})
airman.addEventListener('click', function (event) {
    radioOption1.style.display = 'none';
    radioOption2.style.display = 'flex';
})
newCertificate.addEventListener('click', function (event) {
    chooseMedicalWrapper.style.display = 'flex';
    if (nonMedical.checked) {
        trackingNumberWrapper.style.display = 'flex';
    }
    if (isMedical.checked) {
        applicantIdWrapper.style.display = 'flex';
    }
})
existingCertificate.addEventListener('click', function (event) {
    existingCertificateWrapper.style.display = 'flex';
    ffaCertificateNumberWrapper.style.display = 'flex';
    chooseMedicalWrapper.style.display = 'none';
    trackingNumberWrapper.style.display = 'none';
    applicantIdWrapper.style.display = 'none';
})
nonMedical.addEventListener('click', function (event) {
    ffaCertificateNumberWrapper.style.display = 'flex';
    trackingNumberWrapper.style.display = 'flex';
    applicantIdWrapper.style.display = 'none';
})
isMedical.addEventListener('click', function (event) {
    ffaCertificateNumberWrapper.style.display = 'flex';
    applicantIdWrapper.style.display = 'flex';
    trackingNumberWrapper.style.display = 'none';
})