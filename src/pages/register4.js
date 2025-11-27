import User from '../User.js';

const user = new User();

const payBtn = document.getElementById('pay-button');

user.authenticate();

let referral = null;
if (localStorage.getItem('referral')) {
    referral = localStorage.getItem('referral');
}

payBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let price;
    if (currentDomain.includes('webflow.io')) {
        price = "price_1QfGqbCA20rcDWGhGrIUBQVr";
        referral = null;
    } else {
        price = "price_1Qrbi9CA20rcDWGhZg72KAVO";
    }

    user.me().then((data) => {
        let paymentData = {
            success_url: "https://" + window.location.hostname + "/user-dashboard?subscription=successful",
            cancel_url: "https://" + window.location.hostname + "/registration-4-4",
            email: data.email,
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
    })
});