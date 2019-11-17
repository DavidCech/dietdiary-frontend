const initialState = {
    foods: [],
    last: false,
    loggedIn: false,
    empty: false,
    userName: "",
    email: "",
    createDEResponse: "",
    searchedFood: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'GET_FOODS':
            return {
                ...state,
                foods: action.payload.foodArray,
                last: action.payload.last,
                empty: action.payload.foodArray.length===0,
            };
        case 'LOG_IN':
            return{
                ...state,
                loggedIn: action.payload
            };
        case 'USER_INFORMATION':
            return{
                ...state,
                userName: action.payload.username,
                email: action.payload.email
            };
        case 'SEARCHED_FOOD_TO_STATE':
            return{
                ...state,
                searchedFood: action.payload,
            };
        default:
            return state
    }
}