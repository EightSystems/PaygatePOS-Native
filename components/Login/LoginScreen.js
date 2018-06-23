import React, {Component} from 'react';

import {View, ImageBackground, Image, Text, StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback, Dimensions} from 'react-native';
import { Input, Icon } from 'react-native-elements';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import FlipCard from 'react-native-flip-card';

import Button from '../GeneralUI/Button';

const loginScreenStyle = StyleSheet.create({
    flipCardContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        borderWidth: 0
    },
    mainView: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%'
    },
    mainViewLogin: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    mainImage: {

    },
    mainViewButtons: {
        marginBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
        width: '100%',
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
        resizeMode: 'stretch',
        marginBottom: 30
    },
    formContainer: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 4,
        marginTop: 40,
        paddingTop:  20,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 20,
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 5
    },
    loginButtonContainer: {
        marginTop: 20,
        width: '100%'
    },
    loginButton: {
        backgroundColor: 'white',
        borderRadius: 20
    },
    signupButton: {
        borderRadius: 20
    },
    loginButtonTitle: {
        fontFamily: 'Lato-Regular',
        color: 'black',
        fontSize: 10
    },
    signupButtonTitle: {
        color: 'white'
    },
    labelInput: {
        fontFamily: 'Lato-Regular',
        fontSize: 15,
        color: 'black'
    },
    textHeadline: {
        fontFamily: 'Lato-Bold',
        fontSize: 15,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textAlign: 'center'
    },
    loginFormButton: {
        width: '100%'
    }
})

class LoginForm extends Component {
    render() {
        return (
            <View style={loginScreenStyle.mainViewLogin}>
                <Icon name="times" type="font-awesome" containerStyle={{
                        position: 'absolute',
                        left: 10,
                        top: 25
                    }} onPress={this.props.closePressed}/>

                <Image source={require('./images/logo.png')} style={loginScreenStyle.mainLogo}/>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={loginScreenStyle.formContainer}>

                        {this.props.signup ? (
                            <Input inputContainerStyle={{width: '100%'}} placeholder="sua empresa..." rightIcon={{ type: 'font-awesome', name: 'building-o', color: 'gray' }} inputStyle={loginScreenStyle.labelInput} placeholderTextColor={'#525e72'}/>
                        ) : null}

                        <Input inputContainerStyle={{width: '100%'}} placeholder="e-mail..." rightIcon={{ type: 'font-awesome', name: 'user-o', color: 'gray' }} inputStyle={loginScreenStyle.labelInput} placeholderTextColor={'#525e72'}/>
                        <Input inputContainerStyle={{width: '100%'}} placeholder="senha..." rightIcon={{ type: 'font-awesome', name: 'eye', color: 'gray' }} inputStyle={loginScreenStyle.labelInput} secureTextEntry={true} placeholderTextColor={'#525e72'}/>

                        {this.props.signup ? (
                            <Input inputContainerStyle={{width: '100%'}} placeholder="confirmar senha..." rightIcon={{ type: 'font-awesome', name: 'eye', color: 'gray' }} inputStyle={loginScreenStyle.labelInput} secureTextEntry={true} placeholderTextColor={'#525e72'}/>
                        ) : null}

                        <Button
                            containerStyle={loginScreenStyle.loginButtonContainer}
                            buttonStyle={
                                [loginScreenStyle.signupButton, loginScreenStyle.loginFormButton]
                            }
                            titleStyle={
                                [loginScreenStyle.loginButtonTitle, loginScreenStyle.signupButtonTitle, loginScreenStyle.loginFormButton]
                            }
                            title={
                                this.props.signup ? "INCREVA-SE" : "ENTRAR"
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flip: false,
            signup: false,
            activeSlide: 0,
            carouselRef: null
        }

        this.loginSliderItems = [
            "Sistema de gestão e caixa para você, e sua empresa",
            "Controle para micro, e pequenas empresas. Lojas, Restaurantes, Bares, Hoteis, Pousadas",
            "Nas nuvens, mas com pouso local",
            "Módulos que encaixam com você!",
            "Sistema adaptável",
            "Suporte ouro!",
            "Registre-se agora, e receba uma semana gratuita!"
        ];
    }

    render() {
        var {width, height} = Dimensions.get('window');
        return (
            <ImageBackground style={loginScreenStyle.mainImageView} imageStyle={loginScreenStyle.mainImage} source={require('./images/background.jpg')} blurRadius={2}>
                <FlipCard
                        flipHorizontal={true} perspective={1000} friction={6}
                        flipVertical={false} flip={this.state.flip} clickable={false}
                        style={loginScreenStyle.flipCardContainer}
                >
                    <View style={loginScreenStyle.mainView}>
                        <Image source={require('./images/logo.png')} style={loginScreenStyle.mainLogo}/>
                        <View style={loginScreenStyle.mainViewButtons}>
                            <Carousel
                                ref={(ref) => {
                                    if ( ! this.state.carouselRef ) {
                                        this.setState({
                                            carouselRef: ref
                                        })
                                    }
                                }}
                                sliderWidth={width-60} itemWidth={width-60} vertical={false} loop={false} autoplay={true}
                                containerCustomStyle={Platform.OS == "web" ? {overflowX: 'hidden', marginBottom: 40} : {marginBottom: 40}}
                                data={this.loginSliderItems}
                                renderItem={(item, index) => {
                                    return (
                                        <View>
                                            <Text style={loginScreenStyle.textHeadline}>{item.item}</Text>
                                        </View>
                                    )
                                }}
                                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                            />

                            <Pagination
                                dotsLength={this.loginSliderItems.length}
                                activeDotIndex={this.state.activeSlide}
                                containerStyle={{ backgroundColor: 'transparent'}}
                                tappableDots={this.state.carouselRef ? true : false}
                                carouselRef={this.state.carouselRef}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 8,
                                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                                }}
                                inactiveDotStyle={{
                                    // Define styles for inactive dots here
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />

                            <Button
                                containerStyle={loginScreenStyle.loginButtonContainer}
                                buttonStyle={loginScreenStyle.signupButton}
                                titleStyle={[loginScreenStyle.loginButtonTitle, loginScreenStyle.signupButtonTitle]}
                                title="INSCREVA-SE GRÁTIS"
                                onPress={() => {
                                    this.setState({
                                        flip: true,
                                        signup: true
                                    })
                                }}
                            />

                            <Button
                                containerStyle={loginScreenStyle.loginButtonContainer}
                                buttonStyle={loginScreenStyle.loginButton}
                                titleStyle={loginScreenStyle.loginButtonTitle}
                                onPress={() => {
                                    this.setState({
                                        flip: true,
                                        signup: false
                                    })
                                }}
                                title="ENTRAR"
                            />
                        </View>
                    </View>

                    <LoginForm signup={this.state.signup} closePressed={() => {
                            this.setState({
                                flip: false
                            })
                        }}/>
                </FlipCard>
            </ImageBackground>
        )
    }
}
