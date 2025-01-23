// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://service-agent.pages.dev/src/User.js';
import Certificate from 'https://service-agent.pages.dev/src/Certificate.js';
import {
    fillTable,
    updateActiveElement,
    updateActiveRole,
    setModals
} from 'https://service-agent.pages.dev/src/Table.js';

const user = new User();
const certificate = new Certificate();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const gearWrapper = document.getElementById('gear-wrapper');
const gear = document.getElementById('gear');

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');
const userMenu3 = document.getElementById('user-menu3');

const successWrapper = document.getElementById('success-wrapper');
const successMessage = document.getElementById('success-message');
const successClose = document.getElementById('success-close');
successClose.addEventListener('click', (e) => {
    successWrapper.classList.add('hide');
})

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
userMenu3.addEventListener('click', function (event) {
    updateActiveElement(userMenu3)
    updateActiveRole('user')

    fillTable(7, 1, 'aircraft_registration_certificate')
    fillTable(7, 2, 'airman_certificate')
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

const urlParams = new URLSearchParams(window.location.search);

certificate.getAllActive().then((data) => {
    if (data && data.length === 0) {
        userMenu1.style.display = 'none';
        userMenu2.style.display = 'none';
    }

    if (urlParams.has('certificate-paid')) {
        const activeTabLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 4"]`);
        activeTabLink.click();
    }

    if (data && data.length === 0) {
        clickElement(`.w-tab-link[data-w-tab="Tab 4"]`)
            .then(() => clickElement('[data-modal-open="add-certificate-popup"]'))
            .then(() => {
                const closeElement = document.querySelector('[data-modal-action="close"]');
                if (closeElement) {
                    closeElement.disabled = true;
                } else {
                    console.error('Element za zatvaranje nije pronađen.');
                }
            })
            .catch((error) => console.error(error));
    } else {
        home.addEventListener('click', function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();

            const dashboardLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 2"]`);
            dashboardLink.click();
        })
    }

    function clickElement(selector) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                resolve();
            }
        });
    }
})

if (urlParams.has('certificate-paid')) {
    setTimeout(function () {
        successMessage.innerHTML = 'Certificate has been successfully paid.';
        successWrapper.classList.remove('hide');

        setTimeout(function () {
            successWrapper.classList.add('hide');
        }, 3000);
    }, 1000);
}

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


radioOption1.classList.add('hidden');
radioOption2.classList.add('hidden');
chooseMedicalWrapper.classList.add('hidden');
applicantIdWrapper.classList.add('hidden');
trackingNumberWrapper.classList.add('hidden');
existingCertificateWrapper.classList.add('hidden');
ffaCertificateNumberWrapper.classList.add('hidden');

aircraft.addEventListener('click', function (event) {
    radioOption1.classList.remove('hidden');
    if (!radioOption2.classList.contains('hidden')) {
        radioOption2.classList.add('hidden');
    }
})
airman.addEventListener('click', function (event) {
    radioOption2.classList.remove('hidden');
    if (!radioOption1.classList.contains('hidden')) {
        radioOption1.classList.add('hidden');
    }
})
newCertificate.addEventListener('click', function (event) {
    chooseMedicalWrapper.classList.remove('hidden');
    if (!existingCertificateWrapper.classList.contains('hidden')) {
        existingCertificateWrapper.classList.add('hidden');
    }
    if (!ffaCertificateNumberWrapper.classList.contains('hidden')) {
        ffaCertificateNumberWrapper.classList.add('hidden');
    }
    if (nonMedical.checked) {
        trackingNumberWrapper.classList.remove('hidden');
        ffaCertificateNumberWrapper.classList.remove('hidden');
    }
    if (isMedical.checked) {
        applicantIdWrapper.classList.remove('hidden');
        ffaCertificateNumberWrapper.classList.remove('hidden');
    }
})
existingCertificate.addEventListener('click', function (event) {
    existingCertificateWrapper.classList.remove('hidden');
    ffaCertificateNumberWrapper.classList.remove('hidden');
    if (!chooseMedicalWrapper.classList.contains('hidden')) {
        chooseMedicalWrapper.classList.add('hidden');
    }
    if (!trackingNumberWrapper.classList.contains('hidden')) {
        trackingNumberWrapper.classList.add('hidden');
    }
    if (!applicantIdWrapper.classList.contains('hidden')) {
        applicantIdWrapper.classList.add('hidden');
    }
})
nonMedical.addEventListener('click', function (event) {
    ffaCertificateNumberWrapper.classList.remove('hidden');
    trackingNumberWrapper.classList.remove('hidden');
    if (!applicantIdWrapper.classList.contains('hidden')) {
        applicantIdWrapper.classList.add('hidden');
    }
})
isMedical.addEventListener('click', function (event) {
    ffaCertificateNumberWrapper.classList.remove('hidden');
    applicantIdWrapper.classList.remove('hidden');
    if (!trackingNumberWrapper.classList.contains('hidden')) {
        trackingNumberWrapper.classList.add('hidden');
    }
})
