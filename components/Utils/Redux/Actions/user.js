import * as types from '../consts';

export function loginUserAction(userData) {
    return {
        type: types.USER_LOGGED_ACTION,
        ...userData
    };
}

export function signupUserAction(userData) {
    return {
        type: types.USER_SIGNED_ACTION,
        ...userData
    };
}
