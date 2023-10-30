export const apiUrl = 'http://localhost:8000/';
export const apiToken = localStorage.getItem('apiToken');


export async function sendRequest(path, method = 'GET', body = null, headers = {}) {
    if (apiToken) {
        headers["Authorization"] = `Bearer ${apiToken}`
    }

    const response = await fetch(apiUrl + path, {
        method: method,
        headers: headers,
        body: body,
    });

    // If response is auth error, redirect to sign in page
    if (response.status === 401) {
        window.location.href = '/sign-in';
    }

    return response;
}
