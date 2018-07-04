import { fork } from 'redux-saga/effects'

import userSaga from './user';
import printerSaga from './printer';

function* rootSaga () {
    yield [
        fork(userSaga),
        fork(printerSaga)
    ];
}

export default rootSaga
