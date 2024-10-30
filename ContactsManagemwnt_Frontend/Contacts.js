const API_URL = 'http://localhost:8080/api/contacts';

document.addEventListener('DOMContentLoaded', loadContacts);

function loadContacts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(contacts => {
            const list = document.getElementById('contacts-list');
            list.innerHTML = '';
            contacts.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.email}</td>
                    <td><button onclick="editContact(${contact.id})">Edit</button></td>
                    <td><button onclick="deleteContact(${contact.id})">Delete</button></td>
                `;
                list.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading contacts:', error));
}

function showAddContactForm() {
    document.getElementById('contact-form').style.display = 'block';
    document.getElementById('form-title').innerText = 'Add Contact';
    document.getElementById('contact-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('error-message').textContent = '';
}

function saveContact(event) {
    event.preventDefault();
    const id = document.getElementById('contact-id').value;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const errorMessage = document.getElementById('error-message');

    if (!name || !phone || !email) {
        errorMessage.textContent = "Please fill in all fields!";
        return;
    }

    if (phone.length !== 11 || isNaN(phone)) {
        errorMessage.textContent = "The phone number must be 11 digits!";
        return;
    }

    const contact = { name, phone, email };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    })
    .then(() => {
        closeForm();
        loadContacts();
    })
    .catch(error => console.error('Error saving contact:', error));
}

function editContact(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(contact => {
            document.getElementById('contact-id').value = contact.id;
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email;
            document.getElementById('contact-form').style.display = 'block';
            document.getElementById('form-title').innerText = 'Edit Contact';
            document.getElementById('error-message').textContent = '';
        })
        .catch(error => console.error('Error loading contact:', error));
}

function deleteContact(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => loadContacts())
        .catch(error => console.error('Error deleting contact:', error));
}

function viewContact(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(contact => {
            document.getElementById('detail-name').innerText = contact.name;
            document.getElementById('detail-phone').innerText = contact.phone;
            document.getElementById('detail-email').innerText = contact.email;
            document.getElementById('contact-details').style.display = 'block';
        })
        .catch(error => console.error('Error loading contact details:', error));
}

function closeForm() {
    document.getElementById('contact-form').style.display = 'none';
}

function closeDetails() {
    document.getElementById('contact-details').style.display = 'none';
}
