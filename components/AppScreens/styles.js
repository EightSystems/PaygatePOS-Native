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
    }
});
