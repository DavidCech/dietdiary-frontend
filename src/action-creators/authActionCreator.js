export const logIn = (credentials) => dispatch => {
    fetch("http://localhost:6767/users/login", {
        body: JSON.stringify(credentials),
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if(response.status === 200) {
            return response.json()
        } else {
            throw new Error ("Chyba " + response.status);
        }
    }).then(json => {
        localStorage.setItem('username', json.username);
        localStorage.setItem('email', json.email);
        localStorage.setItem('logged', true);
        localStorage.setItem('authHeader',json.token);
        dispatch({
            type: 'LOG_IN',
            payload: {
                loggedIn: true,
                username: json.username,
                email: json.email
            }
        });
        window.location.reload();
    }).catch(e =>
        console.log(e)
    )
};

export const logOut = () => dispatch => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('logged');
    localStorage.removeItem('authHeader');
    dispatch({
        type: 'LOG_OUT'
    });
    window.location.reload();
};

export const register = (credentials) => dispatch => {
    fetch("http://localhost:6767/users/register", {
        body: JSON.stringify(credentials),
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(async response => {
        if (response.status === 200) {
            console.log("Ok")
        }
    }).catch(e =>
        console.log(e)
    )
};