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
                empty: action.payload.foodArray.length===0,
            };
        case 'SEARCHED_FOOD_CLEANUP':
            return {
                foods: [],
                last: false,
                isEmpty: false,
                searchedFood: null,
            };
        case 'SEARCHED_FOOD_TO_STATE':
            return{
                ...state,
                searchedFood: action.payload,
            };
        case 'DELETE':
            return{
                ...state,
                searchedFood: null,
                deleteMessage: action.payload,
            };
        default:
            return state
    }
}