import React, {Component, PureComponent} from 'react';

import { connect } from 'react-redux';

import { View, Text, Image, StyleSheet, FlatList, Dimensions, Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

import { isTablet } from 'react-native-device-detection';

import { Icon } from 'react-native-elements';

import styles from './styles';

class VendingIcon extends PureComponent {
    render() {
        return (
            <TouchableOpacity style={this.props.isOpen ? [styles.vendingIconItem, styles.vendingIconItemActive] : (
                    this.props.isPendingCommand ? [styles.vendingIconItem, styles.vendingIconItemCommandSent] : styles.vendingIconItem
                )
            } {...this.props}>
                <Text style={this.props.isOpen ? [styles.vendingIconFont, styles.vendingIconFontActive] : styles.vendingIconFont}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

class VendingScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => {
            return null;
        },
        drawerIcon: ({tintColor}) => (
            <Icon name="home" type="feather" size={25}/>
        ),
        title: 'Vending'
    };

    constructor(props) {
        super(props);

        const {width, height} = Dimensions.get('window');
        this.columnNumber = isTablet ? Math.floor((width - 70) / 130) : Math.floor(width / 130);
        this.listWidth = isTablet ? width - 70 : width;

        this.tableList = Array.apply(null, Array(10)).map((x, i) => i+1);
    }

    vendingIconPress = () => {

    }

    render() {
        return (
            <View style={{width: this.listWidth, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#242424' }}>
                <FlatList horizontal={false}
                    style={{width: this.listWidth, height: '100%'}}
                    contentContainerStyle={{alignItems: 'center'}}
                    data={this.tableList}
                    keyExtractor={(item, index) =>  `table-${item}`}
                    numColumns={this.columnNumber}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                        let isPendingCommand = Math.random() > 0.7 ? true : false;
                        let isOpen = Math.random() > 0.7 ? true : false;

                        return (
                            <VendingIcon isOpen={isOpen} isPendingCommand={isPendingCommand} title={`Comanda ${item}`} onPress={this.vendingIconPress}/>
                        )
                    }}
                />
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user
    }
}

export {VendingScreen};
export default connect(mapStateToProps)(VendingScreen);
