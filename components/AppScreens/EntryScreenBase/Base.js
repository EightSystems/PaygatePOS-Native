import React, {Component} from 'react';
import { connect } from 'react-redux';

import { View, Text, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import {Header as ElementHeader} from 'react-native-elements';

import { createDrawerNavigator, createStackNavigator, createSwitchNavigator, DrawerActions, SafeAreaView, NavigationActions } from 'react-navigation';

import DrawerNavigatorItems from '../../GeneralUI/DrawerNavigatorItems';

import { Icon } from 'react-native-elements';

import ReportScreen from '../ReportScreen';
import VendingScreen from '../VendingScreen';
import PrinterScreen from '../PrinterScreen';
import InfoScreen from '../InfoScreen';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;

const screenList = {
    Vending: {
        screen: VendingScreen
    },
    Report: {
        screen: ReportScreen
    },
    Printer: {
        screen: PrinterScreen
    },
    Info: {
        screen: InfoScreen
    }
}
const initialScreen = 'Vending';

var wasTablet = -1;
var cacheRootStack;

const getRootStack = (isTablet, initialScreen) => {
    if ( isTablet === wasTablet ) {
        return cacheRootStack;
    }

    if ( ! isTablet ) {
        const DrawerStack = createDrawerNavigator(screenList, {
            drawerWidth: 70,
            contentComponent: (props) => {
                return (
                    <ScrollView alwaysBounceVertical={false}>
                        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                            <DrawerNavigatorItems {...props} activeBackgroundColor={'transparent'} iconContainerStyle={{
                                    marginBottom: 16,
                                    marginTop: 16
                                }}/>
                        </SafeAreaView>
                    </ScrollView>
                )
            },
            initialRouteName: initialScreen
        });

        cacheRootStack = createStackNavigator({
            Drawer: {
                screen: DrawerStack,
                navigationOptions: ({navigation}) => {
                    const {state} = navigation;

                    if (state.routes[ state.index ].key !== 'DrawerClose') {
                        return {
                            headerStyle: {backgroundColor: 'white'},
                            headerLeft: (<Icon name="bars" type="font-awesome" containerStyle={{marginLeft: 5}} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} size={30}/>),
                        }
                    }
                    else {
                        return null;
                    }
                }
            }
        }, {
            headerMode: 'screen',
            mode: Platform.OS === 'ios' ? 'modal' : 'card'
        });
    }
    else {
        cacheRootStack = createSwitchNavigator(screenList, {
            initialRouteName: initialScreen
        });
    }

    wasTablet = isTablet;
    return cacheRootStack;
}

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: initialScreen
        }
    }

    static navigatorRef = null;

    renderTablet() {
        const RootStack = getRootStack(this.props.isTablet, this.state.currentPage);

        return (
            <View style={{width: '100%', height: '100%'}}>
                <ElementHeader
                    placement="left"
                    leftComponent={
                        <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Icon name="bars" type="font-awesome" containerStyle={{marginLeft: 5}} size={30}/>
                        </View>
                    }
                    backgroundColor={'white'}
                    outerContainerStyles={{
                        height: APPBAR_HEIGHT + STATUSBAR_HEIGHT
                    }}
                />

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: 70, backgroundColor: 'white'}}>
                        <ScrollView alwaysBounceVertical={false}>
                            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                                <DrawerNavigatorItems
                                    items={
                                        Object.keys(screenList).map((screenKey) => {
                                            return {
                                                key: screenKey
                                            }
                                        })
                                    }
                                    renderIcon={(scene) => {
                                        if ( screenList[scene.route.key] !== undefined ) {
                                            if ( screenList[scene.route.key].screen.navigationOptions && screenList[scene.route.key].screen.navigationOptions.drawerIcon ) {
                                                return screenList[scene.route.key].screen.navigationOptions.drawerIcon(scene);
                                            }
                                        }

                                        return null;
                                    }}
                                    getLabel={(scene) => {
                                        if ( screenList[scene.route.key] !== undefined ) {
                                            if ( screenList[scene.route.key].screen.navigationOptions && screenList[scene.route.key].screen.navigationOptions.drawerLabel ) {
                                                return screenList[scene.route.key].screen.navigationOptions.drawerLabel(scene);
                                            }
                                        }

                                        return null;
                                    }}

                                    activeBackgroundColor={'transparent'}
                                    iconContainerStyle={{
                                        marginBottom: 16,
                                        marginTop: 16
                                    }}

                                    activeItemKey={this.state.currentPage}
                                    onItemPress={({route, focused}) => {
                                        if ( Base.navigatorRef && ! focused ) {
                                            this.setState({
                                                currentPage: route.key
                                            }, () => {
                                                Base.navigatorRef.dispatch(NavigationActions.navigate({ routeName: route.key }))
                                            })
                                        }
                                    }}
                                />
                            </SafeAreaView>
                        </ScrollView>
                    </View>
                    <RootStack
                        ref={navigatorRef => {
                            Base.navigatorRef = navigatorRef
                        }}

                        onNavigationStateChange={(prevState, currentState) => {
                            if ( prevState.index !== currentState.index ) {
                                this.setState({
                                    currentPage: currentState.routes[currentState.index].routeName
                                })
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    renderMobile() {
        const RootStack = getRootStack(this.props.isTablet, this.state.currentPage);

        return (
            <RootStack
                onNavigationStateChange={(prevState, currentState) => {
                    if ( prevState.index !== currentState.index ) {
                        this.setState({
                            currentPage: currentState.routes[currentState.index].routeName
                        })
                    }
                }}
            />
        );
    }

    render() {
        return this.props.isTablet ? this.renderTablet() : this.renderMobile();
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        isTablet:  state.windowReducer.isTablet
    }
}

export default connect(mapStateToProps)(Base);
