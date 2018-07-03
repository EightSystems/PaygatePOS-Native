import React, {Component} from 'react';
import { connect } from 'react-redux'

import {View, ScrollView, ImageBackground, Image, Text, Platform, Dimensions, PixelRatio, ActivityIndicator} from 'react-native';
import Modal from '../Utils/ExtComponents/Modal';

import { Input, Icon } from 'react-native-elements';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FlipCard from 'react-native-flip-card';

import Button from '../GeneralUI/Button';
import loginScreenStyle from './LoginStyle';
import {loginSliderItems} from './';

import {strings} from '../Utils/Locale';

import {loginUserAction, signupUserAction} from '../Utils/Redux/Actions/user';

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.inputRefs = {}
        this.state = {
            company: '',
            username: '',
            password: '',
            rpassword: ''
        }
    }

    moveToNextInput = (id) => {
        if ( id == "submit" ) {
            if ( this.state.username.length > 0 && this.state.password.length > 0 ) {
                if ( this.props.signup ) {
                    if ( this.state.password == this.state.rpassword ) {
                        this.props.dispatch(signupUserAction(this.state));
                    }
                    else {
                        alert("As senhas não coincidem");
                    }
                }
                else {
                    this.props.dispatch(loginUserAction(this.state));
                }
            }
            else {
                alert("Você precisa preencher o usuário e senha");
            }
        }
        else {
            if ( this.inputRefs[id] ) {
                this.inputRefs[id].focus();
            }
        }
    }

    render() {
        return (
            <View style={loginScreenStyle.mainViewLogin}>
                {this.props.loginLoading || this.props.signupLoading ? (
                    <Modal visible={true} transparent={true}>
                        <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                            <ActivityIndicator size={Platform.OS == 'ios' ? 'large' : 100} color="#0000ff" />
                        </View>
                    </Modal>
                ) : null}

                <Icon name="times" type="font-awesome" containerStyle={{
                        position: 'absolute',
                        left: 10,
                        top: 25
                    }} onPress={this.props.closePressed} size={40}/>

                <Image source={require('./images/logo.png')} style={loginScreenStyle.mainLogo}/>
                <View style={{width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                    <View style={loginScreenStyle.formContainer}>
                        {this.props.loginFailed ? (
                            <Text>Oops, algo deu errado...</Text>
                        ) : null}

                        {this.props.signup ? (
                            <Input ref={ref => this.inputRefs['company'] = ref}
                                inputContainerStyle={{width: '100%'}} placeholder={strings('login.company_label')}
                                rightIcon={{ type: 'font-awesome', name: 'building-o', color: 'gray' }}
                                inputStyle={loginScreenStyle.labelInput} placeholderTextColor={'#525e72'}
                                returnKeyType={ "next" } blurOnSubmit={ false }
                                onSubmitEditing={() => this.moveToNextInput('username')}
                                autoFocus={true}
                                autoCapitalize={'none'}
                                onChangeText={(currentText) => {
                                    this.setState({
                                        company: currentText
                                    })
                                }}
                            />
                        ) : null}

                        <Input ref={ref => this.inputRefs['username'] = ref}
                            inputContainerStyle={{width: '100%'}} placeholder={strings('login.email_label')}
                            rightIcon={{ type: 'font-awesome', name: 'user-o', color: 'gray' }}
                            inputStyle={loginScreenStyle.labelInput} placeholderTextColor={'#525e72'}
                            returnKeyType={ "next" } blurOnSubmit={ false }
                            onSubmitEditing={() => this.moveToNextInput('password')}
                            keyboardType={"email-address"} autoFocus={this.props.signup ? false : true}
                            autoCapitalize={'none'}
                            onChangeText={(currentText) => {
                                this.setState({
                                    username: currentText
                                })
                            }}
                        />

                        <Input ref={ref => this.inputRefs['password'] = ref}
                            inputContainerStyle={{width: '100%'}} placeholder={strings('login.password_label')}
                            rightIcon={{ type: 'font-awesome', name: 'eye', color: 'gray' }}
                            inputStyle={loginScreenStyle.labelInput} secureTextEntry={true}
                            placeholderTextColor={'#525e72'} returnKeyType={ this.props.signup ? "next" : "done" }
                            blurOnSubmit={ this.props.signup ? false : true }
                            onSubmitEditing={() => this.moveToNextInput(this.props.signup ? 'rpassword' : 'submit')}
                            autoCapitalize={'none'}
                            onChangeText={(currentText) => {
                                this.setState({
                                    password: currentText
                                })
                            }}
                        />

                        {this.props.signup ? (
                            <Input ref={ref => this.inputRefs['rpassword'] = ref}
                                inputContainerStyle={{width: '100%'}} placeholder={strings('login.rpassword_label')}
                                rightIcon={{ type: 'font-awesome', name: 'eye', color: 'gray' }}
                                inputStyle={loginScreenStyle.labelInput} secureTextEntry={true}
                                placeholderTextColor={'#525e72'} returnKeyType={ "done" }
                                blurOnSubmit={ true }
                                onSubmitEditing={() => this.moveToNextInput('submit')}
                                autoCapitalize={'none'}
                                onChangeText={(currentText) => {
                                    this.setState({
                                        rpassword: currentText
                                    })
                                }}
                            />
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
                                this.props.signup ? strings('login.signup_button') : strings('login.login_button')
                            }
                            onPress={() => this.moveToNextInput('submit')}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        loginLoading: state.userLoginReducer.user_login_loading,
        loginFailed: state.userLoginReducer.user_login_failed,
        signupLoading: state.userLoginReducer.user_signup_loading
    }
}

const LoginFormMapped = connect(mapStateToProps)(LoginForm)

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flip: false,
            signup: false,
            activeSlide: 0,
            carouselRef: null
        }
    }

    render() {
        var {width, height} = Dimensions.get('window');
        return (
            <ImageBackground style={loginScreenStyle.mainImageView} imageStyle={loginScreenStyle.mainImage} source={require('./images/background.jpg')} blurRadius={2}>
                <FlipCard
                        flipHorizontal={true} perspective={1000} friction={1000}
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
                                data={loginSliderItems}
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
                                dotsLength={loginSliderItems.length}
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
                                title={strings('login.signup_free_button')}
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
                                title={strings('login.login_button')}
                            />
                        </View>
                    </View>

                    <LoginFormMapped signup={this.state.signup} closePressed={() => {
                            this.setState({
                                flip: false
                            })
                        }}/>
                </FlipCard>
            </ImageBackground>
        )
    }
}

export default connect(mapStateToProps)(LoginScreen)
