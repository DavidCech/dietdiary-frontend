//Stores information regarding diaryEntries received from the database
const initialState = {
    createEntryFoods: [],
    searchedDiaryEntries: null,
    deleteMessage: "",
};

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SEARCHED_DIARYENTRY_TO_STATE':
            return{
                ...state,
                searchedDiaryEntries: action.payload,
            };
        case 'SEARCHED_DIARYENTRY_CLEANUP':
            return{
                createEntryFoods: [],
                searchedDiaryEntries: null,
            };
        case 'DELETE':
            return{
                ...state,
                searchedDiaryEntries: null,
                deleteMessage: action.payload,
            };
        default:
            return state
    }
}