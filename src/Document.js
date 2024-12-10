export default class Document {
    createDocument(data) {
        // Call the Xano API
        fetch('https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
    getAllDocuments() {
        const authToken =  localStorage.getItem('authToken');
        const columnId = document.getElementById('documents-column-id')
        const columnName = document.getElementById('documents-column-name')
        const columnUser = document.getElementById('documents-column-user')
        const columnPrice = document.getElementById('documents-column-price')
        const columnStatus = document.getElementById('documents-column-status')
        const columnBlank = document.getElementById('documents-column-blank')
        const columnActions = document.getElementById('documents-column-actions')

        let rowId, rowName, rowUser, rowPrice, rowStatus, rowActions;
        let rowBlank = `
            <div class="row-inside">
                <div class="gray-box"></div>
            </div>
        `;

        // Call the Xano API
        fetch('https://x8ki-letl-twmt.n7.xano.io/api:jeVaMFJ2/documents', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((result) => {
                result.forEach((document) => {
                    rowId = `
                        <div class="row-inside">
                            <div>ID</div>
                        </div>
                    `;
                    rowName = `
                        <div class="row-inside">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 19 22" fill="none" class="svg">
                                <path d="M10.5 1H13.2C14.8802 1 15.7202 1 16.362 1.32698C16.9265 1.6146 17.3854 2.07354 17.673 2.63803C18 3.27976 18 4.11984 18 5.8V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V15.5M14 12H9.5M14 8H10.5M14 16H6M4 9V3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5V9C7 10.6569 5.65685 12 4 12C2.34315 12 1 10.6569 1 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <div class="txt-row">${document.title}</div>
                        </div>
                    `;
                    rowUser = `
                        <div class="row-inside">
                            <div class="user-image"></div>
                            <div class="txt-row">${document._user.first_name} ${document._user.last_name}</div>
                        </div>
                    `;
                    rowPrice = `
                        <div class="row-inside">
                            <div class="grey-box">
                                <div class="dot"></div>
                                <div>${document._shipping_tariffs.price} $</div>
                            </div>
                        </div>
                    `;
                    rowStatus = `
                        <div class="row-inside">
                            <div class="status-box orange">
                                <div class="dot orange"></div>
                                <div class="badge-text orange">${document._document_status.status_label}</div>
                            </div>
                        </div>
                    `;
                    rowActions = `
                        <div class="row-inside right">
                            <div class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                                <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                            <div class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                                <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        </div>
                    `;

                    columnId.innerHTML += rowId;
                    columnName.innerHTML += rowName;
                    columnUser.innerHTML += rowUser;
                    columnPrice.innerHTML += rowPrice;
                    columnStatus.innerHTML += rowStatus;
                    columnBlank.innerHTML += rowBlank;
                    columnActions.innerHTML += rowActions;
                })
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}