import * as types from '../consts'

import {PixelRatio} from 'react-native';

export default function windowReducer(state = {}, action) {
    switch (action.type) {
        case types.DIMENSIONS_CHANGE_ACTION:
            const pixelDensity = PixelRatio.get();
            var isTablet = isPhone = false;
            var adjustedWidth = action.window.width * pixelDensity;
            var adjustedHeight = action.window.height * pixelDensity;

            if(pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
                isTablet = true;
                isPhone = false;
            } else if(pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
                isTablet = true;
                isPhone = false;
            } else {
                isTablet = false;
                isPhone = true;
            }

            return {
                ...state,
                window: action.window,
                screen: action.screen,
                isTablet,
                isPhone
            };
        break;
        default:
            return state
    }
}
