
import * as types from '../constants/ActionTypes';

import Config from '../config';
// import { push } from 'react-router-redux';
import { openEdit } from './editSubject';
import { postSurvey, setSurveyID, saveQuestion } from './questions';
import { expiredToken } from './account';
import { setWebpage } from './webpage';

export function setSubject(data, lang = 'en-US') {
    return {
        type: types.SET_SUBJECT,
        subject: data,
        lang: lang
    };
}

export function setSubjectSuccess() {
    return {
        type: types.SET_SUBJECT_SUCCESS
    };
}

export function setSubjectFailure(err) {
    return (dispatch) => {
        dispatch(openEdit(false));
        dispatch(expiredToken());
        dispatch({
            type: types.SET_SUBJECT_FAILURE,
            errorMsg: err
        });
    };
}

export function saveSubject(subject, lang) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_SET_SUBJECT });
        const { account, surveyPolicy, token } = getState();
        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: [],
                thankyou: surveyPolicy
            },
            l10n: {
                basic: lang,
                [lang]: {
                    subject
                }
            }
        };

        dispatch(setSubject(subject, lang));
        return postSurvey(account.accountid, postData, token)
            .then(response => response.data)
            .then(data => {
                if (data.surveyid) {
                    dispatch(setSurveyID(data.surveyid));
                    dispatch(openEdit(false));
                    dispatch(setSubjectSuccess());
                    // TODOS: temporarily remove router
                    // dispatch(push('/create'));
                    dispatch(setWebpage('create'));
                } else {
                    dispatch(setSubjectFailure(data));
                }
            })
            .catch(err => dispatch(setSubjectFailure(err)));
    };
}

export function editSubject(subject, lang) {
    return (dispatch) => {
        dispatch(setSubject(subject, lang));
        dispatch(saveQuestion())
        .then(() => {
            dispatch(openEdit(false));
        });
    };
}
