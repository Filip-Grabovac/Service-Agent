export default class Certificate {
    constructor() {
        this.errorWrapper = document.getElementById('error-wrapper');
        this.errorMessage = document.getElementById('error-message');
        this.errorClose = document.getElementById('error-close');

        this.errorClose.addEventListener('click', (e) => {
            this.errorWrapper.classList.add('hide');
        });

        const currentDomain = window.location.hostname;

        if (currentDomain.includes('webflow.io')) {
            this.branch = ':stage';
            this.dataSource = 'stage';
        } else {
            this.branch = '';
            this.dataSource = 'live';
        }
    }
    showError(error) {
        this.errorMessage.innerHTML = error;
        this.errorWrapper.classList.remove('hide');

        setTimeout(() => {
            this.errorWrapper.classList.add('hide');
        }, 3000);

        console.error('Error:', error);
    }
    getAll(page = 1, perPage = 10, search = '', type = '') {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/certificates?page=${page}&per_page=${perPage}`;
        if (type !== '') {
            url += `&type=${type}`
        }
        if (search !== '') {
            url += `&search=${encodeURIComponent(search)}`
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
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
    getAllByUser(page = 1, perPage = 10, search = '', type = '', notUsed = null, userId) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/certificates?page=${page}&per_page=${perPage}&user_id=${userId}`;
        if (type !== '') {
            url += `&type=${type}`
        }
        if (search !== '') {
            url += `&search=${encodeURIComponent(search)}`
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
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

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/active-certificates`;

        if (userId !== null) {
            url += `?user_id=${userId}`;
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
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
    getAllInactive(userId = null) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/inactive-certificates`;

        if (userId !== null) {
            url += `?user_id=${userId}`;
        }

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
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
    getById(certificateId) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/certificates/` + certificateId;

        // Call the Xano API
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
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
    sendReminder() {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:HHssTwG1${this.branch}/send-reminder`;

        // Call the Xano API
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return false;
                }

                return true;
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