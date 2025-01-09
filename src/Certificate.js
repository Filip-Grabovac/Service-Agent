export default class Certificate {
    constructor() {
        this.errorWrapper = document.getElementById('error-wrapper');
        this.errorMessage = document.getElementById('error-message');
        this.errorClose = document.getElementById('error-close');

        this.errorClose.addEventListener('click', (e) => {
            this.errorWrapper.classList.add('hide');
        });
    }
    showError(error) {
        this.errorMessage.innerHTML = error;
        this.errorWrapper.classList.remove('hide');

        setTimeout(() => {
            this.errorWrapper.classList.add('hide');
        }, 3000);

        console.error('Error:', error);
    }
    getAll(page = 1, perPage = 10, search = '', type) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1/certificates?page=${page}&per_page=${perPage}&type=${type}`;
        if (search !== '') {
            url += `&search=${encodeURIComponent(search)}`
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                return result
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    getAllActive(userId = null) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1/active-certificates`;

        if (userId !== null) {
            url += `&user_id=${userId}`;
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                return result
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    callMethod(methodName, ...args) {
        if (typeof this[methodName] === 'function') {
            return this[methodName](...args);
        } else {
            throw new Error(`Method "${methodName}" not exists.`);
        }
    }
}