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
    return (dispatch) => {
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
            const survey = Object.assign({}, data.survey, {
                subject: data.subject
            });
            if (data && data.survey) {
                dispatch(receiveSurveySuccess(survey));
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
    // Send 'done' msg to client
    window.parent.postMessage({
        source: window.location.origin,
        msg: 'done'
    }, '*');
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
