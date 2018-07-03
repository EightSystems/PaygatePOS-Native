import * as types from '../consts'

export default function userLoginReducer(state = {}, action) {
    switch (action.type) {
        case types.USER_LOGGED:
            return {
                ...state,
                user_login_loading: false,
                user_login_failed: false
            }
        break;
        case types.USER_LOGGED_FAILED:
            return {
                ...state,
                user_login_loading: false,
                user_login_failed: true
            }
        break;
        case types.USER_LOGGED_LOADING:
            return {
                ...state,
                user_login_loading: true
            }
        break;
        default:
            return state
    }
}
