export default class Document {
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
    getAll( page = 1, perPage = 10, search = '', statusIds = '1,2,3,4,5,6,7,8') {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents?page=${page}&per_page=${perPage}&document_status_ids=${statusIds}`;
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
                console.log(result)
                return result
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    getAllByUser( page = 1, perPage = 10, search = '', statusIds = '1,2,3,4,5,6,7,8', archived) {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents-user?page=${page}&per_page=${perPage}&document_status_ids=${statusIds}`;
        if (search !== '') {
            url += `&search=${encodeURIComponent(search)}`
        }
        url += `&archived=${archived}`

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
                return result
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    getCountByStatus() {
        const authToken =  localStorage.getItem('authToken');

        // Call the Xano API
        return fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:jeVaMFJ2/documents/count/by-status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
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