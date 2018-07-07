import { Platform } from 'react-native';

import BluetoothSerial from 'react-native-bluetooth-serial'

class BluetoothDriver {
    constructor() {
        //Bluetooth only handles one at a time
    }

    disconnect() {
        return BluetoothSerial.disconnect();
    }

    isConnected() {
        return BluetoothSerial.isConnected();
    }

    write(buffer) {
        return BluetoothSerial.write(buffer);
    }
}

export default class BluetoothImplementation {
    static listDevices() {
        if ( Platform.os == "android" ) {
            return Promise.all([
                BluetoothSerial.list(),
                BluetoothSerial.discoverUnpairedDevices()
            ]).then((deviceListCombined) => {
                return deviceListCombined[0].map((item) => {
                    return {
                        ...item,
                        paired: true
                    }
                }).concat(
                    deviceListCombined[1].map((item) => {
                        return {
                            ...item,
                            paired: false
                        }
                    })
                );
            })
        }
        else {
            return BluetoothSerial.list().then((list) => {
                return list.map((item) => {
                    return {
                        ...item,
                        paired: true
                    }
                });
            });
        }
    }

    static isEnabled() {
        return BluetoothSerial.isEnabled();
    }

    static enable() {
        if ( Platform.os == "android" ) {
            return BluetoothSerial.enable();
        }

        return Promise.reject("Enable not allowed on iOS");
    }

    static disable() {
        if ( Platform.os == "android" ) {
            return BluetoothSerial.disable();
        }

        return Promise.reject("Enable not allowed on iOS");
    }

    static connect(device) {
        if ( device.paired ) {
            return BluetoothSerial.connect(device.id).then((isConnected) => {
                if ( ! isConnected ) {
                    throw 'Error connecting';
                }

                return new BluetoothDriver();
            });
        }
        else {
            return BluetoothSerial.pairDevice(device.id).then((paired) => {
                if ( paired ) {
                    return BluetoothSerial.connect(device.id).then(() => {
                        if ( ! isConnected ) {
                            throw 'Error connecting';
                        }

                        return new BluetoothDriver();
                    });
                }
                else {
                    throw "Device pair error";
                }
            });
        }
    }
}
