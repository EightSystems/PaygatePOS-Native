/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import reduxStore from './components/Utils/Redux';

import MainApp from './components/MainApp';

type Props = {};
export default class App extends Component<Props> {
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return (
            <Provider store={reduxStore}>
                <MainApp/>
            </Provider>
        );
    }
}
