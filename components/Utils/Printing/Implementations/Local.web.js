import printer from 'printer';
import iconv from 'iconv-lite';

import ConsoleAdapter from 'escpos/adapter/console';

class LocalDriver {
    constructor(printerName, printerModel) {
        this.currentPrinterName = printerName;
        this.currentPrinterModel = printerModel;
    }

    disconnect() {
        return Promise.resolve();
    }

    isConnected() {
        return Promise.resolve(true);
    }

    write(hBuffer) {
        if ( this.currentPrinterName ) {
            return new Promise((resolve, reject) => {
                if ( this.currentPrinterModel == 'pdf' ) {
                    if ( process.platform == 'win32' ) {
                        printer.printDirect({
                            data: iconv.encode(hBuffer, 'utf8'),
                            type: 'TEXT',
                            printer: this.currentPrinterName,
                            success: (jobID) => {
                                resolve(true);
                            },
                            error: (err) => {
                                reject(err);
                            }
                        });
                    }
                    else {
                        printer.printDirect({
                            data: hBuffer,
                            type: 'PDF',
                            printer: this.currentPrinterName,
                            success: (jobID) => {
                                resolve(true);
                            },
                            error: (err) => {
                                reject(err);
                            }
                        });
                    }
                }
                else {
                    printer.printDirect({
                        data: hBuffer,
                        type: 'RAW',
                        printer: this.currentPrinterName,
                        success: (jobID) => {
                            resolve(true);
                        },
                        error: (err) => {
                            reject(err);
                        }
                    });
                }
            });
        }
        else {
            return Promise.reject();
        }
    }

    getRawDevice() {
        return new ConsoleAdapter((hBuffer) => {
            printer.printDirect({
                data: hBuffer,
                type: 'RAW',
                printer: this.currentPrinterName,
                success: (jobID) => {},
                error: (err) => {}
            });
        });
    }
}

export default class LocalImplementation {
    static listDevices() {
        return new Promise((resolve, reject) => {
            resolve(printer.getPrinters().map((printerItem) => {
                return {
                    id: printerItem.name,
                    name: printerItem.name,
                    paired: true
                }
            }));
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
            var currentSerialInstance = new LocalDriver(device.id, device.model);

            resolve(currentSerialInstance);
        });
    }
}
