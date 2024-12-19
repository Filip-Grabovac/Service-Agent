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


const pdfUrl = 'https://xjwh-2u0a-wlxo.n7d.xano.io/vault/V6ZqH-Ao/aglusEDHreNj7x8x_JiZswm1Yxs/-25oQQ../pdf-sample_0.pdf';

const canvas = document.getElementById('pdf-canvas');
const context = canvas.getContext('2d');

const loadingTask = pdfjsLib.getDocument(pdfUrl);

loadingTask.promise.then((pdf) => {
    console.log('PDF učitan:', pdf);

    pdf.getPage(1).then((page) => {
        console.log('Stranica učitana:', page);

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        page.render(renderContext).promise.then(() => {
            console.log('Renderovanje završeno');
        }).catch((error) => {
            console.error('Greška pri renderovanju stranice:', error);
        });
    }).catch((error) => {
        console.error('Greška pri učitavanju stranice:', error);
    });
}).catch((error) => {
    console.error('Greška pri učitavanju PDF-a:', error);
});