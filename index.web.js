import { AppRegistry, Touchable } from 'react-native';
import Octicons from 'react-native-vector-icons/Fonts/Octicons.ttf';
import Fontawesome from 'react-native-vector-icons/Fonts/Fontawesome.ttf';

const style = document.createElement('style')
style.type = 'text/css'

const fontsToEmbed = {
    "Octicons": Octicons,
    "Fontawesome": Fontawesome
}

Object.keys(fontsToEmbed).map((fontName) => {
    style.appendChild(
        document.createTextNode(
            `@font-face { src: url(${fontsToEmbed[fontName]}); font-family: "${fontName}"; }`,
        ),
    );
})

document.head.appendChild(style);

import App from './App';

AppRegistry.registerComponent('PaygatePOS', () => App);
AppRegistry.runApplication('PaygatePOS', {
    rootTag: document.getElementById('root'),
})
