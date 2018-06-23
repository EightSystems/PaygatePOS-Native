import React, {Component} from 'react';
import {Platform, TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import {Button} from 'react-native-elements';

export default class extends Component {
    render() {
        return (
            <Button
                TouchableComponent={Platform.OS === "web" ? TouchableOpacity : Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback}
                {...this.props}
            />
        )
    }
}
