export default class User {
    constructor() {
        this.errorWrapper = document.getElementById('error-wrapper');
        this.errorMessage = document.getElementById('error-message');
        this.errorClose = document.getElementById('error-close');
        this.successWrapper = document.getElementById('success-wrapper');
        this.successMessage = document.getElementById('success-message');
        this.successClose = document.getElementById('success-close');

        this.errorClose.addEventListener('click', (e) => {
            this.errorWrapper.classList.add('hide');
        });
        if (this.successClose) {
            this.successClose.addEventListener('click', (e) => {
                this.successWrapper.classList.add('hide');
            })
        }
    }
    showError(message) {
        this.errorMessage.innerHTML = message;
        this.errorWrapper.classList.remove('hide');

        setTimeout(() => {
            this.errorWrapper.classList.add('hide');
        }, 3000);

        console.error('Error:', message);
    }
    showSuccess(message) {
        this.successMessage.innerHTML = message;
        this.successWrapper.classList.remove('hide');

        setTimeout(() => {
            this.successWrapper.classList.add('hide');
        }, 3000);
    }
    authenticate() {
        const failureRedirect = '/log-in';
        const authToken = localStorage.getItem('authToken');

        // If there's no auth token, redirect to the failure page if not already there
        if (!authToken) {
            if (window.location.pathname === '/registration' || window.location.pathname === '/registration-2-4' || window.location.pathname === '/registration-3-4' || window.location.pathname === '/forgotten-password' || window.location.pathname === '/reset-password') {
                return;
            }
            if (window.location.pathname !== failureRedirect) {
                window.location.href = failureRedirect;
            }
            return;
        }

        // If there is a token, verify it with the API
        fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa/auth/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code === 'ERROR_CODE_UNAUTHORIZED') {
                    if (window.location.pathname === '/registration' || window.location.pathname === '/registration-2-4' || window.location.pathname === '/registration-3-4') {
                        return;
                    }

                    localStorage.removeItem('authToken');
                    if (window.location.pathname !== failureRedirect) {
                        window.location.href = failureRedirect;
                    }
                } else {
                    if (result.is_admin) {
                        if (window.location.pathname !== '/admin-dashboard') {
                            window.location.href = '/admin-dashboard';
                        }
                    } else {
                        if (result.is_verified) {
                            if (result.is_active) {
                                if (window.location.pathname !== '/user-dashboard') {
                                    window.location.href = '/user-dashboard';
                                }
                            } else {
                                window.location.href = '/registration-4-4';
                            }
                        } else {
                            window.location.href = '/registration-3-4';
                        }
                    }
                }
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    me () {
        const authToken = localStorage.getItem('authToken');
        return fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa/auth/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                return result;
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    register(data) {
        // Call the Xano API
        fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                if (result.authToken) {
                    localStorage.setItem('authToken', result.authToken);

                    window.location.href = '/registration-3-4';
                }
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    confirmCode(data) {
        // Call the Xano API
        fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/register/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                if (result.is_verified) {
                    window.location.href = '/registration-4-4';
                }
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    login(data) {
        // Call the Xano API
        fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                if (result.authToken) {
                    localStorage.setItem('authToken', result.authToken);

                    this.authenticate();

                    localStorage.removeItem('registerData');
                }
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    logOut() {
        localStorage.removeItem('authToken');

        window.location.href = '/log-in';
    }
    getAll(page = 1, perPage = 10, search = '') {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ/user?page=${page}&per_page=${perPage}`;
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

                return result;
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
    initialPayment(data) {
        const authToken =  localStorage.getItem('authToken');

        // Call the Xano API
        return fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
    reset(data) {
        // Call the Xano API
        fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa/password/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return;
                }

                this.showSuccess('Please check your Email for a link to reset password');
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