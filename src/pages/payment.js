const url = window.location.href;

const params = new URLSearchParams(new URL(url).search);

const sessionId = params.get('session_id');

const errorWrapper = document.getElementById('error-wrapper');
const errorMessage = document.getElementById('error-message');
const errorClose = document.getElementById('error-close');

errorClose.addEventListener('click', (e) => {
    errorWrapper.classList.add('hide');
})

fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx/sessions/' + sessionId, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then((response) => response.json())
    .then((result) => {
        if (result.status !== 'complete') {
            const heading = document.getElementById('payment-heading');
            const description = document.getElementById('payment-description');
            const icon = document.getElementById('payment-icon');

            heading.innerText = 'Payment Failed';
            description.innerText = 'Your payment failed. Please try again later or contact support.';
            icon.setAttribute('src', 'https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/6777b770202d5aa733d194c2_payment-failed-icon.svg');
        }
    })
    .catch((error) => {
        errorMessage.innerHTML = 'Server Error! Please, try again or contact support.';
        errorWrapper.classList.remove('hide');

        setTimeout(function() {
            errorWrapper.classList.add('hide');
        }, 3000);

        console.error(error.message);
    });