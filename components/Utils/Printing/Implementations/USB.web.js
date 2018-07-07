import USB from 'escpos/adapter/usb';

class USBDriver {
    constructor(usbDevice) {
        this.currentUSBPort = usbDevice;
    }

    disconnect() {
        if ( this.currentUSBPort ) {
            return new Promise((resolve, reject) => {
                this.currentUSBPort.close((error) => {
                    this.currentUSBPort = null;

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
        if ( this.currentUSBPort ) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    write(buffer) {
        if ( this.currentUSBPort ) {
            return new Promise((resolve, reject) => {
                this.currentUSBPort.write(buffer, (error) => {
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
        return this.currentUSBPort;
    }
}

export default class USBImplementation {
    static listDevices() {
        return new Promise((resolve, reject) => {
            const printerList = USB.findPrinter().map((usbItem) => {
                return {
                    id: `VEN_${usbItem.deviceDescriptor.idVendor}&DEV_${usbItem.deviceDescriptor.idProduct}`,
                    name: `VEN_${usbItem.deviceDescriptor.idVendor}&DEV_${usbItem.deviceDescriptor.idProduct} - USB`,
                    paired: true
                }
            }).concat([{
                id: -1,
                name: 'Add unknown USB',
                paired: true
            }]);

            resolve(printerList);
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
            if ( device.id.indexOf("&") > -1 ) {
                var manufacturerId, deviceId;
                [manufacturerId, deviceId] = device.id.split("&");
                manufacturerId = manufacturerId.replace("VEN_", "");
                deviceId = deviceId.replace("DEV_", "");

                var currentPort = new USB(manufacturerId, deviceId);

                currentPort.open((error) => {
                    if ( error ) {
                        reject(error);
                    }
                    else {
                        var currentSerialInstance = new USBDriver(currentPort);

                        resolve(currentSerialInstance);
                    }
                });
            }
            else {
                reject("Invalid ID");
            }
        });
    }
}
