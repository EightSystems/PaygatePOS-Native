export default class MarkdownParser {
    static parse(markdown, format = 'escpos', printerWidth = '80mm', printerImplementation = 'generic', posDevice) {
        if ( format == 'escpos' ) {
            return MarkdownParser.parseToPOS(markdown, printerWidth, printerImplementation, posDevice);
        }

        return MarkdownParser.parseToPDF(markdown, printerWidth, posDevice);
    }

    static parseToPOS(markdown, printerWidth, printerImplementation, posDevice) {
        return new Promise((resolve, reject) => {
        });
    }

    static async parseToPDF(markdown, printerWidth, posDevice) {
        return new Promise((resolve, reject) => {
        });
    }
}
