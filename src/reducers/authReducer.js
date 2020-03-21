//Stores information regarding the authentication of the user
const initialState = {
    loggedIn: false,
    username: "",
    email: "",
    userGoal: null,
    registerMessage: "",
    loginMessage: "",
    goalMessage: "",
    registered: false
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
                ...state,
                loggedIn: false,
                username: "",
                email: "",
            };
        case 'REGISTER':
            return {
                ...state,
                registerMessage: action.message,
                registered: action.registered,
            };
        case 'REGISTER_CLEANUP':
            return {
                ...state,
                registerMessage: "",
                registered: false
            };
        case 'LOGIN_CLEANUP':
            return {
                ...state,
                loginMessage: "",
            };
        case 'CREATE_USER_GOAL':
            return {
                ...state,
                goalMessage: action.message,
            };
        case 'GET_USER_INFORMATION':
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                userGoal: action.payload.userGoal,
                goalMessage: "",
            };
        default:
            return state
    }
}