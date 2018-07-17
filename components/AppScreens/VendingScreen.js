import React, {Component, PureComponent} from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import getStyle from './styles';

class VendingIcon extends PureComponent {
    constructor(props) {
        super(props);

        this.style = getStyle(props.isTablet);
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.isTablet !== this.props.isTablet ) {
            this.style = getStyle(nextProps.isTablet);
        }
    }

    render() {
        return (
            <TouchableOpacity style={this.props.isOpen ? [this.style.vendingIconItem, this.style.vendingIconItemActive] : (
                    this.props.isPendingCommand ? [this.style.vendingIconItem, this.style.vendingIconItemCommandSent] : this.style.vendingIconItem
                )
            } {...this.props}>
                <Text style={this.props.isOpen ? [this.style.vendingIconFont, this.style.vendingIconFontActive] : this.style.vendingIconFont}>{this.props.title}</Text>
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
            <Icon name="home" type="feather" size={25} color={'white'}/>
        ),
        title: 'Vending'
    };

    constructor(props) {
        super(props);

        this.state = {
            columnNumber: props.isTablet ? Math.floor((props.width - 70) / 130) : Math.floor(props.width / 130),
            listWidth: props.isTablet ? props.width - 70 : props.width
        }

        this.tableList = Array.apply(null, Array(10)).map((x, i) => i+1);
    }

    componentDidUpdate(prevProps) {
        if ( prevProps.width !== this.props.width || prevProps.isTablet !== this.props.isTablet ) {
            this.setState({
                columnNumber: this.props.isTablet ? Math.floor((this.props.width - 70) / 130) : Math.floor(this.props.width / 130),
                listWidth: this.props.isTablet ? this.props.width - 70 : this.props.width
            });
        }
    }

    vendingIconPress = () => {

    }

    render() {
        return (
            <View style={{width: this.state.listWidth, height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#242424' }}>
                <FlatList horizontal={false}
                    style={{width: this.state.listWidth, height: '100%'}}
                    contentContainerStyle={{alignItems: 'center'}}
                    data={this.tableList}
                    keyExtractor={(item, index) =>  `${this.state.columnNumber}-table-${item}`}
                    key={this.state.columnNumber}
                    numColumns={this.state.columnNumber}
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
        user: state.userReducer.user,
        width: state.windowReducer.window.width,
        isTablet: state.windowReducer.isTablet
    }
}

export {VendingScreen};
export default connect(mapStateToProps)(VendingScreen);
