export default class TableRow {
    getTableRow(menuName, column, item, statusBadgeColor = null) {
        const generators = {
            document: {
                id: () => `
                <div class="row-inside">
                    <div># ${item.real_id}</div>
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
                    <div class="txt-row">${item._user?.first_name} ${item._user?.last_name}</div>
                </div>
            `,
                price: () => `
                <div class="row-inside">
                    <div class="grey-box">
                        <div class="dot"></div>
                        <div>${item._choosed_shipping_tariffs?.price ? item._choosed_shipping_tariffs.price + '$' : 'TBA'}</div>
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
                    <div># ${item.id}</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.first_name} ${item.last_name}</div>
                </div>
            `,
                address: () => `
                <div class="row-inside txt-lowercase">
                    <div>${item._user_addresses_of_user?.street} ${item._user_addresses_of_user?.number}, ${item._user_addresses_of_user?.zip} ${item._user_addresses_of_user?.city}, ${item._user_addresses_of_user?.state}, ${item._user_addresses_of_user?.country}</div>
                </div>
            `,
                email: () => `
                <div class="row-inside txt-lowercase">
                    <div>${item.email}</div>
                </div>
            `,
                status: () => `
                <div class="row-inside">
                    <div>${item._certificates_of_user[0] && item._certificates_of_user[0].is_active === true ? 'PAID' : 'NOT PAID'}</div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
            },
            user_document_admin: {
                id: () => `
                <div class="ud-column">
                    <div># ${item.real_id}</div>
                </div>
            `,
                name: () => `
                <div class="ud-column">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 19 22" fill="none" class="svg">
                        <path d="M10.5 1H13.2C14.8802 1 15.7202 1 16.362 1.32698C16.9265 1.6146 17.3854 2.07354 17.673 2.63803C18 3.27976 18 4.11984 18 5.8V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V15.5M14 12H9.5M14 8H10.5M14 16H6M4 9V3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5V9C7 10.6569 5.65685 12 4 12C2.34315 12 1 10.6569 1 9V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="txt-row">${item.title}</div>
                </div>
            `,
                status: () => `
                <div class="ud-column">
                    <div class="status-box ${statusBadgeColor}">
                        <div class="dot ${statusBadgeColor}"></div>
                        <div class="badge-text ${statusBadgeColor}">${item._document_status.status_label.replaceAll('_', ' ')}</div>
                    </div>
                </div>
            `,
            },
            shippingTariff: {
                id: () => `
                <div class="row-inside">
                    <div># ${item.id}</div>
                </div>
            `,
                name: () => `
                <div class="row-inside">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 22" fill="none" class="svg">
                    <path d="M18.5 6.27783L9.99997 11.0001M9.99997 11.0001L1.49997 6.27783M9.99997 11.0001L10 20.5001M19 15.0586V6.94153C19 6.59889 19 6.42757 18.9495 6.27477C18.9049 6.13959 18.8318 6.01551 18.7354 5.91082C18.6263 5.79248 18.4766 5.70928 18.177 5.54288L10.777 1.43177C10.4934 1.27421 10.3516 1.19543 10.2015 1.16454C10.0685 1.13721 9.93146 1.13721 9.79855 1.16454C9.64838 1.19543 9.50658 1.27421 9.22297 1.43177L1.82297 5.54288C1.52345 5.70928 1.37369 5.79248 1.26463 5.91082C1.16816 6.01551 1.09515 6.13959 1.05048 6.27477C1 6.42757 1 6.59889 1 6.94153V15.0586C1 15.4013 1 15.5726 1.05048 15.7254C1.09515 15.8606 1.16816 15.9847 1.26463 16.0893C1.37369 16.2077 1.52345 16.2909 1.82297 16.4573L9.22297 20.5684C9.50658 20.726 9.64838 20.8047 9.79855 20.8356C9.93146 20.863 10.0685 20.863 10.2015 20.8356C10.3516 20.8047 10.4934 20.726 10.777 20.5684L18.177 16.4573C18.4766 16.2909 18.6263 16.2077 18.7354 16.0893C18.8318 15.9847 18.9049 15.8606 18.9495 15.7254C19 15.5726 19 15.4013 19 15.0586Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="txt-row">${item.label.charAt(0).toUpperCase() + item.label.slice(1)}</div>
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
                    <div># ${item.real_id}</div>
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
                        <div>${item._choosed_shipping_tariffs?.price ? item._choosed_shipping_tariffs.price + '$' : 'TBA'}</div>
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
            aircraft_certificates: {
                id: () => `
                <div class="row-inside">
                    <div># ${item.id}</div>
                </div>
            `,
                details: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.aircraft_details}</div>
                </div>
            `,
                make: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.aircraft_make}</div>
                </div>
            `,
                model: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.aircraft_model}</div>
                </div>
            `,
                serial_number: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.aircraft_serial_number}</div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
                status: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.is_active === true ? 'ACTIVE' : 'NOT ACTIVE'}</div>
                </div>
            `,
            },
            airman_certificates: {
                id: () => `
                <div class="row-inside">
                    <div># ${item.id}</div>
                </div>
            `,
                ffa_certificate_number: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.ffa_certificate_number ?? ''}</div>
                </div>
            `,
                applicant_id_number: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.applicant_id_number ?? ''}</div>
                </div>
            `,
                iarca_tracking_number: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.iarca_tracking_number ?? ''}</div>
                </div>
            `,
                existing_certificate: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.existing_certificate === 'part_61' ? 'Pilot, Flight Instructor.... (Part 61)' : ''}${item.existing_certificate === 'part_63' ? 'Flight Engineer, Flight Navigator (Part 63)' : ''}${item.existing_certificate === 'part_65' ? 'ATC Tower Operator.... (Part 65)' : ''}${item.existing_certificate === 'part_67' ? 'Medical Certificate (Part 67)' : ''}${item.existing_certificate === 'part_107' ? 'Remote Pilot / UAS (Part 107)' : ''}${item.existing_certificate === 'other' ? 'Other' : ''}</div>
                </div>
            `,
                blank: () => `
                <div class="row-inside">
                    <div class="gray-box"></div>
                </div>
            `,
                status: () => `
                <div class="row-inside">
                    <div class="txt-row">${item.is_active === true ? 'ACTIVE' : 'NOT ACTIVE'}</div>
                </div>
            `,
            }
        };

        const generator = generators[menuName]?.[column];
        return generator ? generator() : 'unknown';
    }
    getActionRow (menu, tab, item) {
        const actionRows = {
            1: {
                1: `
                    <div class="row-inside right">
                        ${item._document_status?.status_label === 'forwarding_requested' ? `
                            <div data-modal-open="payment-document-popup" data-id-documents-id="${item.id}" data-fill-1-1=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'waiting_for_payment' ? `
                            <div data-modal-open="edit-document-popup" data-id-documents-id="${item.id}" data-fill-1-1=${item.id} class="edit-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                                <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                            <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                                <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'paid' ? `
                            <div data-modal-open="forward-document-popup" data-id-documents-id="${item.id}" data-fill-1-1=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'shred_requested' ? `
                            <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                                <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
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
                        <div class="actions-svg-wrap" data-users-details="${item.id}"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="edit-user-popup" data-id-user-id="${item.id}" data-fill-2-1=${item.id} data-w-id="0045a2c6-c7f0-9cd5-abef-db621c375a6e" class="edit-doc-svg-wrap-all-users"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                            <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-user-popup" data-id-user-id="${item.id}" data-fill-2-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                2: `
                    <div class="ud-column lowercase no-border">
                        ${item._document_status?.status_label === 'forwarding_requested' ? `
                            <div data-modal-open="payment-document-popup" data-id-documents-id="${item.id}" data-fill-2-2=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'waiting_for_payment' ? `
                            <div data-modal-open="edit-document-popup" data-id-documents-id="${item.id}" data-fill-2-2=${item.id} class="edit-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 17 17" fill="none" class="action-svg">
                                <path d="M12.5 7.50023L9.50002 4.50023M0.875 16.1252L3.41328 15.8432C3.72339 15.8087 3.87845 15.7915 4.02338 15.7446C4.15197 15.703 4.27434 15.6442 4.38717 15.5698C4.51434 15.4859 4.62466 15.3756 4.84529 15.1549L14.75 5.25023C15.5784 4.4218 15.5784 3.07865 14.75 2.25023C13.9216 1.4218 12.5784 1.4218 11.75 2.25023L1.8453 12.1549C1.62466 12.3756 1.51434 12.4859 1.43048 12.6131C1.35607 12.7259 1.29726 12.8483 1.25564 12.9768C1.20872 13.1218 1.19149 13.2768 1.15703 13.587L0.875 16.1252Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                            <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                                <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'paid' ? `
                            <div data-modal-open="forward-document-popup" data-id-documents-id="${item.id}" data-fill-2-2=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                        ` : ''}
                        ${item._document_status?.status_label === 'shred_requested' ? `
                            <div data-modal-open="shred-document-popup" data-id-documents-id="${item.id}" class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                                <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-2-2=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
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
                        <div data-modal-open="edit-document-address-popup" data-id-document-addresses-id="${item._document_addresses_of_documents?.id}" data-fill-5-1=${item.id} style="display: none"></div>
                        <div data-modal-open="details-document-popup" data-fill-5-1=${item.id} class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        ${item._document_status?.status_label === 'waiting_for_payment' ? `
                            <div onclick="window.open('${item.payment_link + '?client_reference_id=' + item.id + '&prefilled_email=' + item._user.email}', '_blank');" class="actions-svg-wrap pay-btn">Pay now</div>
                            <div data-modal-open="request-forward-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id} class="forvard-doc-scg-wrap no-padd"><img loading="lazy" src="https://cdn.prod.website-files.com/673cc2bec8c34d28fd73175f/67519f8578799b349334867f_Forwarding%20Mail.svg" alt="" class="action-svg bigger"></div>
                            <div data-modal-open="request-shred-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id} class="shred-doc-svg-wrap no-padd"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 20 19" fill="none" class="action-svg bigger">
                            <path d="M11.5 1.20215V4.30005C11.5 4.72009 11.5 4.93011 11.5817 5.09055C11.6537 5.23167 11.7684 5.3464 11.9095 5.41831C12.0699 5.50005 12.28 5.50005 12.7 5.50005H15.7979M4 10.15V4.6C4 3.33988 4 2.70982 4.24524 2.22852C4.46095 1.80516 4.80516 1.46095 5.22852 1.24524C5.70982 1 6.33988 1 7.6 1H11.5L16 5.5V10.15M13 9.25H7M8.5 6.25H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M19 12.25H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M14.5 14.5V16.375V18.25M5.5 14.5V18.25M11.5 14.5V18.25M8.5 14.5V18.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
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
                        ${item._document_status?.status_label === 'shredded' || item._document_status?.status_label === 'delivered' ? `
                            <div data-modal-open="archive-document-popup" data-id-documents-id="${item.id}" data-fill-5-1=${item.id}  class="archive-doc-user-d"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 16" fill="none" class="action-svg">
                              <path d="M3 4.99745C2.87699 4.99427 2.78767 4.98715 2.70736 4.97118C2.11233 4.85282 1.64718 4.38767 1.52882 3.79264C1.5 3.64774 1.5 3.47349 1.5 3.125C1.5 2.77651 1.5 2.60226 1.52882 2.45736C1.64718 1.86233 2.11233 1.39718 2.70736 1.27882C2.85226 1.25 3.02651 1.25 3.375 1.25H14.625C14.9735 1.25 15.1477 1.25 15.2926 1.27882C15.8877 1.39718 16.3528 1.86233 16.4712 2.45736C16.5 2.60226 16.5 2.77651 16.5 3.125C16.5 3.47349 16.5 3.64774 16.4712 3.79264C16.3528 4.38767 15.8877 4.85282 15.2926 4.97118C15.2123 4.98715 15.123 4.99427 15 4.99745M7.5 8.75H10.5M3 5H15V11.15C15 12.4101 15 13.0402 14.7548 13.5215C14.539 13.9448 14.1948 14.289 13.7715 14.5048C13.2902 14.75 12.6601 14.75 11.4 14.75H6.6C5.33988 14.75 4.70982 14.75 4.22852 14.5048C3.80516 14.289 3.46095 13.9448 3.24524 13.5215C3 13.0402 3 12.4101 3 11.15V5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        ` : ''}
                    </div>
                `,
            },
            6: {
                1:`
                    <div class="row-inside right">
                        <div data-modal-open="details-document-popup" data-fill-6-1=${item.id} class="actions-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 18 12" fill="none" class="action-svg">
                            <path d="M1.81509 6.53488C1.71295 6.37315 1.66188 6.29229 1.63329 6.16756C1.61182 6.07387 1.61182 5.92613 1.63329 5.83244C1.66188 5.70771 1.71295 5.62685 1.81509 5.46512C2.65915 4.12863 5.17155 0.75 9.0003 0.75C12.8291 0.75 15.3415 4.12863 16.1855 5.46512C16.2877 5.62685 16.3387 5.70771 16.3673 5.83244C16.3888 5.92613 16.3888 6.07387 16.3673 6.16756C16.3387 6.29229 16.2877 6.37315 16.1855 6.53488C15.3415 7.87137 12.8291 11.25 9.0003 11.25C5.17155 11.25 2.65915 7.87137 1.81509 6.53488Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9.0003 8.25C10.2429 8.25 11.2503 7.24264 11.2503 6C11.2503 4.75736 10.2429 3.75 9.0003 3.75C7.75766 3.75 6.7503 4.75736 6.7503 6C6.7503 7.24264 7.75766 8.25 9.0003 8.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                        <div data-modal-open="delete-document-popup" data-id-documents-id="${item.id}" data-fill-6-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            },
            7: {
                1:`
                    <div class="row-inside right">
                        ${item.is_active === false ? `
                            <div data-payment-open="aircraft" data-id-certificates-id="${item.id}" class="actions-svg-wrap pay-btn-cert">Pay Now</div>
                        ` : ''}
                        ${item.is_active === true ? `
                            <div data-billing-open="${item.id}" class="billing-icon-wrap">Billing
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.66679 12.5H2.00002C1.46576 12.5 0.963518 12.2919 0.585777 11.9142C0.208037 11.5364 0 11.0342 0 10.5V3.83333C0 3.2991 0.20806 2.79687 0.5858 2.41913C0.963541 2.0414 1.46578 1.83334 2.00005 1.83334H4.66675C5.03496 1.83334 5.33343 2.1318 5.33343 2.50001C5.33343 2.86822 5.03496 3.16668 4.66675 3.16668H2.00002C1.82193 3.16668 1.65454 3.23603 1.52864 3.36193C1.40274 3.48783 1.33336 3.65524 1.33336 3.83333V10.5C1.33336 10.6781 1.40272 10.8455 1.52864 10.9714C1.65454 11.0973 1.82193 11.1667 2.00002 11.1667H8.66677C8.84486 11.1667 9.01225 11.0973 9.13818 10.9714C9.26407 10.8455 9.33343 10.6781 9.33343 10.5V7.83333C9.33343 7.46512 9.63192 7.16668 10.0001 7.16668C10.3683 7.16668 10.6668 7.46514 10.6668 7.83333V10.5C10.6668 11.0342 10.4588 11.5364 10.081 11.9142C9.70325 12.2919 9.20098 12.5 8.66679 12.5ZM4.66675 8.49998C4.49611 8.49998 4.3255 8.43491 4.19534 8.30473C3.935 8.04439 3.935 7.62225 4.19534 7.36191L9.72398 1.83334H7.33345C6.96524 1.83334 6.66679 1.53488 6.66679 1.16667C6.66679 0.798461 6.96524 0.5 7.33345 0.5H11.3335C11.4257 0.5 11.5135 0.518724 11.5934 0.552561C11.668 0.584094 11.738 0.629785 11.7992 0.689659L11.7993 0.689705C11.7997 0.690148 11.8002 0.690567 11.8006 0.69101C11.8007 0.691126 11.8008 0.691266 11.801 0.691382C11.8013 0.691708 11.8017 0.692058 11.802 0.692407C11.8022 0.69264 11.8024 0.692849 11.8027 0.693082C11.8029 0.693338 11.8032 0.693618 11.8034 0.693827C11.8039 0.694293 11.8044 0.694782 11.8049 0.695271C11.8053 0.695737 11.8058 0.696249 11.8063 0.696715C11.8066 0.696948 11.8068 0.697251 11.807 0.69746C11.8073 0.697693 11.8075 0.697903 11.8077 0.698136C11.8081 0.698485 11.8084 0.698811 11.8087 0.699184C11.8088 0.699277 11.809 0.69944 11.8091 0.699556C11.8095 0.699999 11.81 0.700441 11.8104 0.700884L11.8104 0.70093C11.8703 0.762225 11.916 0.832229 11.9475 0.906751C11.9814 0.98663 12.0001 1.07443 12.0001 1.16665V5.16665C12.0001 5.53486 11.7016 5.83332 11.3334 5.83332C10.9652 5.83332 10.6667 5.53486 10.6667 5.16665V2.77616L5.13804 8.30475C5.00797 8.43493 4.83736 8.49998 4.66675 8.49998Z" fill="#475467"/>
                                </svg>
                            </div>
                        ` : ''}
                        <div data-modal-open="delete-certificate-popup" data-id-certificates-id="${item.id}" data-fill-7-1=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
                2:`
                    <div class="row-inside right">
                        ${item.is_active === false ? `
                            <div data-payment-open="airman" data-id-certificates-id="${item.id}" class="actions-svg-wrap pay-btn-cert">Pay Now</div>
                        ` : ''}
                        ${item.is_active === true ? `
                            <div data-billing-open="${item.id}" class="billing-icon-wrap">Billing
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.66679 12.5H2.00002C1.46576 12.5 0.963518 12.2919 0.585777 11.9142C0.208037 11.5364 0 11.0342 0 10.5V3.83333C0 3.2991 0.20806 2.79687 0.5858 2.41913C0.963541 2.0414 1.46578 1.83334 2.00005 1.83334H4.66675C5.03496 1.83334 5.33343 2.1318 5.33343 2.50001C5.33343 2.86822 5.03496 3.16668 4.66675 3.16668H2.00002C1.82193 3.16668 1.65454 3.23603 1.52864 3.36193C1.40274 3.48783 1.33336 3.65524 1.33336 3.83333V10.5C1.33336 10.6781 1.40272 10.8455 1.52864 10.9714C1.65454 11.0973 1.82193 11.1667 2.00002 11.1667H8.66677C8.84486 11.1667 9.01225 11.0973 9.13818 10.9714C9.26407 10.8455 9.33343 10.6781 9.33343 10.5V7.83333C9.33343 7.46512 9.63192 7.16668 10.0001 7.16668C10.3683 7.16668 10.6668 7.46514 10.6668 7.83333V10.5C10.6668 11.0342 10.4588 11.5364 10.081 11.9142C9.70325 12.2919 9.20098 12.5 8.66679 12.5ZM4.66675 8.49998C4.49611 8.49998 4.3255 8.43491 4.19534 8.30473C3.935 8.04439 3.935 7.62225 4.19534 7.36191L9.72398 1.83334H7.33345C6.96524 1.83334 6.66679 1.53488 6.66679 1.16667C6.66679 0.798461 6.96524 0.5 7.33345 0.5H11.3335C11.4257 0.5 11.5135 0.518724 11.5934 0.552561C11.668 0.584094 11.738 0.629785 11.7992 0.689659L11.7993 0.689705C11.7997 0.690148 11.8002 0.690567 11.8006 0.69101C11.8007 0.691126 11.8008 0.691266 11.801 0.691382C11.8013 0.691708 11.8017 0.692058 11.802 0.692407C11.8022 0.69264 11.8024 0.692849 11.8027 0.693082C11.8029 0.693338 11.8032 0.693618 11.8034 0.693827C11.8039 0.694293 11.8044 0.694782 11.8049 0.695271C11.8053 0.695737 11.8058 0.696249 11.8063 0.696715C11.8066 0.696948 11.8068 0.697251 11.807 0.69746C11.8073 0.697693 11.8075 0.697903 11.8077 0.698136C11.8081 0.698485 11.8084 0.698811 11.8087 0.699184C11.8088 0.699277 11.809 0.69944 11.8091 0.699556C11.8095 0.699999 11.81 0.700441 11.8104 0.700884L11.8104 0.70093C11.8703 0.762225 11.916 0.832229 11.9475 0.906751C11.9814 0.98663 12.0001 1.07443 12.0001 1.16665V5.16665C12.0001 5.53486 11.7016 5.83332 11.3334 5.83332C10.9652 5.83332 10.6667 5.53486 10.6667 5.16665V2.77616L5.13804 8.30475C5.00797 8.43493 4.83736 8.49998 4.66675 8.49998Z" fill="#475467"/>
                                </svg>
                            </div>
                        ` : ''}
                        <div data-modal-open="delete-certificate-popup" data-id-certificates-id="${item.id}" data-fill-7-2=${item.id} class="delete-doc-svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 16 18" fill="none" class="action-svg">
                            <path d="M11 4.5V3.9C11 3.05992 11 2.63988 10.8365 2.31901C10.6927 2.03677 10.4632 1.8073 10.181 1.66349C9.86012 1.5 9.44008 1.5 8.6 1.5H7.4C6.55992 1.5 6.13988 1.5 5.81901 1.66349C5.53677 1.8073 5.3073 2.03677 5.16349 2.31901C5 2.63988 5 3.05992 5 3.9V4.5M6.5 8.625V12.375M9.5 8.625V12.375M1.25 4.5H14.75M13.25 4.5V12.9C13.25 14.1601 13.25 14.7902 13.0048 15.2715C12.789 15.6948 12.4448 16.039 12.0215 16.2548C11.5402 16.5 10.9101 16.5 9.65 16.5H6.35C5.08988 16.5 4.45982 16.5 3.97852 16.2548C3.55516 16.039 3.21095 15.6948 2.99524 15.2715C2.75 14.7902 2.75 14.1601 2.75 12.9V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg></div>
                    </div>
                `,
            }
        };

        return actionRows[menu]?.[tab] || 'Unknown Option';
    }
}