//Takes credentials submitted by the user and calls login function from backend with these credentials, receives status
//code which then determines whether the user is logged in or not, if the status code is 200 it creates items both in
//local storage and in Redux store which then enable all the features which require authentication
export const logIn = (credentials) => dispatch => {
    fetch("http://localhost:6767/users/login", {
        body: JSON.stringify(credentials),
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else {
            let loginMessage = "";
            if (response.status === 400) {
                loginMessage = "Nesprávné přihlašovací údaje"
            } else {
                loginMessage = "Bohužel došlo k interní chybě při přihlašování";
            }
            dispatch({
                type: "LOG_IN",
                payload: {
                    loggedIn: false,
                    username: "",
                    email: "",
                    loginMess: loginMessage
                }
            });
        }
    }).then(json => {
        localStorage.setItem('username', json.username);
        localStorage.setItem('email', json.email);
        localStorage.setItem('logged', true);
        localStorage.setItem('authHeader', json.token);
        dispatch({
            type: 'LOG_IN',
            payload: {
                loggedIn: true,
                username: json.username,
                email: json.email,
            }
        });
    }).catch(e =>
        console.log(e)
    )
};

//Removes all data from Redux store and local storage which are responsible for enabling features for users who are logged in
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

//Sends a get request with authentication token in header to backend from which it then in turn receives status code. If
//the status code is 200, it dispatches an action with the json from response, else it dispatches an action with error
//message and a placeholder object.
export const getUserInformation = () => dispatch => {
    fetch("http://localhost:6767/users/userInformation", {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else {
            dispatch({
                type: 'GET_USER_INFORMATION',
                message: "Bohužel došlo k chybě při hledání cíle",
                payload: {email: "", username: "", userGoal: ""},
            });
        }
    }).then(response => {
        dispatch({
            type: 'GET_USER_INFORMATION',
            message: "",
            payload: response,
        });
    }).catch(e =>
        console.log(e)
    )
};

//Sends a post request with authentication token in header and userGoal in body which it receives as a parameter to backend
//from which it then in turn receives status code. Depending on the status code it creates appropriate message for the user
//and dispatches an action with it.
export const createUserGoal = (userGoal) => dispatch => {
    fetch("http://localhost:6767/users/intake", {
        body: JSON.stringify(userGoal),
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
    }).then(async response => {
        if (response.status === 200) {
            dispatch({
                type: "CREATE_USER_GOAL",
                message: "Cíl úspěšně vytvořen",
            });
        } else {
            dispatch({
                type: "CREATE_USER_GOAL",
                message: "Bohužel došlo k chybě při vytvoření cíle",
            });
        }
    }).catch(e =>
        console.log(e)
    )
};

//Takes credentials which the user submitted and calls register function from backend with these credentials which then
//creates a new user in the database, receives status code and generates appropriate message for the user
export const register = (credentials) => dispatch => {
    fetch("http://localhost:6767/users/register", {
        body: JSON.stringify(credentials),
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(async response => {
        if (response.status === 200) {
            dispatch({
                type: "REGISTER",
                message: "Úspěšně zaregistrován",
                registered: true,
            });
        } else {
            dispatch({
                type: "REGISTER",
                message: "Bohužel došlo k chybě při registraci",
                registered: false,
            });
        }
    }).catch(e =>
        console.log(e)
    )
};

//Clears the loginMessage property of Redux Store when called
export const loginCleanUp = () => dispatch => {
    dispatch({
        type: 'LOGIN_CLEANUP'
    });
};

//Clears the registerMessage property of Redux Store when called
export const registerCleanUp = () => dispatch => {
    dispatch({
        type: 'REGISTER_CLEANUP'
    });
};