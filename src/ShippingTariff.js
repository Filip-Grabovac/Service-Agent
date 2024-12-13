export default class ShippingTariff {
    getAll(page = 1, perPage = 10, search = '') {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://x8ki-letl-twmt.n7.xano.io/api:SB0L29DX/shipping_tariffs?page=${page}&per_page=${perPage}`;
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
                return result
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}