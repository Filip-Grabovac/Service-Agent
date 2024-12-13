export default class Document {
    createDocument(data) {
        // Call the Xano API
        fetch('https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result)
                // console.error('Error:', result.message);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    getAll( page = 1, perPage = 10, search = '', statusIds = '1,2,3,4,5,6,7,8') {
        const authToken =  localStorage.getItem('authToken');

        let url = `https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents?page=${page}&per_page=${perPage}&document_status_ids=${statusIds}`;
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