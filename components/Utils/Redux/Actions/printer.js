import * as types from '../consts';

export function savePrinterAction(printerData) {
    return {
        type: types.PRINTER_ADD_ACTION,
        printerData
    };
}

export function editPrinterAction(printerData, printerIndex) {
    return {
        type: types.PRINTER_UPDATE_ACTION,
        printerData,
        printerIndex
    };
}

export function updatePrinterAction(printerData, printerIndex) {
    return {
        type: types.PRINTER_SAVE_ACTION,
        printerData,
        printerIndex
    };
}

export function deletePrinterAction(printerIndex) {
    return {
        type: types.PRINTER_REMOVE_ACTION,
        printerIndex
    };
}

export function printerWizard(enterWizard) {
    return {
        type: types.PRINTER_WIZARD,
        enterWizard
    };
}
