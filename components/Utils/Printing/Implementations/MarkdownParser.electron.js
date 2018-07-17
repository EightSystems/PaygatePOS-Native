//import Printer from 'escpos/printer';
//import DarumaGeneric from 'escpos/implementations/daruma';

import PDFMake from 'pdfmake';
import MarkdownTreeParser from 'markdown-tree-parser';
import MarkdownItClass from 'markdown-it';
import {table as Table, getBorderCharacters} from 'table';

import path from 'path';

const MarkdownIt = new MarkdownItClass();

const getPrinterImplementationDriver = (printerImplementation, consoleDevice) => {
    if ( ! printerImplementation || printerImplementation == 'generic' ) {
        return new Printer(consoleDevice);
    }
    else if ( printerImplementation == 'daruma' ) {
        return new DarumaGeneric(consoleDevice);
    }
}

const parseLineToPOS = (parseLine, printerDevice, printerWidth) => {
    try {
        switch(parseLine.name) {
            case 'heading':
                printerDevice.font('a').size(parseLine.level == 1 ? 2 : 1, 1);

                parseLine.values.map((lineItem) => {
                    parseLineToPOS(lineItem, printerDevice, printerWidth);
                });

                printerDevice.size(1, 1).feed(2);
            break;
            case 'paragraph':
                printerDevice.font('a').size(1);

                parseLine.values.map((lineItem) => {
                    parseLineToPOS(lineItem, printerDevice, printerWidth);
                });

                printerDevice.feed(2);
            break;
            case 'blockquote': case 'code':
                printerDevice.font('a').size(1).style('I');
                parseLine.values.map((lineItem) => {
                    parseLineToPOS(lineItem, printerDevice, printerWidth);
                });
                printerDevice.style('NORMAL').feed(2);
            break;
            case 'table':
                var tableData = [parseLine.headings];
                parseLine.rows.map((rowLine) => {
                    tableData.push(
                        rowLine.map((cellItem) => {
                            return cellItem.map((cellItemSingle) => {
                                return cellItemSingle.value;
                            }).join("")
                        })
                    );
                });

                var printerMaxChars = printerWidth == '58mm' ? 32 : printerWidth == '80mm' ? 48 : 90;

                printerDevice.font('b').size(1, 1).text(
                    Table(tableData, {
                        columnDefault: {
                            width: Math.floor(printerMaxChars / parseLine.headings.length) - 1
                        },
                        border: {
                            topBody: ``,
                            topJoin: ``,
                            topLeft: ``,
                            topRight: ``,

                            bottomBody: ``,
                            bottomJoin: ``,
                            bottomLeft: ``,
                            bottomRight: ``,

                            bodyLeft: ``,
                            bodyRight: ``,
                            bodyJoin: `|`,

                            joinBody: ``,
                            joinLeft: ``,
                            joinRight: ``,
                            joinJoin: ``
                        }
                    }), 'latin1'
                );
            break;
            case 'checklist':
            break;
            case 'orderedlist':
            break;
            case 'list':
            break;
            case 'horizontal':
                printerDevice.cut(3);
            break;
            case 'em':
                printerDevice.style('B');
                printerDevice.pureText(parseLine.value, 'latin1');
                printerDevice.style('NORMAL');
            break;
            case 'italic':
                printerDevice.style('I');
                printerDevice.pureText(parseLine.value, 'latin1');
                printerDevice.style('NORMAL');
            break;
            case 'link':
                printerDevice.pureText(parseLine.title, 'latin1');
            break;
            case 'image':
                printerDevice.pureText(parseLine.alt, 'latin1');
            break;
            default:
                printerDevice.pureText(parseLine.value, 'latin1');
            break;
        }
    } catch(e) {
        console.log(['PARSE ERROR', e]);
    }
}

