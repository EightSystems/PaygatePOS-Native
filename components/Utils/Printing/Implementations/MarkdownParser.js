import ESCPos from 'escpos';
import PDFWriter from 'html-pdf';
import MarkdownTreeParser from 'markdown-tree-parser';
import MarkdownItClass from 'markdown-it';
import {table as Table, getBorderCharacters} from 'table';

const MarkdownIt = new MarkdownItClass();

const getPrinterImplementationDriver = (printerImplementation, consoleDevice) => {
    if ( ! printerImplementation || printerImplementation == 'generic' ) {
        return new ESCPos.Printer(consoleDevice);
    }
    else if ( printerImplementation == 'daruma' ) {
        return new ESCPos.DarumaGeneric(consoleDevice);
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

export default class MarkdownParser {
    static parse(markdown, format = 'escpos', printerWidth = '80mm', printerImplementation = 'generic', posDevice) {
        if ( format == 'escpos' ) {
            return MarkdownParser.parseToPOS(markdown, printerWidth, printerImplementation, posDevice);
        }

        return MarkdownParser.parseToPDF(markdown, printerWidth);
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

    static parseToPDF(markdown, printerWidth, posDevice) {
        return new Promise((resolve, reject) => {
            try {
                if ( process.platform == 'win32' ) {
                    resolve(markdown);
                }
                else {
                    const htmlResult = MarkdownIt.render(markdown);
                    PDFWriter.create(htmlResult, {
                        width: printerWidth,
                        type: "pdf"
                    }).toBuffer((err, mBuffer) => {
                        if ( ! err ) {
                            posDevice.write(mBuffer).then(() => {
                                resolve(true);
                            });
                        }
                        else {
                            reject(err);
                        }
                    });
                }
            } catch(e) {
                reject(e);
            }
        });
    }
}
