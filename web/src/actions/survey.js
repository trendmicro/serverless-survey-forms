import * as types from '../constants/ActionTypes';
import axios from 'axios';
import config from '../config';
import * as feedbackAction from './feedback';

/* eslint no-use-before-define: [2, { "functions": false }] */

export function requestSurvey() {
    return {
        type: types.REQUEST_SURVEY
    };
}

export function receiveSurveySuccess(data) {
    return {
        type: types.RECEIVE_SURVEY_SUCCESS,
        survey: data
    };
}

export function receiveSurveyFailure(err) {
    return {
        type: types.RECEIVE_SURVEY_FAILURE,
        errorMsg: err
    };
}

export function getFeeback(accountid, surveyid, clientid) {
    return (dispatch) => {
        dispatch(requestSurvey());
        return axios(`${config.baseURL}/api/v1/feedbacks/${surveyid}/${clientid}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Cache-Control': 'max-age=0'
            }
        })
        .then(response => {
            if (response.status >= 400) {
                // It means the clientid cannot be found
                dispatch(fetchSurvey(accountid, surveyid));
                throw new Error('Bad response from server');
            }
            return response.data;
        })
        .then(data => {
            // store data to submit
            dispatch(feedbackAction.recordFeedback(data.feedback));
            dispatch(feedbackAction.saveClientID(clientid));
            dispatch(fetchSurvey(accountid, surveyid));
        })
        .catch(err => console.log(err));
    };
}

export function fetchSurvey(accountid, surveyid) {
    return (dispatch, getState) => {
        dispatch(requestSurvey());
        return axios(`${config.baseURL}/api/v1/surveys/${accountid}/${surveyid}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Cache-Control': 'max-age=0'
            }
        })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            return response.data;
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
        })
        .catch(err => console.log(err));
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
