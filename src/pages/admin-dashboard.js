import User from '../User';
import Document from '../Document';

const user = new User();
const documentFile = new Document();

const createBtn = document.getElementById('create-document-btn');
const createTitle = document.getElementById('create-document-title');
const createUser = document.getElementById('create-document-user');
const createDescription = document.getElementById('create-document-description');
const createUrgent = document.getElementById('create-document-urgent');

// user.getAllUsers();
documentFile.getAllDocuments();
populateSelectWithUsers()

createBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form from submitting

    const data = {
        user_id: 1,
        title: createTitle.value,
        description: createDescription.value,
        is_urgent: createUrgent.checked,
    };

    if (validateData(data) === 1) {
        console.log('Error validating form');

        return;
    }

    documentFile.createDocument(data);

    createUser.value = 1;
    createTitle.value = '';
    createDescription.value = '';
    createUrgent.checked = false;
});

function validateData(data) {
    let hasErrors = 0;

    Object.entries(data).forEach(([key, value]) => {
        if (value.length === 0) {
            hasErrors = 1;
        }
    });

    return hasErrors;
}

function populateSelectWithUsers() {
    user.getAllUsers().then((users) => {
        if (users.length) {
            let userOptions = '';
            users.forEach((user) => {
                userOptions += `<option value="${user.id}">${user.first_name} ${user.last_name}</option>`
            })

            createUser.innerHTML += userOptions;
        }
    })
}