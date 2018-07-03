import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Text, Image} from 'react-native'

import LoginScreen from './Login/LoginScreen';
import EntryScreen from './AppScreens/EntryScreen';

class MainSplash extends Component {
    render() {
        return <Image style={{width: '100%', height: '100%'}} source={require('../resources/splash.png')}/>
    }
}

class MainApp extends Component {
    render() {
        return this.props.appLoaded ? (
            this.props.user ? (<EntryScreen/>) : (<LoginScreen/>)
        ) : <MainSplash/>;
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        appLoaded: state.reduxData.rehydrated
    }
}

export default connect(mapStateToProps)(MainApp)
