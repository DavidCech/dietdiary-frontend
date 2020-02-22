//Stores information regarding the authentication of the user
const initialState = {
    loggedIn: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'LOG_IN':
            return{
                ...state,
                loggedIn: action.payload
            };
        default:
            return state
    }
}