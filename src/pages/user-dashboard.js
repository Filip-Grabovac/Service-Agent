// import User from '../User';
// import { fillTable, updateActiveElement, updateActiveRole } from '../Table.js';
import User from 'https://service-agent.pages.dev/src/User.js';
import {fillTable, updateActiveElement, updateActiveRole} from 'https://service-agent.pages.dev/src/Table.js';

const user = new User();

const logout = document.getElementById('logout');

const userMenu1 = document.getElementById('user-menu1');
const userMenu2 = document.getElementById('user-menu2');

user.authenticate();

logout.addEventListener('click', function (event) {
    user.logOut()
})

userMenu1.addEventListener('click', function (event) {
    updateActiveElement(userMenu1)
    updateActiveRole('user')

    fillTable(5, 1, '1,2,3,4,5,7')
})
userMenu2.addEventListener('click', function (event) {
    updateActiveElement(userMenu2)
    updateActiveRole('user')

    fillTable(6, 1, '6,8')
})

userMenu1.click()


const pdfUrl = 'https://xjwh-2u0a-wlxo.n7d.xano.io/vault/V6ZqH-Ao/u7HXcgXwftuJt9bJFedNJpud-TQ/fYskBg../603d0e327eb2748c8ab1053f_loremipsum.pdf';

// Kontejner za sve stranice
const pdfContainer = document.getElementById('pdf-container');

// Učitaj PDF koristeći PDF.js
const loadingTask = pdfjsLib.getDocument(pdfUrl);
loadingTask.promise.then((pdf) => {
    console.log(`PDF učitan. Broj stranica: ${pdf.numPages}`);

    // Iteriraj kroz sve stranice i prikaži ih
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then((page) => {
            // Kreiraj container za svaku stranicu
            const pageContainer = document.createElement('div');
            pageContainer.classList.add('page-container');

            // Kreiraj canvas za trenutnu stranicu
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            // Postavi viewport
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Dodaj canvas u container
            pageContainer.appendChild(canvas);
            pdfContainer.appendChild(pageContainer);

            // Renderuj stranicu na canvas
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext).promise.then(() => {
                console.log(`Stranica ${pageNum} renderovana.`);
            });
        }).catch((error) => {
            console.error(`Greška pri učitavanju stranice ${pageNum}:`, error);
        });
    }
}).catch((error) => {
    console.error('Greška pri učitavanju PDF-a:', error);
});