import {sendRequest} from "../root.js";

async function signUp(name, username, password) {
    const response = await sendRequest('auth/sign-up', 'POST', JSON.stringify({
        name: name,
        username: username,
        password: password
    }));

    if (!response.ok) {
        // TODO: popup error
        const data = await response.json();
        throw new Error(data.message);
    }
}

async function eventSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    await signUp(name, username, password);
    window.location.href = '/signin/index.html';
}

const signInForm = document.getElementById('sign-up-form');
signInForm.addEventListener('submit', eventSignUp);
