// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const payBtn = document.getElementById('pay-button');

payBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    // let registerData = JSON.parse(localStorage.getItem('registerData'));

    let data = {
        success_url: "https://agent-for-service-cbd62c.webflow.io/user-dashboard",
        cancel_url: "https://agent-for-service-cbd62c.webflow.io/registration-4-4",
        line_items: [
            {
                price: "price_1QXMupCA20rcDWGhemNihUF8",
                quantity: "1"
            }
        ]
    };

    user.initialPayment(data).then(result => {
        window.location.href = result.url
    });
});