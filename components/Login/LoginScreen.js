import React, {Component} from 'react';

import {View, ImageBackground, Image, Text, StyleSheet} from 'react-native';
import { Input, Button } from 'react-native-elements';

const loginScreenStyle = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    mainImage: {
        opacity: 0.2
    },
    mainImageView: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    mainLogo: {
        width: 100,
        height: 40,
        resizeMode: 'stretch'
    },
    formContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%'
    },
    loginButton: {
        marginTop: 20
    }
})

export default class LoginScreen extends Component {
    render() {
        return (
            <ImageBackground style={loginScreenStyle.mainImageView} imageStyle={loginScreenStyle.mainImage} source={require('./images/background.jpg')}>
                <View style={loginScreenStyle.mainView}>
                    <Image source={require('./images/logo.png')} style={loginScreenStyle.mainLogo}/>

                    <View style={loginScreenStyle.formContainer}>
                        <Input placeholder="Usuário" leftIcon={{ type: 'font-awesome', name: 'user' }}/>
                        <Input placeholder="Senha" leftIcon={{ type: 'font-awesome', name: 'lock' }}/>
                        <Button containerStyle={loginScreenStyle.loginButton} iconRight icon={{name: 'angle-right'}} title="Entrar no sistema"/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
