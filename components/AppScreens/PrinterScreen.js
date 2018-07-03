import React, {Component} from 'react';

import { connect } from 'react-redux';

import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles';

class PrinterScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => {
            return null;
        },
        drawerIcon: ({tintColor}) => (
            <Icon name="print" type="font-awesome" size={25}/>
        )
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Printer Screen</Text>
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

export {PrinterScreen};
export default connect(mapStateToProps)(PrinterScreen);
