/**
    * This module is here so we can create some of the native modules functionalities
    * For example, the I18N module uses a native module to grab the device locale, we mimic this
    @author Vin <vin@8sistemas.com
*/

import {UIManager} from 'react-native';

import RNI18n from './RNI18n';
import SplashScreen from './SplashScreen';

const NativeModules = {
  UIManager,
  RNI18n,
  SplashScreen
};

export default NativeModules;
