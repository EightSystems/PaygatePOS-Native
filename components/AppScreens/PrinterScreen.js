import React, {Component} from 'react';
import { connect } from 'react-redux';

import { Text, View, FlatList, Dimensions, Alert, Platform } from 'react-native'
import { Icon, ListItem } from 'react-native-elements';
import { isTablet } from 'react-native-device-detection';

import {printerWizard, deletePrinterAction, editPrinterAction} from '../Utils/Redux/Actions/printer';

import PrinterAddWizard, {ProfileGoBack, PrinterAddWizardSelectType} from './PrinterScreenComponents/PrinterAddWizard';

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

    constructor(props) {
        super(props);

        const {width, height} = Dimensions.get('window');
        this.listWidth = isTablet ? width - 70 : width;
    }

    renderWizard = () => {
        return <PrinterAddWizard />;
    }

    renderPrinterList = () => {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ProfileGoBack navigation={this.props.navigation} screenName={'Vending'}
                    rightButton={'Adicionar Impressora'}
                    rightIcon={
                        {
                            name: 'plus',
                            type: 'font-awesome',
                            size: 18,
                            color: '#3D6889'
                        }
                    }
                    rightPressed={() => {
                        const printerConnectionType = this.props.navigation.getParam('type');

                        this.props.dispatch(
                            printerWizard(true)
                        );
                    }}
                />
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.addPrinterWizardHeaderText, {width: 450}]}>Aqui esta sua lista de dispositivos</Text>
                    <FlatList
                        style={{width: 300, height: 300, marginTop: 30}}
                        keyExtractor={(item, index) => item.type}
                        data={
                            this.props.printerList
                        }
                        renderItem={({item, index}) => {
                            return (
                                <ListItem
                                    title={item.name}
                                    rightIcon={PrinterAddWizardSelectType.getPrinterIcon(item.connectionType)}
                                    onPress={() => {
                                        Alert.alert('O que deseja fazer?', 'Prefere editar, ou apagar esse dispositivo?', [
                                            {
                                                text: 'Apagar',
                                                onPress: () => {
                                                    Alert.alert('Apagar dispositivo', 'Absoluta certeza que deseja apagar?', [
                                                        {
                                                            text: 'Sim!',
                                                            onPress: () => {
                                                                this.props.dispatch(deletePrinterAction(index))
                                                            }
                                                        },
                                                        {
                                                            text: 'Não!'
                                                        }
                                                    ], Platform.OS == "web" ? 'none' : {
                                                        cancelable: true
                                                    });
                                                }
                                            },
                                            {
                                                text: 'Editar',
                                                onPress: () => {
                                                    this.props.dispatch(editPrinterAction(item, index))
                                                }
                                            },
                                            {
                                                text: 'Nada'
                                            }
                                        ], Platform.OS == "web" ? 'none' : {
                                            cancelable: true
                                        });
                                    }}
                                />
                            );
                        }}
                    />
                </View>
            </View>
        );
    }

    componentWillMount = () => {
        if ( ! this.props.printerList || this.props.printerList.length == 0 ) {
            this.props.dispatch(printerWizard(true));
        }
    }

    render() {
        return (
            <View style={{ width: this.listWidth, height: '100%' }}>
                {
                    ! this.props.printerWizard ?
                        this.renderPrinterList() : this.renderWizard()
                }
            </View>
        )
    }
}

mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        printerList: state.printerReducer.list,
        printerWizard: state.printerReducer.wizard
    }
}

export {PrinterScreen};
export default connect(mapStateToProps)(PrinterScreen);
