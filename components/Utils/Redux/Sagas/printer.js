import { call, put, take, takeLatest, select } from 'redux-saga/effects'
import * as types from '../consts'

function * printerAddAction(action) {
    yield put({type: 'PRINTER_ADD_LOADING'})
    yield put({type: 'PRINTER_ADD', printerData: action.printerData})
}

function * printerDeleteAction(action) {
    yield put({type: 'PRINTER_REMOVE_LOADING'})
    yield put({type: 'PRINTER_REMOVE', printerIndex: action.printerIndex})
}

function * printerWizard(enterWizard) {
    yield put({type: 'PRINTER_WIZARD', enterWizard})
}

function * printerUpdateAction(action) {
    yield put({type: 'PRINTER_UPDATE', printerData: action.printerData, printerIndex: action.printerIndex})
}

function * printerSaveAction(action) {
    yield put({type: 'PRINTER_SAVE', printerData: action.printerData, printerIndex: action.printerIndex})
}

function * printerSagas () {
    yield takeLatest(types.PRINTER_ADD_ACTION, printerAddAction)
    yield takeLatest(types.PRINTER_WIZARD_ACTION, printerWizard)
    yield takeLatest(types.PRINTER_REMOVE_ACTION, printerDeleteAction)
    yield takeLatest(types.PRINTER_UPDATE_ACTION, printerUpdateAction)
    yield takeLatest(types.PRINTER_SAVE_ACTION, printerSaveAction)
}

export default printerSagas;
