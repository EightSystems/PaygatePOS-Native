import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import myReducers from './Reducers'
import mySagas from './Sagas'

const sagaMiddleware = createSagaMiddleware()

const middlewareList = [
    /* other middleware here */
    sagaMiddleware
];

const {
    middleware: offlineMiddleware,
    enhanceReducer,
    enhanceStore
} = createOffline({
    ...offlineConfig,
    persistOptions: {
        blacklist: ['userLoginReducer', 'windowReducer']
    }
});

const middleware = applyMiddleware(...middlewareList, offlineMiddleware);

// mount it on the Store
const store = createStore(enhanceReducer(myReducers), compose(enhanceStore, middleware));

// then run the saga
sagaMiddleware.run(mySagas)

export default store;
