import * as types from '../consts'

export default function userReducer(state = {}, action) {
    switch (action.type) {
        case types.USER_LOGGED:
            return {
                ...state,
                user: action.userData,
                sessionId: action.sessionId
            }
        break;
        case types.USER_LOGOUT:
            let stateCopy = state;
            delete state['user'];
            delete state['sessionId'];

            return state;
        break;
        default:
            return state
    }
}
