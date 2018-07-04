import * as types from '../consts'

export default function printerReducer(state = {}, action) {
    switch (action.type) {
        case types.PRINTER_WIZARD:
            return {
                ...state,
                wizard: action.enterWizard,
                loading: false,
                added: false
            }
        break;
        case types.PRINTER_UPDATE:
            return {
                ...state,
                wizard: true,
                loading: false,
                added: false,
                editData: action.printerData,
                editIndex: action.printerIndex
            }
        break;
        case types.PRINTER_ADD:
            return {
                ...state,
                list: state.list ? state.list.concat(action.printerData) : [action.printerData],
                loading: false,
                added: true
            }
        break;
        case types.PRINTER_ADD_LOADING:
            return {
                ...state,
                loading: true,
                added: false
            }
        break;
        case types.PRINTER_REMOVE:
            return {
                ...state,
                list: state.list ? state.list.filter((item, index) => {
                    return index != action.printerIndex;
                }) : []
            }
        break;
        case types.PRINTER_SAVE:            
            return {
                ...state,
                list: state.list.map((item, index) => {
                    if ( index == action.printerIndex ) return action.printerData;

                    return item;
                }),
                editData: undefined,
                editIndex: undefined,
                loading: false,
                added: true
            };
        break;
        default:
            return state
        break;
    }
}
