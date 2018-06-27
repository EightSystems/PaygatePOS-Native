export default class {
    static languages = [navigator.language];

    getLanguages = () => {
        return new Promise((resolve, reject) => {
            resolve(this.languages);
        })
    }
}
