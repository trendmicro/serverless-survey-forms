
import * as types from '../constants/ActionTypes';
// import fetch from 'isomorphic-fetch';
// import config from '../config';

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

export function fetchSurvey(surveyid) {
    return (dispatch) => {
        dispatch(requestSurvey());
        // TODOS: config.baseURL and get feedback api
        // maybe debug can keep this fakedata
        const data = { surveyid: surveyid };
        data.data = require('../../assets/fakedata/survey.json');
        return new Promise(() => {
            setTimeout(() => {
                if (data) {
                    dispatch(receiveSurveySuccess(data));
                } else {
                    dispatch(receiveSurveyFailure('Error'));
                }
            }, 3000);
        });

        // return fetch(`${config.baseURL}/api/v1/feedbacks/${surveyid}/<clientid>/`, {})
        // .then(response => response.json())
        // .then(data => dispatch(receiveSurveySuccess(data)))
        // .catch(err => dispatch(receiveSurveyFailure(err)));
    };
}

export function goToPage(index) {
    return {
        type: types.GO_TO_PAGE,
        index
    };
}
