import React, {Component} from 'react';
import {Button} from 'react-native-elements';

import {ipcRenderer} from 'electron';

export default class LoginButton extends Component {
    render() {
        return <Button title={"Login"} onPress={() => {
            ipcRenderer.send('maximize');
        }}/>
    }
}
