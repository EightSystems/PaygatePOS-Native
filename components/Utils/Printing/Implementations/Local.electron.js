import printer from 'printer';
import GraphicsMagick from 'gm';

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
                        try {
                            var graphicsmagick = require("graphicsmagick-static");

                            const gm = GraphicsMagick.subClass({
                                appPath: path.join(graphicsmagick.path, "/").replace(".asar", ".asar.unpacked")
                            });

                            gm(hBuffer, 'document.pdf').toBuffer('EMF', (err, emfBuffer) => {
                                if ( err ) {
                                    reject(err);
                                }
                                else {
                                    printer.printDirect({
                                        data: emfBuffer,
                                        type: 'EMF',
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
                        } catch(e) {
                            reject(e.toString());
                        }
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
                                console.log(err);
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
