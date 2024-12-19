export default class TableRow {
    getTableRow(menuName, column, item, statusBadgeColor = null) {
        const generators = {
            document: {
                id: () => `
                <div class="row-inside">
                    <div>ID</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 19 22" fill="none" class="svg">
                        <path d="M10.5 1H13.2C14.8802 1 15.7202 1 16.362 1.32698C16.9265 1.6146 17.3854 2.07354 17.673 2.63803C18 3.27976 18 4.11984 18 5.8V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V15.5M14 12H9.5M14 8H10.5M14 16H6M4 9V3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5V9C7 10.6569 5.65685 12 4 12C2.34315 12 1 10.6569 1 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="txt-row">${item.title}</div>
                </div>
            `,
                user: () => `
                <div class="row-inside">
                    <div class="user-image" style="background-image: url('${item._user?.profile_img?.url}')"></div>
                    <div class="txt-row">${item._user?.first_name} ${item._user?.last_name}</div>
                </div>
            `,
                price: () => `
                <div class="row-inside">
                    <div class="grey-box">
                        <div class="dot"></div>
                        <div>${item._shipping_tariffs?.price ? item._shipping_tariffs.price + '$' : 'TBA'}</div>
                    </div>
                </div>
            `,
                status: () => `
                <div class="row-inside">
                    <div class="status-box ${statusBadgeColor}">
                        <div class="dot ${statusBadgeColor}"></div>
                        <div class="badge-text ${statusBadgeColor}">${item._document_status.status_label.replaceAll('_', ' ')}</div>
                    </div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
            },
            user: {
                id: () => `
                <div class="row-inside">
                    <div>ID</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <div class="user-image" style="background-image: url('${item.profile_img?.url}')"></div>
                    <div class="txt-row">${item.first_name} ${item.last_name}</div>
                </div>
            `,
                address: () => `
                <div class="row-inside txt-lowercase">
                    <div>${item._user_addresses_of_user?.street}, ${item._user_addresses_of_user?.city} ${item._user_addresses_of_user?.zip}, ${item._user_addresses_of_user?.country}</div>
                </div>
            `,
                email: () => `
                <div class="row-inside txt-lowercase">
                    <div>${item.email}</div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
            },
            shippingTariff: {
                id: () => `
                <div class="row-inside">
                    <div>ID</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 22" fill="none" class="svg">
                    <path d="M18.5 6.27783L9.99997 11.0001M9.99997 11.0001L1.49997 6.27783M9.99997 11.0001L10 20.5001M19 15.0586V6.94153C19 6.59889 19 6.42757 18.9495 6.27477C18.9049 6.13959 18.8318 6.01551 18.7354 5.91082C18.6263 5.79248 18.4766 5.70928 18.177 5.54288L10.777 1.43177C10.4934 1.27421 10.3516 1.19543 10.2015 1.16454C10.0685 1.13721 9.93146 1.13721 9.79855 1.16454C9.64838 1.19543 9.50658 1.27421 9.22297 1.43177L1.82297 5.54288C1.52345 5.70928 1.37369 5.79248 1.26463 5.91082C1.16816 6.01551 1.09515 6.13959 1.05048 6.27477C1 6.42757 1 6.59889 1 6.94153V15.0586C1 15.4013 1 15.5726 1.05048 15.7254C1.09515 15.8606 1.16816 15.9847 1.26463 16.0893C1.37369 16.2077 1.52345 16.2909 1.82297 16.4573L9.22297 20.5684C9.50658 20.726 9.64838 20.8047 9.79855 20.8356C9.93146 20.863 10.0685 20.863 10.2015 20.8356C10.3516 20.8047 10.4934 20.726 10.777 20.5684L18.177 16.4573C18.4766 16.2909 18.6263 16.2077 18.7354 16.0893C18.8318 15.9847 18.9049 15.8606 18.9495 15.7254C19 15.5726 19 15.4013 19 15.0586Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="txt-row">${item.label}</div>
                </div>
            `,
                price: () => `
                <div class="row-inside">
                    <div class="grey-box">
                        <div class="dot"></div>
                        <div>${item.price ?? 'X'} $</div>
                    </div>
                </div>
            `,
                region: () => `
                <div class="row-inside">
                    <div class="grey-box">
                        <div class="dot"></div>
                        <div>${item.region}</div>
                    </div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
            },
            user_document: {
                id: () => `
                <div class="row-inside">
                    <div>ID</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 19 22" fill="none" class="svg">
                        <path d="M10.5 1H13.2C14.8802 1 15.7202 1 16.362 1.32698C16.9265 1.6146 17.3854 2.07354 17.673 2.63803C18 3.27976 18 4.11984 18 5.8V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V15.5M14 12H9.5M14 8H10.5M14 16H6M4 9V3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5V9C7 10.6569 5.65685 12 4 12C2.34315 12 1 10.6569 1 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="txt-row">${item.title}</div>
                </div>
            `,
                description: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.description}</div>
                </div>
            `,
                price: () => `
                <div class="row-inside">
                    <div class="grey-box">
                        <div class="dot"></div>
                        <div>${item._shipping_tariffs?.price ? item._shipping_tariffs.price + '$' : 'TBA'}</div>
                    </div>
                </div>
            `,
                status: () => `
                <div class="row-inside">
                    <div class="status-box ${statusBadgeColor}">
                        <div class="dot ${statusBadgeColor}"></div>
                        <div class="badge-text ${statusBadgeColor}">${item._document_status.status_label.replaceAll('_', ' ')}</div>
                    </div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
            },
        };

        const generator = generators[menuName]?.[column];
        return generator ? generator() : 'unknown';
    }
    getActionRow (menu, tab, item) {
        const actionRows = {
            1: {
                1: `
                    <div class="row-inside right">
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-1-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                2: `
                    <div class="row-inside right">
                        <div data-modal-open="payment-document-popup" data-id-documents-id="${item.id}" data-fill-1-2=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                    </div>
                `,
                3: `
                    <div class="row-inside right">
                        <div data-modal-open="edit-document-popup" data-id-documents-id="${item.id}" data-fill-1-3=${item.id} class="edit-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                            <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div class="notify-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M10.2502 14.25C10.2502 15.4926 9.24283 16.5 8.00019 16.5C6.75755 16.5 5.75019 15.4926 5.75019 14.25M9.34756 4.67892C9.67418 4.34148 9.87519 3.88171 9.87519 3.375C9.87519 2.33947 9.03572 1.5 8.00019 1.5C6.96465 1.5 6.12519 2.33947 6.12519 3.375C6.12519 3.88171 6.32619 4.34148 6.65281 4.67892M0.910302 6.24222C0.899542 5.15371 1.4864 4.13723 2.43446 3.6023M15.0901 6.24222C15.1008 5.15371 14.514 4.13723 13.5659 3.6023M12.5002 8.4C12.5002 7.36566 12.0261 6.37368 11.1822 5.64228C10.3383 4.91089 9.19366 4.5 8.00019 4.5C6.80671 4.5 5.66212 4.91089 4.81821 5.64228C3.97429 6.37368 3.50019 7.36566 3.50019 8.4C3.50019 10.1114 3.07578 11.3629 2.54623 12.2585C1.94269 13.2792 1.64092 13.7896 1.65284 13.9115C1.66647 14.051 1.69157 14.095 1.80469 14.1777C1.90356 14.25 2.40032 14.25 3.39383 14.25H12.6065C13.6001 14.25 14.0968 14.25 14.1957 14.1777C14.3088 14.095 14.3339 14.051 14.3475 13.9115C14.3595 13.7896 14.0577 13.2792 13.4541 12.2585C12.9246 11.3629 12.5002 10.1114 12.5002 8.4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                            <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-1-3=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                4: `
                   <div class="row-inside right">
                        <div data-modal-open="forward-document-popup" data-id-documents-id="${item.id}" data-fill-1-4=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                    </div>
                `,
                5: `
                    <div class="row-inside right">
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-1-5=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                6: `
                    <div class="row-inside right">
                        <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                            <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-1-6=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            2: {
                1: `
                    <div class="row-inside right">
                        <div class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="edit-user-popup" data-id-user-id="${item.id}" data-fill-2-1=${item.id} data-w-id="0045a2c6-c7f0-9cd5-abef-db621c375a6e" class="edit-doc-svg-wrap-all-users"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                            <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-user-popup" data-id-user-id="${item.id}" data-w-id="977932a6-e894-7582-7293-c081c9716e73" class="delete-user-svg-wrap-all-users"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            3: {
                1: `
                    <div class="row-inside right">
                        <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                            <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-3-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                2: `
                    <div class="row-inside right">
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-3-2=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            4: {
                1: `
                    <div class="row-inside right">
                        <div data-modal-open="edit-tariff-popup" data-id-shipping-tariffs-id="${item.id}" data-fill-4-1=${item.id} data-w-id="0be2d6ef-c764-1620-88df-4744a410cc21" class="edit-tariff-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                            <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-tariff-popup" data-id-shipping-tariffs-id="${item.id}" data-w-id="faa341e3-7279-00b1-f3ae-b021fad2f601" class="delete-tariff-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            5: {
                1:`
                    <div class="row-inside right">
                        <div data-modal-open="details-document-popup" data-fill-5-1=${item.id} class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        ${item._document_status?.status_label === 'waiting_for_payment' ? `
                            <div onclick="window.open('${item.payment_link}', '_blank');" class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 12 18" fill="none" class="action-svg smaller">
                                <path d="M1.5 12C1.5 13.6569 2.84315 15 4.5 15H7.5C9.15685 15 10.5 13.6569 10.5 12C10.5 10.3431 9.15685 9 7.5 9H4.5C2.84315 9 1.5 7.65685 1.5 6C1.5 4.34315 2.84315 3 4.5 3H7.5C9.15685 3 10.5 4.34315 10.5 6M6 1.5V16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'new' ? `
                            <div data-modal-open="request-forward-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                            <div data-modal-open="request-shred-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id} class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                            <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            6: {
                1:`
                    <div class="row-inside right">
                        <div data-modal-open="details-document-popup" data-fill-5-1=${item.id} class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-6-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            }
        };

        return actionRows[menu]?.[tab] || 'Unknown Option';
    }
}