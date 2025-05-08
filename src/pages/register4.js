import User from '../User.js';

const user = new User();

const payBtn = document.getElementById('pay-button');

payBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let data = {
        success_url: "https://" + window.location.hostname + "/user-dashboard?registration=successful",
        cancel_url: "https://" + window.location.hostname + "/registration-4-4",
        line_items: [
            {
                price: "price_1QXMupCA20rcDWGhemNihUF8",
                quantity: "1",
            }
        ]
    };

    user.initialPayment(data).then(result => {
        window.location.href = result.url
    });
});