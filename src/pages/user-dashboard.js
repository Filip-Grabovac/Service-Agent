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

let open = '';
open = localStorage.getItem('open');

const home = document.getElementById('home');

const logout = document.getElementsByClassName('logout');
const gearWrapper = document.getElementById('gear-wrapper');
const gear = document.getElementById('gear');
const deleteAccount = document.getElementById('delete-account');
const billingOpen = document.getElementById('billing-open');
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

const referralSendInvite = document.getElementById('referral-send-invite');
const referralEmail = document.getElementById('referral-email');

const loader = document.getElementById('loader-user');
loader.style.display = 'flex';
setTimeout(() => {
    loader.style.display = 'none';
}, 5000);

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

referralSendInvite.addEventListener('click', () => {
    const data = {
        email: referralEmail.value
    }
    referralEmail.value = '';
    user.sendReferralInvite(data);
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

    if (open === 'referral' && data.rewardful_token !== null) {
        localStorage.removeItem('open');

        const referralTab = document.querySelector('.popup-tabs-menu-item[data-w-tab="Tab 2"]');
        referralTab.click()

        setTimeout(() => {
            gear.click();
        }, 1000)
    }

    if (data.rewardful_token === null) {
        const referralTab = document.querySelector('.popup-tabs-menu-item[data-w-tab="Tab 2"]');
        referralTab.style.display = 'none';
    }

    const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const hasOneMonthPassed = now - data.created_at >= oneMonthMs;

    if (!data.referral_box_hidden && hasOneMonthPassed && data.rewardful_token !== null) {
        document.querySelector(('.referral-text-wrap')).style.display = 'flex';

        document.querySelector(('.referral-close-icon')).addEventListener('click', (e) => {
            document.querySelector(('.referral-text-wrap')).style.display = 'none';

            const patchData = {
                referral_box_hidden: true
            }
            user.patchUser(data.id, patchData);
        });
    }

    if (data.rewardful_token) {
        document.querySelectorAll('.referral-token').forEach(token => {
            token.textContent = data.rewardful_token;
        });
    }

    if (data.is_active) {
        if (data.company_id === null) {
            billingOpen.setAttribute('data-id-user-id', data.id);
            setBillingLink()
        } else {
            billingOpen.style.display = 'none';
        }

        if (data.subscription_end) {
            const expiringSubscriptionBoxes = document.querySelectorAll('.expiring-subscription-text-wrap')

            expiringSubscriptionBoxes.forEach(box => {
                box.style.display = "flex";

                const date = box.querySelector('.subscription_end_date');

                const subscriptionEnd = new Date(data.subscription_end);

                date.textContent = subscriptionEnd.toISOString().split('T')[0];
            });
        }
    } else {
        billingOpen.style.display = 'none';
        const addCertificateButtons = document.querySelectorAll('[data-modal-open=add-certificate-popup]')
        const expiredSubscriptionBoxes = document.querySelectorAll('.expired-subscription-text-wrap')

        addCertificateButtons.forEach(button => {
            button.style.pointerEvents = "none";
            button.style.opacity = "0.5";

            button.parentElement.addEventListener('mouseover', () => {
                const tooltip = button.parentElement.querySelector('.certificate-tooltip');
                tooltip.style.display = 'flex';
            });

            button.parentElement.addEventListener('mouseout', () => {
                const tooltip = button.parentElement.querySelector('.certificate-tooltip');
                tooltip.style.display = 'none';
            });
        })

        expiredSubscriptionBoxes.forEach(box => {
            box.style.display = "flex";

            const date = box.querySelector('.subscription_end_date');

            if (data.subscription_end) {
                const subscriptionEnd = new Date(data.subscription_end);

                date.textContent = ' on ' + subscriptionEnd.toISOString().split('T')[0];
            } else {
                date.textContent = '';
            }

            const link = box.querySelector('a');

            link.addEventListener('click', () => {
                let price;
                if (currentDomain.includes('webflow.io')) {
                    price = "price_1QfGqbCA20rcDWGhGrIUBQVr";
                } else {
                    price = "price_1Qrbi9CA20rcDWGhZg72KAVO";
                }

                let paymentData = {
                    success_url: "https://" + window.location.hostname + "/user-dashboard",
                    cancel_url: "https://" + window.location.hostname + "/user-dashboard",
                    email: data.email,
                    line_items: [
                        {
                            price: price,
                            quantity: "1",
                        }
                    ]
                };

                user.initialPayment(paymentData).then(result => {
                    window.location.href = result.url
                });
            })
        })
    }

    setModals('initial-user');

    if (urlParams.has('certificate') && data.tutorial_shown === false) {
        showTutorial = true;
        const patchData = {
            tutorial_shown: true
        }
        user.patchUser(data.id, patchData);
    }

    // if (data.welcome_message_hidden === false) {
    //     document.querySelector('#welcome-message').style.display = 'flex';
    //     document.querySelector('#welcome-message-hide').addEventListener('click', () => {
    //         document.querySelector('#welcome-message').style.display = 'none';
    //         const patchData = {
    //             welcome_message_hidden: true
    //         }
    //         user.patchUser(data.id, patchData);
    //     })
    // }
});

const urlParams = new URLSearchParams(window.location.search);

