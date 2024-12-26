const url = window.location.href;

const params = new URLSearchParams(new URL(url).search);

const sessionId = params.get('session_id');

fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx/sessions/' + sessionId, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        return result;
    })
    .catch((error) => {
        console.error('Error:', error);
        // Optionally handle errors, such as displaying a message to the user
    });