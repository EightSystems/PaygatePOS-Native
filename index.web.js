import { AppRegistry } from 'react-native';
import Octicons from 'react-native-vector-icons/Fonts/Octicons.ttf';
import Fontawesome from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import Feather from 'react-native-vector-icons/Fonts/Feather.ttf';
import LatoLight from './assets/fonts/Lato-Light.ttf';
import LatoBold from './assets/fonts/Lato-Bold.ttf';
import LatoMedium from './assets/fonts/Lato-Medium.ttf';
import LatoRegular from './assets/fonts/Lato-Regular.ttf';

const style = document.createElement('style')
style.type = 'text/css'

const fontsToEmbed = {
    "Octicons": Octicons,
    "Fontawesome": Fontawesome,
    "Feather": Feather,
    "Lato-Light": LatoLight,
    "Lato-Bold": LatoBold,
    "Lato-Medium": LatoMedium,
    "Lato-Regular": LatoRegular,
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
