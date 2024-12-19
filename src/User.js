export default class User {
    authenticate() {
        const failureRedirect = '/log-in';
        const authToken = localStorage.getItem('authToken');

        // If there's no auth token, redirect to the failure page if not already there
        if (!authToken) {
            if (window.location.pathname === '/registration' || window.location.pathname === '/registration-2-4' || window.location.pathname === '/registration-3-4') {
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

                    // If the token is invalid, remove it and redirect to the failure page if not there already
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
                        if (window.location.pathname !== '/user-dashboard') {
                            window.location.href = '/user-dashboard';
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // Optionally handle errors, such as displaying a message to the user
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
                if (result.authToken) {
                    localStorage.setItem('authToken', result.authToken);

                    window.location.href = '/registration-3-4';
                } else {
                    console.error('Error:', result.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
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
                console.log(result)
                if (result.is_verified) {
                    localStorage.removeItem('registerData');

                    window.location.href = '/user-dashboard';
                } else {
                    console.error('Error:', 'Not verified');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
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
                if (result.authToken) {
                    localStorage.setItem('authToken', result.authToken);

                    this.authenticate();
                } else {
                    console.error('Error:', result.message);
                }

                localStorage.removeItem('registerData');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    logOut() {
        // Remove the authToken from local storage
        localStorage.removeItem('authToken');

        // Redirect to the login page
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
                return result;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    initialPayment(data) {
        // Call the Xano API
        return fetch('https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                return result
            })
            .catch((error) => {
                console.error('Error:', error);
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