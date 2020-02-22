//Stores information regarding the authentication of the user
const initialState = {
    loggedIn: false,
    username: "",
    email: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN':
            return{
                ...state,
                loggedIn: action.payload.loggedIn,
                username: action.payload.username,
                email: action.payload.email,
            };
        case 'LOG_OUT':
            return{
                loggedIn: false,
                username: "",
                email: "",
            };
        default:
            return state
    }
}