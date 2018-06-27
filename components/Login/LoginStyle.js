import {PixelRatio, StyleSheet, Platform} from 'react-native';

const fontRatio = PixelRatio.getFontScale();
const pixelDensity = PixelRatio.get();

export default StyleSheet.create(
    {
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
            paddingTop: 20,
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingLeft: 10,
            paddingRight: 10
        },
        mainImage: {

        },
        mainViewButtons: {
            marginBottom: 40,
            paddingLeft: 40,
            paddingRight: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        },
        mainImageView: {
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%'
        },
        mainLogo: {
            width: 250 * pixelDensity,
            height: 100 * pixelDensity,
            resizeMode: 'stretch',
            marginBottom: 30,
            ...Platform.select({
                ios: {
                    width: 250,
                    height: 100
                }
            })
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
            marginRight: 5,
            maxWidth: 600,
            ...Platform.select({
                web: {
                    width: "100%"
                }
            })
        },
        loginButtonContainer: {
            marginTop: 20,
            maxWidth: 400,
            width: '100%'
        },
        loginButton: {
            backgroundColor: 'white',
            borderRadius: 20,
            height: 60 * pixelDensity,
            ...Platform.select({
                ios: {
                    height: 60
                }
            })
        },
        signupButton: {
            borderRadius: 20,
            height: 60 * pixelDensity,
            ...Platform.select({
                ios: {
                    height: 60
                }
            })
        },
        loginButtonTitle: {
            fontFamily: 'Lato-Regular',
            color: 'black',
            fontSize: 20 * fontRatio,
            ...Platform.select({
                ios: {
                    fontSize: 20
                }
            })
        },
        signupButtonTitle: {
            color: 'white'
        },
        labelInput: {
            fontFamily: 'Lato-Regular',
            fontSize: 15 * fontRatio,
            color: 'black',
            ...Platform.select({
                ios: {
                    fontSize: 20
                }
            })
        },
        textHeadline: {
            fontFamily: 'Lato-Bold',
            fontSize: 25 * fontRatio,
            color: 'white',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
            textAlign: 'center',
            ...Platform.select({
                ios: {
                    fontSize: 25
                }
            })
        },
        loginFormButton: {
            width: '100%'
        }
    }
)
