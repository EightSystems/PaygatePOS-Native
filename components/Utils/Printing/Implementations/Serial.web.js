const SerialPort = require('serialport');

import SerialAdapter from 'escpos/adapter/serial';

class SerialDriver {
    constructor(serialPortDevice) {
        this.currentSerialPort = serialPortDevice;
    }

    disconnect() {
        if ( this.currentSerialPort ) {
            return new Promise((resolve, reject) => {
                this.currentSerialPort.close((error) => {
                    this.currentSerialPort = null;

                    if ( error ) {
                        reject(error);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        }

        return Promise.reject();
    }

    isConnected() {
        if ( this.currentSerialPort ) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    write(buffer) {
        if ( this.currentSerialPort ) {
            return new Promise((resolve, reject) => {
                this.currentSerialPort.write(buffer, (error) => {
                    if ( error ) reject(error);
                    else resolve(true);
                });
            });
        }
        else {
            return Promise.reject();
        }
    }

    getRawDevice() {
        return this.currentSerialPort;
    }
}

export default class SerialImplementation {
    static listDevices() {
        return SerialPort.list().then((serialPortList) => {
            return serialPortList ? serialPortList.map((serialPortItem) => {
                return {
                    id: serialPortItem.comName,
                    name: `${serialPortItem.comName} - ${serialPortItem.manufacturer ? serialPortItem.manufacturer : 'N/A'}`,
                    paired: true
                }
            }).concat([{
                id: -1,
                name: 'Add unknown Serial',
                paired: true
            }]) : [{
                id: -1,
                name: 'Add unknown Serial',
                paired: true
            }];
        })
    }

    static isEnabled() {
        return Promise.resolve(true);
    }

    static enable() {
        return Promise.resolve(true);
    }

    static disable() {
        return Promise.resolve(true);
    }

    static connect(device) {
        return new Promise((resolve, reject) => {
            var currentPort = new SerialAdapter(device.id);

            currentPort.open((error) => {
                if ( error ) {
                    reject(error);
                }
                else {
                    var currentSerialInstance = new SerialDriver(currentPort);

                    resolve(currentSerialInstance);
                }
            });
        });
    }
}
