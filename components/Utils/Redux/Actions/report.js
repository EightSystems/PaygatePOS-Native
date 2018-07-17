import { call, put, take, takeLatest, select } from 'redux-saga/effects';

import * as types from '../consts';
import * as serviceConsts from '../../Services/consts';

export function listReportsAction() {
    return {
        type: types.LIST_REPORTS_ACTION,
        meta: {
            offline: {
                effect: {
                    url: `${serviceConsts.SERVER_URL}/reports?sessionId=${window.sessionId}`,
                    method: 'GET'
                },
                commit: {type: types.LIST_REPORTS_ACTION_COMPLETE},
                rollback: {type: types.LIST_REPORTS_ACTION_FAIL}
            }
        }
    };
}

export function getReportDataAction(reportFilterData) {
    return {
        type: types.GET_REPORT_DATA_ACTION,
        ...reportFilterData,
        meta: {
            offline: {
                effect: {
                    url: `${serviceConsts.SERVER_URL}/reports/${reportFilterData.sectionId}/${reportFilterData.reportType}/data/${reportFilterData.reportName}?sessionId=${window.sessionId}`,
                    method: 'GET'
                },
                commit: {type: types.GET_REPORT_DATA_ACTION_COMPLETE},
                rollback: {type: types.GET_REPORT_DATA_ACTION_FAIL}
            }
        }
    };
}
