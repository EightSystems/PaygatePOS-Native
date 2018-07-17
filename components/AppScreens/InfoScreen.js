import React, {Component} from 'react';

import { connect } from 'react-redux';

import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

class InfoScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => {
            return null;
        },
        drawerIcon: ({tintColor}) => (
            <Icon name="info-circle" type="font-awesome" size={25}/>
        ),
        screenProps: {
            title: 'Dashboard'
        }
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

export {InfoScreen};
export default connect(mapStateToProps)(InfoScreen);
