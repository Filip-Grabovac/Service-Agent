import User from '../User.js';
import Certificate from '../Certificate.js';
import {
    fillTable,
    updateActiveElement,
    updateActiveRole,
    setModals
} from '../Table.js';

const user = new User();
const certificate = new Certificate();

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const gearWrapper = document.getElementById('gear-wrapper');
const gear = document.getElementById('gear');
const deleteAccount = document.getElementById('delete-account');
const tour1Next = document.getElementById('tour-1-next');
const tour2Next = document.getElementById('tour-2-next');
const tour3Next = document.getElementById('tour-3-next');
const tour4Finish = document.getElementById('tour-4-finish');
const tour1 = document.getElementById('tour-1');
const tour2 = document.getElementById('tour-2');
const tour3 = document.getElementById('tour-3');
const tour4 = document.getElementById('tour-4');
const tourSkips = Array.from(document.getElementsByClassName('tour_skip'));

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');
const userMenu3 = document.getElementById('user-menu3');

const successWrapper = document.getElementById('success-wrapper');
const successMessage = document.getElementById('success-message');
const successClose = document.getElementById('success-close');

const loader = document.getElementById('loader-new');
loader.style.display = 'flex';
console.log(loader);

let showTutorial = false;

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

gearWrapper.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
})

tour1Next.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    tour1.style.display = 'none';
    tour2.style.display = 'flex';

    localStorage.setItem('tourStage', '2');
})

tour2Next.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    tour2.style.display = 'none';
    tour3.style.display = 'flex';

    localStorage.setItem('tourStage', '3');
})

tour3Next.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    tour3.style.display = 'none';
    tour4.style.display = 'flex';

    localStorage.setItem('tourStage', '4');
})

tour4Finish.addEventListener('click', function (event) {
    tour4.style.display = 'none';

    localStorage.removeItem('tourStage');
})

const tourStage =  localStorage.getItem('tourStage');

if (tourStage && tourStage === '1') {
    tour1.style.display = 'flex';
} else if (tourStage && tourStage === '2') {
    tour2.style.display = 'flex';
} else if (tourStage && tourStage === '3') {
    tour3.style.display = 'flex';
} else if (tourStage && tourStage === '4') {
    tour4.style.display = 'flex';
}

tourSkips.forEach((el, index) => {
    el.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();

        el.closest('.tour').style.display = 'none';

        localStorage.removeItem('tourStage');
    });
});

let prepopulatedUserId = null;
user.me().then((data) => {
    prepopulatedUserId = data.prepopulated_users_id;
    gear.setAttribute('data-modal-open', 'edit-user-popup');
    gear.setAttribute('data-fill-auth-id', '1');
    gear.setAttribute('data-id-user-id', data.id);
    deleteAccount.setAttribute('data-id-user-id', data.id);
    deleteAccount.addEventListener('click', () => {
        document.querySelector('#edit-user-popup').querySelector('[data-modal-action="close"]').click();
    });

    setModals('initial-user');

    if (urlParams.has('certificate') && data.tutorial_shown === false) {
        showTutorial = true;
        const patchData = {
            tutorial_shown: true
        }
        user.patchUser(data.id, patchData);
    }

    if (data.welcome_message_hidden === false) {
        document.querySelector('#welcome-message').style.display = 'flex';
        document.querySelector('#welcome-message-hide').addEventListener('click', () => {
            document.querySelector('#welcome-message').style.display = 'none';
            const patchData = {
                welcome_message_hidden: true
            }
            user.patchUser(data.id, patchData);
        })
    }
});

const urlParams = new URLSearchParams(window.location.search);

certificate.getAllInactive().then((data) => {
    if (data && data.length > 0) {
        const noCertificateBox = document.querySelector('.no-certificate-text-wrap');

        noCertificateBox.style.display = 'block';
    }
});

certificate.getAllActive().then((data) => {
    if (data && data.length === 0) {
        userMenu1.style.display = 'none';
        userMenu2.style.display = 'none';
    }

    if (urlParams.has('certificate')) {
        const activeTabLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 4"]`);
        activeTabLink.click();
    }

    if (data && data.length === 0) {
        const activeTabLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 4"]`);
        activeTabLink.click();

        certificate.getAll().then((data) => {
            if (data.items && data.items.length === 0) {
                const addCertificateButton = document.querySelector(`[data-modal-open="add-certificate-popup"]`);
                addCertificateButton.click();

                const closeElement = document.querySelector('[data-modal-action="close"]');
                closeElement.style.display = 'none';

                if (prepopulatedUserId) {
                    user.getPrepopulatedUser(prepopulatedUserId).then((prepopulatedUser) => {
                        if (prepopulatedUser && !prepopulatedUser.certificate_created && prepopulatedUser.have_aircraft === 'Yes') {
                            aircraft.click();
                            aircraftDetails.value = prepopulatedUser.aircraft_details;
                            aircraftMake.value = prepopulatedUser.aircraft_make;
                            aircraftModel.value = prepopulatedUser.aircraft_model;
                            aircraftSerialNumber.value = prepopulatedUser.aircraft_serial_number;
                        } else if (prepopulatedUser && !prepopulatedUser.certificate_created && prepopulatedUser.have_airman === 'Yes') {
                            airman.click();
                            airmanCertificateNumber.value = prepopulatedUser.ffa_certificate_number;
                            if (prepopulatedUser.existing_certificate !== '') {
                                existingCertificate.click();
                                airmanExistingCertificate.value = prepopulatedUser.existing_certificate;
                            }
                        }
                    })
                }
            }
        });

        home.addEventListener('click', function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();
        })
    } else {
        home.addEventListener('click', function (event) {
            event.stopImmediatePropagation();
            event.preventDefault();

            const dashboardLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 2"]`);
            dashboardLink.click();
        })
    }
})

