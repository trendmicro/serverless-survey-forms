import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import config from '../config';
import * as feedbackAction from './feedback';

/* eslint no-use-before-define: [2, { "functions": false }] */

function requestSurvey() {
    return {
        type: types.REQUEST_SURVEY
    };
}

function receiveSurveySuccess(data) {
    return {
        type: types.RECEIVE_SURVEY_SUCCESS,
        survey: data
    };
}

function receiveSurveyFailure(err) {
    return {
        type: types.RECEIVE_SURVEY_FAILURE,
        errorMsg: err
    };
}

export function fetchSurvey(accountid, surveyid) {
    return (dispatch, getState) => {
        dispatch(requestSurvey());
        return fetch(`${config.baseURL}/api/v1/surveys/${accountid}/${surveyid}`, {
            credentials: 'same-origin',
            headers: {
                'Cache-Control': 'max-age=0'
            }
        })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.survey) {
                dispatch(receiveSurveySuccess(data.survey));
                if (data.hasOwnProperty('l10n') && data.l10n.hasOwnProperty('basic')) {
                    const l10n = data.l10n;
                    const locale = getState().settings.locale;
                    const lang = l10n.hasOwnProperty(locale) ? locale : l10n.basic;
                    dispatch(setL10n(l10n[lang]));
                }
                dispatch(goToPage(1));
                dispatch(feedbackAction.setFeedback(data.survey));
                dispatch(feedbackAction.setRequired());
            } else {
                dispatch(receiveSurveyFailure('Error'));
            }
        });
    };
}

export function surveyDone() {
    return {
        type: types.SURVEY_DONE
    };
}

export function goToPage(index) {
    return {
        type: types.GO_TO_PAGE,
        index
    };
}

export function savePrefill(data) {
    return {
        type: types.SAVE_PREFILL_DATA,
        data
    };
}

export function setL10n(l10n) {
    return {
        type: types.SET_SURVEY_L10N,
        l10n
    };
}
