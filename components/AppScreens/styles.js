import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    icon: {
        width: 35,
        height: 35,
    },
    vendingIconItem: {
        backgroundColor: '#6B6767',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10, marginRight: 10,
        marginTop: 10, marginBottom: 10,
        borderRadius: 5
    },
    vendingIconItemActive: {
        backgroundColor: 'white'
    },
    vendingIconItemCommandSent: {
        backgroundColor: '#F29036'
    },
    vendingIconFont: {
        color: 'white',
        fontWeight: 'bold'
    },
    vendingIconFontActive: {
        color: '#279DE0'
    },
    addPrintWizardContainer: {
        backgroundColor: '#242424',
        flex: 1
    },
    addPrintWizardModal: {
        backgroundColor: 'white',
        flex: 1,
        marginLeft: 65,
        marginRight: 65,
        marginTop: 65,
        marginBottom: 65,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addPrinterWizardHeaderText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#3D6889',
        width: 350,
        textAlign: 'center',
        marginBottom: 20
    },
    addPrinterWizardIcon: {
        color: '#3D6889'
    },
    addPrinterWizardButton: {
        marginTop: 20,
        maxWidth: 300,
        width: '100%'
    },
    addPrinterWizardButtonInternal: {
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: '#3D6889',
        borderWidth: 1
    },
    addPrinterWizardButtonTitle: {
        color: '#3D6889',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
