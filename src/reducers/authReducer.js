//Stores information regarding the authentication of the user
const initialState = {
    loggedIn: false,
    username: "",
    email: "",
    registerMessage: "",
    loginMessage: ""
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
                username: action.payload.username,
                email: action.payload.email,
                loginMessage: action.payload.loginMess,
            };
        case 'LOG_OUT':
            return {
                loggedIn: false,
                username: "",
                email: "",
            };
        case 'REGISTER':
            return {
                ...state,
                registerMessage: action.message,
            };
        case 'REGISTER_CLEANUP':
            return {
                ...state,
                registerMessage: "",
            };
        case 'LOGIN_CLEANUP':
            return {
                ...state,
                loginMessage: "",
            };
        default:
            return state
    }
}