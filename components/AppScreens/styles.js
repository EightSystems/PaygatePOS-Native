import { StyleSheet } from 'react-native';

export default (isTablet) => StyleSheet.create({
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
        marginLeft: isTablet ? 65 : 5,
        marginRight: isTablet ? 65 : 5,
        marginTop: isTablet ? 65 : 5,
        marginBottom: isTablet ? 65 : 5,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addPrinterWizardHeaderText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#3D6889',
        width: isTablet ? 350 : '100%',
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
