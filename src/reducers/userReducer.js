//Stores information regarding the user received from the database
const initialState = {
    userName: "",
    email: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'USER_INFORMATION':
            return{
                ...state,
                userName: action.payload.username,
                email: action.payload.email
            };
        default:
            return state
    }
}