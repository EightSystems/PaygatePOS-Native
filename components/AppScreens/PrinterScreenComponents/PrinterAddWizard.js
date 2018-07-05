import React, {Component} from 'react';

import { View, Text, FlatList, ActivityIndicator, ScrollView, Platform, Alert } from 'react-native';
import { Icon, ListItem, Input, CheckBox } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import {createSwitchNavigator} from 'react-navigation';

import Button from '../../GeneralUI/Button';

import styles from '../styles';
import { isTablet } from 'react-native-device-detection';

import Printing from '../../Utils/Printing';

import { connect } from 'react-redux';
import {savePrinterAction, printerWizard, updatePrinterAction} from '../../Utils/Redux/Actions/printer';

mapStateToProps = (state) => {
    return {
        printerList: state.printerReducer.list,
        printerLoading: state.printerReducer.loading,
        printerAdded: state.printerReducer.added,
        printerEditingData: state.printerReducer.editData,
        printerEditingIndex: state.printerReducer.editIndex
    }
}

class ProfileGoBack extends Component {
    render() {
        return (
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{height: 70, marginTop: 10, marginLeft: 20, alignSelf: 'flex-start'}}>
                    <Button
                        clear
                        icon={{
                            name: 'arrow-left',
                            type: 'font-awesome',
                            size: 18,
                            color: '#3D6889'
                        }}
                        title={
                            "Voltar"
                        }
                        titleStyle={styles.addPrinterWizardButtonTitle}
                        onPress={() => {
                            if ( this.props.leftPressed ) {
                                this.props.leftPressed();
                            }
                            else {
                                this.props.navigation.navigate(this.props.screenName)
                            }
                        }}
                    />
                </View>
                {this.props.rightButton ? (
                    <View style={{height: 70, marginTop: 10, marginRight: 20, position: 'absolute', right: 0}}>
                        <Button
                            clear
                            icon={this.props.rightIcon}
                            title={
                                this.props.rightButton
                            }
                            titleStyle={styles.addPrinterWizardButtonTitle}
                            onPress={this.props.rightPressed}
                        />
                    </View>
                ) : null}
            </View>
        )
    }
}

export { ProfileGoBack };

class PrinterAddWizardStartBase extends Component {
    componentWillMount() {
        if ( this.props.printerEditingIndex !== null && this.props.printerEditingIndex !== undefined ) {
            this.props.navigation.navigate('AddPrinterInformation', {
                type: this.props.printerEditingData.connectionType,
                id: this.props.printerEditingData.id,
                name: this.props.printerEditingData.name
            });
        }
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ProfileGoBack leftPressed={() => {
                    this.props.dispatch(printerWizard(false));
                }}/>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.addPrinterWizardHeaderText}>Bem-vindo ao assistente de configuração para impressoras</Text>
                    <Icon name="printer" type="feather" size={250} iconStyle={styles.addPrinterWizardIcon}/>
                    <Button
                        containerStyle={styles.addPrinterWizardButton}
                        buttonStyle={styles.addPrinterWizardButtonInternal}
                        iconRight
                        icon={{
                            name: 'arrow-right',
                            type: 'font-awesome',
                            size: 18,
                            color: '#3D6889'
                        }}
                        title={
                            "Vamos lá!"
                        }
                        titleStyle={styles.addPrinterWizardButtonTitle}
                        onPress={() => this.props.navigation.navigate('SelectType')}
                    />
                </View>
            </View>
        )
    }
}

const PrinterAddWizardStart = connect(mapStateToProps)(PrinterAddWizardStartBase);

class PrinterAddWizardSelectType extends Component {
    constructor (props) {
        super(props)

        this.state = {
            supportedTypes: Printing.getSupportedTypes()
        }
    }

