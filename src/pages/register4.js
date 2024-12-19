// import User from '../User';
import User from 'https://service-agent.pages.dev/src/User.js';

const user = new User();

const payBtn = document.getElementById('pay-btn');

payBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    // let registerData = JSON.parse(localStorage.getItem('registerData'));

    let data = {
        success_url: "",
        cancel_url: "",
        line_items: [
            {
                price: "price_1QXMupCA20rcDWGhemNihUF8",
                quantity: "1"
            }
        ]
    };

    let result = user.initialPayment(data);

    console.log(result)
});