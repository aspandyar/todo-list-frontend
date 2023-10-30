import {sendRequest} from "../root.js";

async function signIn(username, password) {
    const response = await sendRequest("auth/sign-in", "POST", JSON.stringify({
        username: username,
        password: password
    }));

    const data = await response.json();
    if (response.ok) {
        if (data.token === "" || data.token === undefined) {
            // TODO: popup error
            throw new Error("Token is undefined");
        }

        localStorage.setItem("apiToken", data.token);
    } else {
        throw new Error(data.error);
    }
}

async function eventSignIn(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await signIn(username, password);
    window.location.href = "/index.html";
}

const signInForm = document.getElementById("sign-in-form");
signInForm.addEventListener("submit", eventSignIn);
