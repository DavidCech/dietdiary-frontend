import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import diaryEntryReducer from './reducers/diaryEntryReducer';
import foodReducer from './reducers/foodReducer';

import {composeWithDevTools} from "redux-devtools-extension";

//Combines all the reducers from ./reducers into rootReducer which is single Object
let rootReducer = combineReducers({
        authReducer,
        diaryEntryReducer,
        foodReducer,
});

//Composes Enhancers with given arguments
const composeEnhancers = composeWithDevTools({
    trace: true,
    traceLimit: 25,
});

//Uses the enhancers and rootReducer in order to create Redux Store
export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk),
    )
);