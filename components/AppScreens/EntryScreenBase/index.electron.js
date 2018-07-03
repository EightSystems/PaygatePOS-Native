import Base from './Base';

export default class extends Base {
    componentWillMount() {
        var ipcRenderer = require('electron').ipcRenderer;
        if ( ipcRenderer ) {
            ipcRenderer.send('maximize');
        }
    }
}
