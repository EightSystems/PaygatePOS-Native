import { call, put, take, takeLatest, select } from 'redux-saga/effects'
import * as types from '../consts'

import LoginService from '../../Services/LoginService';

function * userLoggedAction(action) {
    yield put({type: 'USER_LOGGED_LOADING'})
    const response = yield call(LoginService.loginUser, action.username, action.password);

    if ( ! response ) {
        yield put({type: 'USER_LOGGED_FAILED'});
    }
    else {
        yield put({type: 'USER_LOGGED', ...response});
    }
}


function * userSagas () {
    yield takeLatest(types.USER_LOGGED_ACTION, userLoggedAction)
}

export default userSagas;
