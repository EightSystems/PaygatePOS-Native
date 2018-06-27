export default class {
    static languages = [navigator.language];

    static getLanguages() {
        return new Promise((resolve, reject) => {
            resolve(this.languages);
        })
    }
}
