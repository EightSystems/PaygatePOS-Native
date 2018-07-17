import * as types from '../consts'

export default function reportReducer(state = {}, action) {
    switch (action.type) {
        case types.LIST_REPORTS_ACTION:
            return {
                ...state,
                loaded: false,
                error: false
            };
        break;
        case types.LIST_REPORTS_ACTION_COMPLETE:
            return {
                ...state,
                loaded: true,
                error: false,
                types: action.payload.reports
            };
        break;
        case types.LIST_REPORTS_ACTION_FAIL:
            return {
                ...state,
                loaded: true,
                error: true
            };
        break;

        case types.GET_REPORT_DATA_ACTION:
            return {
                ...state,
                selected: [action.reportName, action.sectionId, action.reportType],
                data: null,
                selectedLoaded: false,
                selectedError: false
            };
        break;
        case types.GET_REPORT_DATA_ACTION_COMPLETE:
            return {
                ...state,
                selectedLoaded: true,
                selectedError: false,
                data: action.payload.data
            };
        break;
        case types.GET_REPORT_DATA_ACTION_FAIL:
            return {
                ...state,
                selectedLoaded: true,
                selectedError: true,
                data: null
            };
        break;
        default:
            return state
    }
}