if (urlParams.has('certificate')) {
    setTimeout(function () {
        const removeQueryParam = (param) => {
            const url = new URL(window.location);
            url.searchParams.delete(param);
            window.history.replaceState({}, document.title, url.pathname + url.search);
        };

        removeQueryParam('certificate');

        successMessage.innerHTML = 'Certificate has been successfully paid.';
        successWrapper.classList.remove('hide');

        if (showTutorial) {
            const tour1 = document.getElementById('tour-1');
            tour1.style.display = 'flex';
            localStorage.setItem('tourStage', '1');
        }

        setTimeout(function () {
            successWrapper.classList.add('hide');
        }, 3000);

    }, 1000);
}

if (urlParams.has('certificate-deleted')) {
    setTimeout(function () {
        const removeQueryParam = (param) => {
            const url = new URL(window.location);
            url.searchParams.delete(param);
            window.history.replaceState({}, document.title, url.pathname + url.search);
        };

        removeQueryParam('certificate-deleted');

        const activeTabLink = document.querySelector(`.w-tab-link[data-w-tab="Tab 4"]`);
        activeTabLink.click();

        successMessage.innerHTML = "The certificate has been successfully deleted.";
        successWrapper.classList.remove('hide');

        setTimeout(function() {
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

const aircraftDetails = document.querySelector('input[name="aircraft_details"]');
const aircraftMake = document.querySelector('input[name="aircraft_make"]');
const aircraftModel = document.querySelector('input[name="aircraft_model"]');
const aircraftSerialNumber = document.querySelector('input[name="aircraft_serial_number"]');
const airmanCertificateNumber = document.querySelector('input[name="ffa_certificate_number"]');
const airmanExistingCertificate = document.querySelector('select[name="existing_certificate"]');

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
    if (!applicantIdWrapper.classList.contains('hidden')) {
        applicantIdWrapper.classList.add('hidden');
    }
    if (nonMedical.checked) {
        trackingNumberWrapper.classList.remove('hidden');
        if (!applicantIdWrapper.classList.contains('hidden')) {
            applicantIdWrapper.classList.add('hidden');
        }
    }
    if (isMedical.checked) {
        applicantIdWrapper.classList.remove('hidden');
        if (!trackingNumberWrapper.classList.contains('hidden')) {
            trackingNumberWrapper.classList.add('hidden');
        }
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
    if (airmanExistingCertificate.value === 'part_67') {
        if (!ffaCertificateNumberWrapper.classList.contains('hidden')) {
            ffaCertificateNumberWrapper.classList.add('hidden');
        }
        applicantIdWrapper.classList.remove('hidden');
    } else {
        if (!applicantIdWrapper.classList.contains('hidden')) {
            applicantIdWrapper.classList.add('hidden');
        }
        ffaCertificateNumberWrapper.classList.remove('hidden');
    }
})
nonMedical.addEventListener('click', function (event) {
    trackingNumberWrapper.classList.remove('hidden');
    if (!applicantIdWrapper.classList.contains('hidden')) {
        applicantIdWrapper.classList.add('hidden');
    }
})
isMedical.addEventListener('click', function (event) {
    applicantIdWrapper.classList.remove('hidden');
    if (!trackingNumberWrapper.classList.contains('hidden')) {
        trackingNumberWrapper.classList.add('hidden');
    }
})
airmanExistingCertificate.addEventListener('change', function (event) {
    const selectedValue = this.value;

    if (selectedValue === 'part_67') {
        if (!ffaCertificateNumberWrapper.classList.contains('hidden')) {
            ffaCertificateNumberWrapper.classList.add('hidden');
        }
        applicantIdWrapper.classList.remove('hidden');
    } else {
        if (!applicantIdWrapper.classList.contains('hidden')) {
            applicantIdWrapper.classList.add('hidden');
        }
        ffaCertificateNumberWrapper.classList.remove('hidden');
    }
})

setTimeout(() => {
    loader.style.display = 'none';
}, 2000);