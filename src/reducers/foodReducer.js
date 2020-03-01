//Stores information regarding Food items received from the database
const initialState = {
    foods: [],
    last: false,
    isEmpty: false,
    searchedFood: null,
    deleteMessage: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'GET_FOODS':
            return {
                ...state,
                foods: action.payload.foodArray,
                last: action.payload.last,
                empty: action.payload.foodArray.length === 0,
            };
        case 'SEARCH_CLEANUP':
            return {
                ...state,
                foods: [],
                last: false,
                isEmpty: false,
                searchedFood: null,
            };
        case 'SEARCHED_FOOD_TO_STATE':
            return {
                ...state,
                searchedFood: action.payload,
            };
        case 'SEARCHED_FOOD_CLEANUP':
            return {
                ...state,
                searchedFood: null
            };
        case 'DELETE':
            return {
                ...state,
                searchedFood: null,
                deleteMessage: action.payload,
            };
        default:
            return state
    }
}