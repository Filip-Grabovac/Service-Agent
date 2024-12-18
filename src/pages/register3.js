// import User from '../User';
// import User from 'https://github.com/Filip-Grabovac/Service-Agent/raw/refs/heads/main/src/User.js';
import User from 'https://cdn.jsdelivr.net/gh/Filip-Grabovac/Service-Agent@c965cbcc5c8e92901f58a18d6a2114978a7361cb/src/User.js';

const user = new User();

const nextBtn = document.getElementById('next-btn');
const code = document.getElementById('Enter-Codee');

nextBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    let registerData = JSON.parse(localStorage.getItem('registerData'));

    if (validateData(code.value) === 1) {
        console.log('Error validating form');

        return;
    }

    let data = {
        email: registerData.email,
        confirmation_code: code.value
    };

    user.confirmCode(data);
});

function validateData(code) {
    let hasErrors = 0;

    if (code.length !== 6) {
        hasErrors = 1;
    }

    return hasErrors;
}