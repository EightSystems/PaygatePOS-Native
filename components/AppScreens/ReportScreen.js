import React, {Component} from 'react';

import { connect } from 'react-redux';

import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';

import styles from './styles';

class ReportScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => {
            return null;
        },
        drawerIcon: ({tintColor}) => (
            <Icon name="list-alt" type="font-awesome" size={25}/>
        )
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Report Screen</Text>
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

export {ReportScreen};
export default connect(mapStateToProps)(ReportScreen);
