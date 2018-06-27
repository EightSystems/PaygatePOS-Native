/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen'

import LoginScreen from './components/Login/LoginScreen';

type Props = {};
export default class App extends Component<Props> {
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return (
            <LoginScreen/>
        );
    }
}
