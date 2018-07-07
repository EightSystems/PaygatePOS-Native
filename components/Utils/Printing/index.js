import {Platform} from 'react-native';

import MarkdownParser from './Implementations/MarkdownParser';

export default class Printing {
    static getSupportedTypes() {
        if ( Platform.OS == "android" ) {
            return {
                bluetooth: "Impressora Bluetooth",
                usb: "Impressora USB Serial",
                network: "Impressora de Rede Serial",
                local: "Impressora Local"
            }
        }
        else if ( Platform.OS == "ios" ) {
            return {
                bluetooth: "Impressora Bluetooth",
                network: "Impressora de Rede Serial",
                local: "Impressora Local"
            }
        }
        else { //Default is web with electron
            return {
                usb: "Impressora USB Serial",
                serial: "Impressora Serial",
                network: "Impressora de Rede Serial",
                local: "Impressora Local"
            }
        }
    }

    static getPrinterModels() {
        return {
            "generic": "Impressora Genérica",
            "qsprinter": "Impressora QS",
            "bematech": "Impressora Bematech Genérica",
            "daruma": "Impressora Daruma Genérica",
            "daruma_dr700": "Impressora Daruma DR-700",
            "epson": "Impressora EPSON Genérica",
            "elgin_i9": "Impressora Elgin I9",
            "elgin_i7": "Impressora Elgin I7",
            "elgin_rm_22": "Impressora Elgin RM-22",
            "nitere": "Impressora Nitere Genérica",
            "pdf": "Impressora do Sistema"
        }
    }

    static getImplementation(deviceType) {
        if ( deviceType == "bluetooth" ) {
            return require('./Implementations/Bluetooth').default;
        }
        else if ( deviceType == "usb" ) {
            return require('./Implementations/USB').default;
        }
        else if ( deviceType == "network" ) {
            return require('./Implementations/Network').default;
        }
        else if ( deviceType == "serial" ) {
            return require('./Implementations/Serial').default;
        }
        else if ( deviceType == "local" ) {
            return require('./Implementations/Local').default;
        }
    }

    static listDevices(deviceType) {
        return Printing.getImplementation(deviceType).listDevices();
    }

    static isEnabled(deviceType) {
        return Printing.getImplementation(deviceType).isEnabled();
    }

    static enable(deviceType) {
        return Printing.getImplementation(deviceType).enable();
    }

    static disable(deviceType) {
        return Printing.getImplementation(deviceType).disable();
    }

    static connect(deviceType, device) {
        return Printing.getImplementation(deviceType).connect(device);
    }

    static quickWrite(deviceType, device, mBuffer) {
        const deviceImplementation = Printing.getImplementation(deviceType);

        return deviceImplementation.isEnabled().then((isEnabled) => {
            var continuePromise;

            if ( isEnabled ) {
                continuePromise = Promise.resolve();
            }
            else {
                continuePromise = deviceImplementation.enable();
            }

            return continuePromise.then(() => {
                const connectAndWrite = (numberOfTimes) => {
                    return deviceImplementation.connect(device).then((currentDeviceDriver) => {
                        return (new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve()
                            }, 200)
                        })).then(() => {
                            MarkdownParser.parse(
                                mBuffer,
                                device.model == 'pdf' ? 'pdf' : 'escpos',
                                device.type,
                                device.model,
                                currentDeviceDriver
                            ).then(() => {
                                return currentDeviceDriver.disconnect();
                            }).catch(() => {
                                return currentDeviceDriver.disconnect().then(() => {
                                    throw 'Failed to write';
                                });
                            });
                        });
                    }).catch((e) => {
                        if ( numberOfTimes <= 3 ) {
                            return (new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    resolve()
                                }, 100)
                            })).then(() => {
                                return connectAndWrite(numberOfTimes+1);
                            })
                        }
                        else {
                            throw e;
                        }
                    });
                }

                return connectAndWrite(1);
            });
        });
    }
}
