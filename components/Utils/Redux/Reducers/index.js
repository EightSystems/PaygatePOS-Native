import {
    combineReducers
} from 'redux'

import { REHYDRATE } from 'redux-persist/constants'

import userReducer from './user';
import userLoginReducer from './userLogin';
import printerReducer from './printer';
import report from './report';
import windowReducer from './window';

const reduxData = (state = {}, action) => {
    switch(action.type) {
        case REHYDRATE:
            return {
                ...state,
                rehydrated: true
            }
        break;
        default:
            return state;
        break;
    }
}

export default combineReducers({
    userReducer,
    userLoginReducer,
    printerReducer,
    report,
    windowReducer,
    reduxData
});
