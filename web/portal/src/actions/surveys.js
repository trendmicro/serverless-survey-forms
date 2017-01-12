
import fetch from 'isomorphic-fetch';
import moment from 'moment';

import * as types from '../constants/ActionTypes';
import Config from '../config';
import Mixins from '../mixins/global';
import { expiredToken } from './account';
import { getOneSurvey, postSurvey, receiveQuestionsFailure } from './questions';

export function requestSurveysFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.RECEIVE_SURVEYS_FAILURE,
            errorMsg: err
        });
    };
}

export function receiveSurveysSuccess(data) {
    return {
        type: types.RECEIVE_SURVEYS_SUCCESS,
        surveys: data
    };
}

export function getSurveys() {
    return (dispatch, getState) => {
        dispatch({ type: types.REMOVE_SELECTED_SURVEYS });
        dispatch({ type: types.REQUEST_SURVEYS_LIST });
        const { account, selectedUser, token } = getState();
        // fetch selected user account or user's account
        const accountid = selectedUser.hasOwnProperty('accountid') ?
            selectedUser.accountid : account.accountid;

        return fetch(`${Config.baseURL}/api/v1/mgnt/surveys/${accountid}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                authorization: token
            }
        })
        .then(response => response.json())
        .then(data => {
            const surveys = data.surveys.sort((a, b) => {
                if (a.datetime < b.datetime) return 1;
                if (a.datetime > b.datetime) return -1;
                return 0;
            });
            dispatch(receiveSurveysSuccess(surveys));
        })
        .catch(err => dispatch(requestSurveysFailure(err)));
    };
}

export function toggleSelectedSurveys(data) {
    return (dispatch, getState) => {
        if (getState().selectedSurveys === data) {
            dispatch({
                type: types.REMOVE_SELECTED_SURVEYS
            });
        } else {
            dispatch({
                type: types.ADD_SELECTED_SURVEYS,
                selectedSurveys: data
            });
        }
    };
}

export function requestDeleteSurveysFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.RECEIVE_DELETE_SURVEYS_FAILURE,
            errorMsg: err
        });
    };
}

export function receiveDeleteSurveysSuccess() {
    return {
        type: types.RECEIVE_DELETE_SURVEYS_SUCCESS
    };
}

export function deleteSurvey() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_DELETE_SURVEYS });
        const { account, selectedUser, selectedSurveys, token } = getState();
        // delete selected user account or user's account
        const accountid = selectedUser.hasOwnProperty('accountid') ?
            selectedUser.accountid : account.accountid;
        return fetch(
            `${Config.baseURL}/api/v1/mgnt/surveys/${accountid}/${selectedSurveys}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    authorization: token
                }
            })
            .then(response => response.json())
            .then(() => {
                dispatch(receiveDeleteSurveysSuccess());
                dispatch(toggleSelectedSurveys(selectedSurveys));
                dispatch(getSurveys());
            })
            .catch(err => dispatch(requestDeleteSurveysFailure(err)));
    };
}

export function receiveReportSuccess() {
    return {
        type: types.RECEIVE_REPORT_SUCCESS
    };
}

export function receiveReportFailure(err) {
    return {
        type: types.RECEIVE_REPORT_FAILURE,
        errorMsg: err
    };
}

function getL10n(l10n, key) {
    return l10n[key] || key;
}

export function handleReportHeader(survey, privacy, l10n) {
    const header = ['Client ID', 'Product Uid', 'Locale'];
    survey.forEach((que, idx) => {
        header.push(`Q${idx + 1}_${getL10n(l10n, que.label)}`);
        switch (que.type) {
        case 'checkbox':
            for (const opt of que.data) {
                header.push(getL10n(l10n, opt.label));
                if (opt.hasOwnProperty('input')) {
                    header.push(getL10n(l10n, opt.input));
                }
            }
            break;
        case 'radio':
            for (const opt of que.data) {
                if (opt.hasOwnProperty('input')) {
                    header.push(getL10n(l10n, opt.input));
                    break;
                }
            }
            break;
        case 'rating':
            if (que.hasOwnProperty('input')) {
                header.push(getL10n(l10n, que.input));
            }
            break;
        case 'text':
        case 'textarea':
        default:
        }
    });
    if (privacy) header.push('Privacy email');
    header.push('Feedback time');

    return [header];
}