certificate.getAll().then((data) => {
    if (data && data.items.length >= 5) {
        const addCertificateButton = document.querySelector(`[data-modal-open="add-certificate-popup"]`);
        addCertificateButton.style.display = 'none';

        loader.style.display = 'none';
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
                const certificateTable = document.querySelector(`#certificate-tables`);
                const afterRegisterSection = document.querySelector(`#after-register-section`);

                certificateTable.classList.add('hide');
                afterRegisterSection.classList.remove('hide');
                afterRegisterSection.setAttribute('data-show', true);

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

                        loader.style.display = 'none';
                    })
                } else {
                    loader.style.display = 'none';
                }
            } else {
                loader.style.display = 'none';
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

        loader.style.display = 'none';
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

        successMessage.innerHTML = 'Certificate has been successfully created.';
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
        // if (!ffaCertificateNumberWrapper.classList.contains('hidden')) {
        //     ffaCertificateNumberWrapper.classList.add('hidden');
        // }
    }
    if (isMedical.checked) {
        trackingNumberWrapper.classList.remove('hidden');
        // if (!trackingNumberWrapper.classList.contains('hidden')) {
        //     trackingNumberWrapper.classList.add('hidden');
        // }
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
    // if (!ffaCertificateNumberWrapper.classList.contains('hidden')) {
    //     ffaCertificateNumberWrapper.classList.add('hidden');
    // }
})
isMedical.addEventListener('click', function (event) {
    trackingNumberWrapper.classList.remove('hidden');
    // if (!trackingNumberWrapper.classList.contains('hidden')) {
    //     trackingNumberWrapper.classList.add('hidden');
    // }
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

const waitForModal = setInterval(() => {
    const certificateModal = document.querySelector('#add-certificate-popup');
    if (certificateModal) {
        clearInterval(waitForModal);
        setupFormValidation(certificateModal);
    }
}, 100);

function setupFormValidation(certificateModal) {
    const certificateSubmitButton = certificateModal.querySelector('#certificate-next');
    const certificateForm = certificateModal.querySelector('form');

    certificateForm.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("input", checkInputs);
        el.addEventListener("change", checkInputs);
    });

    function checkInputs() {
        let allFilled = true;

        const formData = new FormData(certificateForm);
        const entries = Array.from(formData.entries());
        const requiredFields = getRequiredFields(entries);

        requiredFields.forEach(fieldName => {
            const field = certificateForm.querySelector('[name="' + fieldName + '"]');
            if (fieldName === 'aircraft_details') {
                const regex = /^N.{2,5}$/;
                if (!field || !regex.test(field.value.trim())) {
                    allFilled = false;
                }
            } else {
                if (!field || !field.value.trim()) {
                    allFilled = false;
                }
            }
        });

        if (allFilled) {
            certificateSubmitButton.classList.remove('is-disabled');
        } else {
            certificateSubmitButton.classList.add('is-disabled');
        }
    }

    function getRequiredFields(entries) {
        let requiredFields;

        const typeValue = entries.find(item => item[0] === 'type')?.[1];
        if (typeValue === 'aircraft_registration_certificate') {
            requiredFields = ['aircraft_details', 'aircraft_make', 'aircraft_model', 'aircraft_serial_number'];
        } else {
            const existingValue = entries.find(item => item[0] === 'is_existing')?.[1];
            if (existingValue === 'false') {
                const medicalValue = entries.find(item => item[0] === 'is_medical')?.[1];

                if (typeof medicalValue === "undefined") {
                    requiredFields = ['iarca_tracking_number'];
                } else {
                    if (medicalValue === 'false') {
                        requiredFields = ['iarca_tracking_number'];
                    } else {
                        requiredFields = ['iarca_tracking_number'];
                    }
                }
            } else {
                const existingCertificate = entries.find(item => item[0] === 'existing_certificate')?.[1];
                if (existingCertificate === 'part_67') {
                    requiredFields = ['existing_certificate', 'applicant_id_number'];
                } else {
                    requiredFields = ['existing_certificate', 'ffa_certificate_number'];
                }
            }
        }

        return requiredFields;
    }

    checkInputs();
}

function setBillingLink() {
    const authToken =  localStorage.getItem('authToken');

    billingOpen.addEventListener('click', () => {
        const currentDomain = window.location.hostname;

        let branch = '';
        let dataSource = 'live';
        if (currentDomain.includes('webflow.io')) {
            branch = ':stage';
            dataSource = 'stage';
        }

        fetch(`https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx${branch}/portal-sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': dataSource,
            },
            body: JSON.stringify({
                return_url: "https://agent-for-service-cbd62c.webflow.io/user-dashboard",
                user_id: billingOpen.getAttribute('data-id-user-id'),
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    return;
                }

                window.open(result, "_blank");
            })
            .catch((error) => {
            });
    }, { once: true });
}

user.getUserReferrals().then((data) => {
    if (data.length === 0) {
        document.querySelector('#referrals-box').style.display = 'none';

        return;
    }

    document.querySelector('.referral-number').textContent = data.length;

    const container = document.querySelector('.referral-list');
    const templateRow = container.querySelector('.referral-row');

    container.innerHTML = '';

    data.forEach((item, index) => {
        const row = templateRow.cloneNode(true);

        container.appendChild(row);
    });
})