    static getPrinterIcon (deviceType) {
        if ( deviceType == "usb" ) {
            return {
                name: 'usb',
                type: 'font-awesome',
                color: '#3D6889'
            }
        }
        else if ( deviceType == "bluetooth" ) {
            return {
                name: 'bluetooth',
                type: 'font-awesome',
                color: '#3D6889'
            }
        }
        else if ( deviceType == "network" ) {
            return {
                name: 'globe',
                type: 'font-awesome',
                color: '#3D6889'
            }
        }
        else if ( deviceType == "serial" ) {
            return {
                name: 'cpu',
                type: 'feather',
                color: '#3D6889'
            }
        }
        else if ( deviceType == "local" ) {
            return {
                name: (
                    Platform.OS == "android" ? "android" :
                        (Platform.OS == "ios" ? "apple" : 'windows')
                ),
                type: 'font-awesome',
                color: '#3D6889'
            }
        }
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ProfileGoBack navigation={this.props.navigation} screenName={'Start'} />
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>Primeiro vamos selecionar qual o meio de comunicação com sua impressora</Text>
                    <FlatList
                        style={{width: 300, height: 300, marginTop: 30}}
                        keyExtractor={(item, index) => item.type}
                        data={
                            Object.keys(this.state.supportedTypes).map((item) => {
                                return {
                                    type: item,
                                    label: this.state.supportedTypes[item]
                                }
                            })
                        }
                        renderItem={({item}) => {
                            return (
                                <ListItem
                                    title={item.label}
                                    rightIcon={PrinterAddWizardSelectType.getPrinterIcon(item.type)}
                                    onPress={() => {
                                        this.props.navigation.navigate('AddPrinter', {
                                            type: item.type
                                        })
                                    }}
                                />
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}

export { PrinterAddWizardSelectType }

class PrinterAddWizardSearchPrintersBase extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLoading: true,
            isEnabled: false,
            printerList: [],
            installedPrinterList: [],
            hasSearchError: false,
            printerType: null
        }

        this.printerImplentation = null;
    }

    componentDidMount() {
        const printerType = this.props.navigation.getParam('type');

        this.setState({
            printerType: printerType,
            isLoading: true,
            isEnabled: false,
            printerList: [],
            hasSearchError: false,
            installedPrinterList: this.props.printerList ? this.props.printerList.filter((printerItem) => {
                return printerItem.connectionType == printerType;
            }).map((printerItem) => printerItem.id) : []
        }, () => {
            this.searchDevices();
        })
    }

    componentDidUpdate(prevProps) {
        const printerType = this.props.navigation.getParam('type');

        if ( printerType !== this.state.printerType ) {
            this.setState({
                printerType: printerType,
                isLoading: true,
                isEnabled: false,
                printerList: [],
                hasSearchError: false,
                installedPrinterList: this.props.printerList ? this.props.printerList.filter((printerItem) => {
                    return printerItem.connectionType == printerType;
                }).map((printerItem) => printerItem.id) : []
            }, () => {
                this.searchDevices();
            })
        }
        else if ( prevProps.printerList !== this.props.printerList ) {
            this.setState({
                installedPrinterList: this.props.printerList ? this.props.printerList.filter((printerItem) => {
                    return printerItem.connectionType == printerType;
                }).map((printerItem) => printerItem.id) : []
            });
        }
    }

    searchDevices = () => {
        const printerType = this.props.navigation.getParam('type');

        if ( printerType ) {
            this.printerImplentation = Printing.getImplementation(printerType);

            this.printerImplentation.isEnabled().then((isEnabled) => {
                if ( ! isEnabled ) {
                    this.setState({
                        isLoading: false,
                        isEnabled: false
                    })
                }
                else {
                    this.setState({
                        isEnabled: true
                    }, () => {
                        this.printerImplentation.listDevices().then((deviceList) => {
                            this.setState({
                                isLoading: false,
                                printerList: deviceList
                            })
                        }).catch(() => {
                            this.setState({
                                isLoading: false,
                                printerList: [],
                                hasSearchError: true
                            })
                        })
                    })
                }
            }).catch(() => {
                this.setState({
                    isLoading: false,
                    isEnabled: false
                })
            });
        }
    }

    renderLoadingScreen = () => {
        return (
            <View style={{width:'100%', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>Procurando impressoras...</Text>

                <ActivityIndicator size={Platform.OS == 'ios' ? 'large' : 100} color="#3D6889" style={{marginTop: 50}} />
            </View>
        )
    }

    renderFoundPrinters = () => {
        return (
            <View style={{width:'100%', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>
                    {this.state.isEnabled ? (
                        this.state.printerList && this.state.printerList.length > 0 ?
                            "Olha só! Encontramos algumas impressoras para o seu dispositivo" :
                            "Oops... Parece que não há impressoras disponíveis para seu dispositivo"
                    ) : (
                        "Opa, parece que você desativou esse tipo de comunicação"
                    )}
                </Text>

                {this.state.isEnabled ? (
                    this.state.printerList && this.state.printerList.length > 0 ? (
                        <FlatList
                            style={{width: 400, height: 300, marginTop: 30}}
                            keyExtractor={(item, index) => item.id}
                            data={
                                this.state.printerList
                            }
                            renderItem={({item}) => {
                                return (
                                    <ListItem
                                        title={item.name}
                                        leftIcon={
                                            this.state.installedPrinterList.indexOf(item.id) == -1 ?
                                                {
                                                    name: "plus",
                                                    type: "font-awesome",
                                                    color: "#3D6889"
                                                } : {
                                                    name: "check",
                                                    type: "font-awesome",
                                                    color: "#3D6889"
                                                }
                                        }
                                        rightIcon={PrinterAddWizardSelectType.getPrinterIcon(this.state.printerType)}
                                        onPress={() => {
                                            if ( this.state.installedPrinterList.indexOf(item.id) == -1 ) {
                                                if ( item.paired ) {
                                                    this.props.navigation.navigate('AddPrinterInformation', {
                                                        type: this.state.printerType,
                                                        id: item.id,
                                                        name: item.name
                                                    })
                                                }
                                                else {
                                                    Alert.alert('Confirmar pareamento', 'Precisamos parear com esse dispositivo primeiro, confirma?', [
                                                        {
                                                            text: 'Sim!',
                                                            onPress: () => {
                                                                this.printerImplentation.connect(item).then(() => {
                                                                    this.printerImplentation.disconnect().then(() => {
                                                                        this.props.navigation.navigate('AddPrinterInformation', {
                                                                            type: this.state.printerType,
                                                                            id: item.id,
                                                                            name: item.name
                                                                        })
                                                                    })
                                                                }).catch(() => {
                                                                    Alert.alert('Oops...', 'Opa, não conseguimos parear com esse dispositivo');
                                                                });
                                                            }
                                                        },
                                                        {
                                                            text: 'Não'
                                                        }
                                                    ], {
                                                        cancelable: true
                                                    });
                                                }
                                            }
                                            else {
                                                Alert.alert('Oops...', 'Opa, esse dispositivo já está instalado, selecione outro');
                                            }
                                        }}
                                    />
                                );
                            }}
                        />
                    ) : null
                ) : null}
            </View>
        )
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ProfileGoBack navigation={this.props.navigation} screenName={'SelectType'} />

                {this.state.isLoading ? this.renderLoadingScreen() : this.renderFoundPrinters()}
            </View>
        );
    }
}

const PrinterAddWizardSearchPrinters = connect(mapStateToProps)(PrinterAddWizardSearchPrintersBase);

class PrinterAddWizardPrinterInformationBase extends Component {
    static printerLocations = [
        "Caixa",
        "Bar",
        "Cozinha",
        "Bar 1",
        "Bar 2",
        "Bar 3",
        "Cozinha 1",
        "Cozinha 2",
        "Cozinha 3",
        "Cancelar"
    ];

    static printerModels = Printing.getPrinterModels();

    constructor(props) {
        super(props);

        this.state = {
            printerId: '',
            printerName: '',
            printerType: '80mm',
            printerPlace: 0,
            printerModel: 0
        }

        this.printerModelsTransformed = Object.keys(PrinterAddWizardPrinterInformationBase.printerModels)
            .map((printerModel) => {
                return {
                    model: printerModel,
                    label: PrinterAddWizardPrinterInformationBase.printerModels[printerModel]
                }
            }).concat(
                [{
                    model: null,
                    label: 'Cancelar'
                }]
            );
    }

    componentDidMount() {
        const printerName = this.props.navigation.getParam('name');
        const printerId = this.props.navigation.getParam('id');


        if ( ! this.props.printerEditingData ) {
            this.setState({
                printerId,
                printerName,
                printerPlace: 0,
                printerType: '80mm',
                printerModel: 0
            });
        }
        else {
            this.setState({
                printerId,
                printerName,
                printerPlace: this.props.printerEditingData.place,
                printerType: this.props.printerEditingData.type,
                printerModel: this.props.printerEditingData.model
            });
        }
    }

    componentDidUpdate(prevProps) {
        const printerName = this.props.navigation.getParam('name');
        const printerId = this.props.navigation.getParam('id');

        if ( printerId !== this.state.printerId ) {
            if ( ! this.props.printerEditingData ) {
                this.setState({
                    printerId,
                    printerName,
                    printerPlace: 0,
                    printerType: '80mm',
                    printerModel: 0
                });
            }
            else {
                this.setState({
                    printerId,
                    printerName,
                    printerPlace: this.props.printerEditingData.place,
                    printerType: this.props.printerEditingData.type,
                    printerModel: this.props.printerEditingData.model
                });
            }
        }
    }

    renderAddScreen() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <ProfileGoBack navigation={this.props.navigation} screenName={'SelectType'}
                    rightButton={this.props.printerEditingData ? 'Salvar Impressora' : 'Adicionar Impressora'}
                    rightIcon={
                        {
                            name: 'arrow-right',
                            type: 'font-awesome',
                            size: 18,
                            color: '#3D6889'
                        }
                    }
                    rightPressed={() => {
                        const printerConnectionType = this.props.navigation.getParam('type');

                        if ( ! this.props.printerEditingData ) {
                            this.props.dispatch(
                                savePrinterAction({
                                    id: this.state.printerId,
                                    name: this.state.printerName,
                                    connectionType: printerConnectionType,
                                    type: this.state.printerType,
                                    model: this.state.printerModel,
                                    place: this.state.printerPlace
                                })
                            )
                        }
                        else {
                            this.props.dispatch(
                                updatePrinterAction({
                                    id: this.state.printerId,
                                    name: this.state.printerName,
                                    connectionType: printerConnectionType,
                                    type: this.state.printerType,
                                    model: this.state.printerModel,
                                    place: this.state.printerPlace
                                }, this.props.printerEditingIndex)
                            )
                        }
                    }}
                />

                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>
                        Informações da impressora
                    </Text>

                    <View style={{maxWidth: 500, alignItems: 'flex-start'}}>
                        <ScrollView>
                            <Input
                                inputContainerStyle={{width: '100%'}} placeholder={"Nome da impressora"}
                                autoFocus={true}
                                value={this.state.printerName}
                                onChangeText={(currentText) => {
                                    this.setState({
                                        printerName: currentText
                                    })
                                }}
                            />

                            <Text style={[styles.addPrinterWizardHeaderText, {fontSize: 18, width: null, marginTop: 20}]}>Tamanho da Bobina</Text>

                            <View style={{maxWidth: 500, height: 60, marginTop: 5, flexDirection: 'row'}}>
                                <CheckBox
                                    center
                                    title='58mm'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.printerType ==  '58mm'}
                                    onPress={() => {
                                        this.setState({
                                            printerType: '58mm'
                                        })
                                    }}
                                />
                                <CheckBox
                                    center
                                    title='80mm'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.printerType ==  '80mm'}
                                    onPress={() => {
                                        this.setState({
                                            printerType: '80mm'
                                        })
                                    }}
                                />
                                <CheckBox
                                    center
                                    title='Matricial'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.printerType ==  'matricial'}
                                    onPress={() => {
                                        this.setState({
                                            printerType: 'matricial'
                                        })
                                    }}
                                />
                            </View>

                            <Text style={[styles.addPrinterWizardHeaderText, {fontSize: 18, width: null, marginTop: 20}]}>Local da impressora</Text>

                            <CheckBox
                                center
                                title={
                                    PrinterAddWizardPrinterInformationBase.printerLocations[
                                        this.state.printerPlace
                                    ]
                                }
                                checkedIcon='dot-circle-o'
                                uncheckedIcon={null}
                                checked={true}
                                onPress={() => {
                                    if ( this.printerPlaceActionSheet ) {
                                        this.printerPlaceActionSheet.show()
                                    }
                                }}
                            />

                            <Text style={[styles.addPrinterWizardHeaderText, {fontSize: 18, width: null, marginTop: 20}]}>Modelo da impressora</Text>

                            <CheckBox
                                center
                                title={
                                    this.printerModelsTransformed[
                                        this.state.printerModel
                                    ].label
                                }
                                checkedIcon='dot-circle-o'
                                uncheckedIcon={null}
                                checked={true}
                                onPress={() => {
                                    if ( this.printerModelActionSheet ) {
                                        this.printerModelActionSheet.show()
                                    }
                                }}
                            />
                        </ScrollView>
                    </View>

                    <ActionSheet
                        ref={o => this.printerPlaceActionSheet = o}
                        title={'Selecione o local da impressora'}
                        options={PrinterAddWizardPrinterInformationBase.printerLocations}
                        cancelButtonIndex={PrinterAddWizardPrinterInformationBase.printerLocations.length - 1}
                        onPress={(index) => {
                            if ( index < PrinterAddWizardPrinterInformationBase.printerLocations.length - 1 ) {
                                this.setState({
                                    printerPlace: index
                                })
                            }
                        }}
                    />

                    <ActionSheet
                        ref={o => this.printerModelActionSheet = o}
                        title={'Selecione o modelo da impressora'}
                        options={
                            this.printerModelsTransformed.map((item) => {
                                return item.label
                            })
                        }
                        cancelButtonIndex={this.printerModelsTransformed.length - 1}
                        onPress={(index) => {
                            if ( index < this.printerModelsTransformed.length - 1 ) {
                                this.setState({
                                    printerModel: index
                                })
                            }
                        }}
                    />
                </View>
            </View>
        );
    }

    renderLoading = () => {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>Adicionando a impressora...</Text>

                    <ActivityIndicator size={Platform.OS == 'ios' ? 'large' : 100} color="#3D6889" style={{marginTop: 50}} />
                </View>
            </View>
        )
    }

    renderAdded = () => {
        return (
            <View style={{width: '100%', height: '100%'}}>
                <View style={{width:'100%', alignItems: 'center', justifyContent: 'center', marginTop: 70}}>
                    <Text style={[styles.addPrinterWizardHeaderText, {width: isTablet ? 450 : '100%'}]}>Impressora salva com sucesso! Vamos testar?</Text>

                    <Button
                        containerStyle={styles.addPrinterWizardButton}
                        buttonStyle={styles.addPrinterWizardButtonInternal}
                        iconRight
                        icon={{
                            name: 'arrow-right',
                            type: 'font-awesome',
                            size: 18,
                            color: '#3D6889'
                        }}
                        title={
                            "Vamos lá!"
                        }
                        titleStyle={styles.addPrinterWizardButtonTitle}
                        onPress={() => {
                            const printerType = this.props.navigation.getParam('type');
                            const printerId = this.props.navigation.getParam('id');
                            const printerName = this.props.navigation.getParam('name');

                            if ( printerType ) {
                                Printing.quickWrite(
                                    printerType,
                                    {
                                        id: this.state.printerId,
                                        name: printerName,
                                        paired: true
                                    },
                                    "Sua impressora funciona!\n\n\n"
                                ).then(() => {
                                    Alert.alert("Oba!", "Parabéns! Sua impressora foi configurada com sucesso!", [
                                        {
                                            text: "Ok!",
                                            onPress: () => {
                                                this.props.dispatch(printerWizard(false))
                                            }
                                        }
                                    ], {
                                        cancelable: false
                                    });
                                }).catch((e) => {
                                    console.log(e);
                                    Alert.alert("Opa!", "Tivemos um pequeno problema ao conectar com a impressora, tente novamente!", [
                                        {
                                            text: "Ok!"
                                        }
                                    ], {
                                        cancelable: false
                                    });
                                });
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    render() {
        return this.props.printerLoading ? this.renderLoading() : (
            this.props.printerAdded ? this.renderAdded() : this.renderAddScreen()
        );
    }
}

const PrinterAddWizardPrinterInformation = connect(mapStateToProps)(PrinterAddWizardPrinterInformationBase);

const RootStack = createSwitchNavigator({
    Start: {
        screen: PrinterAddWizardStart
    },
    SelectType: {
        screen: PrinterAddWizardSelectType
    },
    AddPrinter: {
        screen: PrinterAddWizardSearchPrinters
    },
    AddPrinterInformation: {
        screen: PrinterAddWizardPrinterInformation
    }
}, {
    headerMode: 'screen',
    initialRouteName: 'Start'
});

class PrinterAddWizard extends Component {
    render() {
        return (
            <View style={styles.addPrintWizardContainer}>
                <View style={styles.addPrintWizardModal}>
                    <RootStack/>
                </View>
            </View>
        )
    }
}

export {PrinterAddWizard};
export default connect(mapStateToProps)(PrinterAddWizard);
