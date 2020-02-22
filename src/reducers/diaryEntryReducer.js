//Stores information regarding diaryEntries received from the database
const initialState = {
    createEntryFoods: [],
    searchedDiaryEntries: null,
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
        default:
            return state
    }
}