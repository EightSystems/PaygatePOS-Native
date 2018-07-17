import { call, put, take, takeLatest, select } from 'redux-saga/effects';

import * as types from '../consts';

export function dimensionsChangeAction(newDimensions) {
    return {
        type: types.DIMENSIONS_CHANGE_ACTION,
        ...newDimensions
    };
}
