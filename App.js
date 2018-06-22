/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import LoginScreen from './components/Login/LoginScreen';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <LoginScreen/>
    );
  }
}
