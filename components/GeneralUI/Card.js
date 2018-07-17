import React, {PureComponent} from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import {Card} from 'react-native-elements';

export default class POSCard extends PureComponent {
    render() {
        return (
            <Card
                containerStyle={
                    {
                        paddingTop: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        backgroundColor: '#fbfbfb',
                        borderColor: '#cdcdcd',
                        borderWidth: 1,
                        borderRadius: 3
                    }
                }
                style={this.props.style} title={
                (
                    <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', backgroundColor: '#eaeaea', borderBottomWidth: 1, borderBottomColor: '#CDCDCD', paddingTop: 5, paddingLeft: 5, paddingRight: 5, paddingBottom: 5}}>
                        <Icon name={this.props.icon} type="font-awesome"/>
                        <Text style={{fontWeight: 'bold', marginLeft: 5}}>{this.props.title}</Text>
                    </View>
                )
            }>
                <View style={{paddingTop: 5, paddingLeft: 5, paddingRight: 5}}>
                    {this.props.children}
                </View>
            </Card>
        )
    }
}