const parseLineToPDF = async (parseLine, contentDefinition = [], printerWidth = '80mm', extraStyle = {}) => {
    return new Promise((resolve, reject) => {
        const promiseResolve = async (resolve, reject) => {
            try {
                let parsedContent
                switch(parseLine.name) {
                    case 'heading':
                        Promise.all(
                            parseLine.values.map((lineItem) => {
                                return parseLineToPDF(lineItem, [], printerWidth, {
                                    fontSize: printerWidth == '80mm' ? Math.round(((10 - parseLine.level) / 10) * 22) : Math.round(((10 - parseLine.level) / 10) * 18),
                                    bold: true
                                });
                            })
                        ).then((parsedContent) => {
                            contentDefinition.push({
                                text: parsedContent
                            });

                            resolve(contentDefinition);
                        });
                    break;
                    case 'paragraph':
                        Promise.all(
                            parseLine.values.map((lineItem) => {
                                return parseLineToPDF(lineItem, [], printerWidth, {
                                    fontSize: printerWidth == '80mm' ? 12 : 10
                                });
                            })
                        ).then((parsedContent) => {
                            parsedContent.forEach((contentValue, index) => {
                                let lineContent = [];
                                contentValue.forEach((itemValue, iIndex, itemArray) => {
                                    if ( ! itemValue.image ) {
                                        lineContent.push(itemValue);

                                        if ( iIndex == itemArray.length - 1 ) {
                                            contentDefinition.push({
                                                text: lineContent
                                            });
                                        }
                                    }
                                    else {
                                        if ( lineContent.length > 0 ) {
                                            contentDefinition.push({
                                                text: lineContent
                                            });
                                        }

                                        lineContent = [];
                                        contentDefinition.push(itemValue);
                                    }
                                })
                            })

                            resolve(contentDefinition);
                        });
                    break;
                    case 'blockquote': case 'code':
                        Promise.all(
                            parseLine.values.map((lineItem) => {
                                return parseLineToPDF(lineItem, parsedContent, printerWidth, {
                                    fontSize: printerWidth == '80mm' ? 12 : 10,
                                    italics: true
                                });
                            })
                        ).then((parsedContent) => {
                            contentDefinition.push({
                                text: parsedContent
                            });

                            resolve(contentDefinition);
                        })
                    break;
                    case 'table':
                        var tableData = [parseLine.headings];
                        parseLine.rows.map((rowLine) => {
                            tableData.push(
                                rowLine.map((cellItem) => {
                                    return cellItem.map((cellItemSingle) => {
                                        return cellItemSingle.value;
                                    }).join("")
                                })
                            );
                        });

                        contentDefinition.push({
                            layout: 'lightHorizontalLines',
                            table:  {
                                headerRows: 1,
                                body: tableData
                            }
                        });

                        resolve(contentDefinition);
                    break;
                    case 'checklist':
                    break;
                    case 'orderedlist':
                    break;
                    case 'list':
                    break;
                    case 'horizontal':
                        contentDefinition.push({
                            ...extraStyle,
                            text: '----',
                            alignment: 'center'
                        });

                        resolve(contentDefinition);
                    break;
                    case 'em':
                        contentDefinition.push({
                            ...extraStyle,
                            text: parseLine.value,
                            bold: true
                        });

                        resolve(contentDefinition);
                    break;
                    case 'italic':
                        contentDefinition.push({
                            ...extraStyle,
                            text: parseLine.value,
                            italics: true
                        });

                        resolve(contentDefinition);
                    break;
                    case 'link':
                        contentDefinition.push({
                            ...extraStyle,
                            text: parseLine.title,
                            link: parseLine.link
                        });

                        resolve(contentDefinition);
                    break;
                    case 'image':
                        const arrayBufferToBase64 = (buffer) => {
                            var binary = '';
                            var bytes = [].slice.call(new Uint8Array(buffer));

                            bytes.forEach((b) => binary += String.fromCharCode(b));

                            return window.btoa(binary);
                        };

                        if ( parseLine.src.indexOf('http') > -1 ) {
                             fetch(parseLine.src).then((response) => {
                                 response.arrayBuffer().then((buffer) => {
                                     const imageContent = `data:${response.headers.get("content-type")};base64,${arrayBufferToBase64(buffer)}`;

                                     contentDefinition.push({
                                         image: imageContent
                                     });

                                     resolve(contentDefinition);
                                 });
                             });
                        }
                        else {
                            contentDefinition.push({
                                image: parseLine.src
                            });

                            resolve(contentDefinition);
                        }
                    break;
                    default:
                        contentDefinition.push({
                            ...extraStyle,
                            text: parseLine.value
                        });

                        resolve(contentDefinition);
                    break;
                }
            } catch(e) {
                console.log(['PARSE ERROR', e]);
                reject(e);
            }
        }

        promiseResolve(resolve, reject);
    });
}

export default class MarkdownParser {
    static parse(markdown, format = 'escpos', printerWidth = '80mm', printerImplementation = 'generic', posDevice) {
        if ( format == 'escpos' ) {
            return MarkdownParser.parseToPOS(markdown, printerWidth, printerImplementation, posDevice);
        }

        return MarkdownParser.parseToPDF(markdown, printerWidth, posDevice);
    }

    static parseToPOS(markdown, printerWidth, printerImplementation, posDevice) {
        return new Promise((resolve, reject) => {
            const parseTree = JSON.parse(MarkdownTreeParser(markdown).dump());
            if ( parseTree ) {
                try {
                    const printer = getPrinterImplementationDriver(printerImplementation, posDevice.getRawDevice());
                    posDevice.getRawDevice().open(() => {
                        try {
                            parseTree.map((parseLine) => {
                                parseLineToPOS(parseLine, printer, printerWidth);
                            })

                            printer.cut(false, 6).flush(() => {
                                resolve(true);
                            });
                        } catch(e) {
                            reject();
                        }
                    });
                } catch(e) {
                    reject();
                }
            }
            else {
                reject();
            }
        });
    }

    static async parseToPDF(markdown, printerWidth, posDevice) {
        return new Promise((resolve, reject) => {
            const parseTree = JSON.parse(MarkdownTreeParser(markdown).dump());
            if ( parseTree ) {
                try {
                    Promise.all(
                        parseTree.map((parseLine) => {
                            return parseLineToPDF(parseLine, [], printerWidth);
                        })
                    ).then((pdfContentDefinition) => {
                        const printer = new PDFMake({
                            Roboto: {
                                normal: path.join(__dirname, '../../../../', 'assets/fonts/Lato-Light.ttf'),
                                italics: path.join(__dirname, '../../../../', 'assets/fonts/Lato-Light.ttf'),
                                bold: path.join(__dirname, '../../../../', 'assets/fonts/Lato-Bold.ttf'),
                                bolditalics: path.join(__dirname, '../../../../', 'assets/fonts/Lato-Bold.ttf')
                            }
                        });

                        const doc = printer.createPdfKitDocument({
                            content: pdfContentDefinition
                        })

                        var chunks = [];
                        var result;

                        doc.on('data', function (chunk) {
                            chunks.push(chunk);
                        });

                        doc.on('end', function () {
                            posDevice.write(Buffer.concat(chunks)).then(() => {
                                resolve(true);
                            });
                        });

                        doc.end();
                    });
                } catch(e) {
                    reject(e);
                }
            }
            else {
                reject(false);
            }
        });
    }
}