export function handleReportContent(survey, privacy, feedbackAllData, l10n) {
    const content = [];
    for (const feed of feedbackAllData) {
        const data = feed.feedback;
        const productUid = data.productUid || '--';
        const body = [
            `${feed.clientid}${String.fromCharCode(8)}`,
            productUid.length === 1 ? '--' : productUid,
            data.locale || ''];
        survey.forEach((que, idx) => {
            const num = idx + 1;
            const feedbackQue = data[`Q${num}`];
            if (feedbackQue) {
                let i = 0;
                const chk = [];
                switch (que.type) {
                case 'checkbox':
                    que.data.forEach((opt, optIdx) => {
                        if (feedbackQue.data[optIdx].label === ' ') {
                            // user didnot choose this option
                            chk.push(feedbackQue.data[optIdx].label);
                        } else {
                            chk.push(l10n[feedbackQue.data[optIdx].value] ||
                                feedbackQue.data[optIdx].label);
                            i ++;
                        }
                        if (opt.hasOwnProperty('input')) {
                            chk.push(feedbackQue.data[optIdx].input);
                        }
                    });
                    body.push(i.toString());
                    body.push(...chk);
                    break;
                case 'radio':
                    body.push(l10n[feedbackQue.data[0].value] ||
                        feedbackQue.data[0].label);
                    for (const opt of que.data) {
                        if (opt.hasOwnProperty('input')) {
                            body.push(feedbackQue.data[0].hasOwnProperty('input') ?
                                feedbackQue.data[0].input : '');
                            break;
                        }
                    }
                    break;
                case 'rating':
                    body.push(l10n[feedbackQue.data[0].value] ||
                        feedbackQue.data[0].label);
                    if (que.hasOwnProperty('input')) {
                        body.push(feedbackQue.data[0].hasOwnProperty('input') ?
                            feedbackQue.data[0].input : '');
                    }
                    break;
                case 'text':
                case 'textarea':
                    body.push(feedbackQue.data[0].input || '');
                    break;
                default:
                }
            } else {
                // if no feedback in this one question
                body.push('');
                switch (que.type) {
                case 'checkbox':
                    que.data.forEach((opt) => {
                        body.push('');
                        if (opt.hasOwnProperty('input')) {
                            body.push('');
                        }
                    });
                    break;
                case 'radio':
                    for (const opt of que.data) {
                        if (opt.hasOwnProperty('input')) {
                            body.push('');
                            break;
                        }
                    }
                    break;
                case 'rating':
                    if (que.hasOwnProperty('input')) {
                        body.push('');
                    }
                    break;
                case 'text':
                case 'textarea':
                default:
                }
            }
        });
        if (privacy) {
            body.push(
                data.hasOwnProperty('thankyou') ?
                data.thankyou.privacy.input :
                ''
            );
        }
        body.push(moment(feed.datetime).format('LLL'));

        content.push(body);
    }

    return content;
}

export function exportSurvey() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_REPORT });
        const { account, selectedUser, selectedSurveys, token } = getState();
        // export selected user account or user's account
        const accountid = selectedUser.hasOwnProperty('accountid') ?
            selectedUser.accountid : account.accountid;
        return fetch(
            `${Config.baseURL}/api/v1/mgnt/report/${accountid}/${selectedSurveys}`, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    authorization: token
                }
            })
            .then(response => response.json())
            .then(report => {
                const survey = report.survey.content;
                const l10n = report.hasOwnProperty('l10n') ?
                    report.l10n[report.l10n.basic] : {};
                const feedback = report.data;
                const privacy = report.survey.thankyou.privacy.hasOwnProperty('label');

                let allSurvey = [];
                survey.forEach((page) => {
                    allSurvey = [...allSurvey, ...page.question];
                });

                Mixins.exportCSV(
                    `[Qustom]${report.subject}_${moment(Date.now()).format('YYYYMMDDHHmmss')}`,
                    'v2',
                    handleReportHeader(allSurvey, privacy, l10n),
                    handleReportContent(allSurvey, privacy, feedback, l10n)
                );
                dispatch(receiveReportSuccess());
            })
            .catch(err => dispatch(receiveReportFailure(err)));
    };
}

export function postCopiedSurveySuccess() {
    return {
        type: types.POST_COPIEDSURVEY_SUCCESS
    };
}

export function postCopiedSurveyFailure(err) {
    return {
        type: types.POST_COPIEDSURVEY_FAILURE,
        errorMsg: err
    };
}

export function postCopiedSurvey(questions) {
    return (dispatch, getState) => {
        const { account, token } = getState();
        const postData = {
            subject: questions.subject,
            survey: questions.survey,
            l10n: questions.l10n || {}
        };

        return postSurvey(account.accountid, postData, token)
            .then(response => response.json())
            .then(data => {
                if (data.surveyid) {
                    dispatch(postCopiedSurveySuccess());
                    dispatch(getSurveys());
                } else {
                    dispatch(postCopiedSurveyFailure(data));
                }
            })
            .catch(err => dispatch(postCopiedSurveyFailure(err)));
    };
}

export function copySurvey() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_COPY_SURVEY });
        const { account, selectedSurveys } = getState();

        return getOneSurvey(account.accountid, selectedSurveys)
            .then(response => response.json())
            .then(data => {
                if (data.surveyid) {
                    dispatch(postCopiedSurvey(data));
                } else {
                    dispatch(receiveQuestionsFailure(data));
                }
            })
            .catch(err => dispatch(receiveQuestionsFailure(err)));
    };
}

export function requestDeleteAllFeedbacksFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.DELETE_ALLFEEDBACKS_FAILURE,
            errorMsg: err
        });
    };
}

export function receiveDeleteAllFeedbacksSuccess() {
    return {
        type: types.DELETE_ALLFEEDBACKS_SUCCESS
    };
}

export function deleteAllFeedbacks() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_DELETE_ALLFEEDBACKS });
        const { selectedSurveys, token } = getState();
        return fetch(
            `${Config.baseURL}/api/v1/mgnt/feedbacks/${selectedSurveys}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                    authorization: token
                }
            })
            .then(response => response.json())
            .then(() => {
                dispatch(receiveDeleteAllFeedbacksSuccess());
                dispatch(getSurveys());
            })
            .catch(err => dispatch(requestDeleteAllFeedbacksFailure(err)));
    };
}
