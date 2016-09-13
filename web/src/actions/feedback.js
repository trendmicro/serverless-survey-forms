import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import config from '../config';
import * as surveyActions from './survey';

/* eslint no-use-before-define: [2, { "functions": false }] */

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function setFeedback(survey) {
    let questions = [];
    let surveyContent = survey.content;
    surveyContent = surveyContent.forEach((page) => {
        questions = questions.concat(page.question);
    });
    const feedback = {};
    questions.forEach((qitem) => {
        feedback[`Q${qitem.order}`] = {};
        feedback[`Q${qitem.order}`].data = qitem.data;
        feedback[`Q${qitem.order}`].required = qitem.required;
    });
    return {
        type: types.SET_FEEDBACK_FORMAT,
        feedback
    };
}

// Record ongoing feedback data to store
export function recordFeedback(feedback) {
    return {
        type: types.RECORD_FEEDBACK,
        feedback
    };
}

function saveClientID(clientID) {
    return {
        type: types.SAVE_CLIENT_ID,
        clientID
    };
}

export function saveFeedback() {
    const clientID = `${getRandomArbitrary(1000, 9999)}${new Date().getTime()}`;
    return (dispatch, getState) => {
        const feedback = getState().submit;
        const surveyid = getState().settings.surveyid;
        dispatch(saveClientID(clientID));
        return fetch(`${config.baseURL}/api/v1/feedbacks/${surveyid}/${clientID}`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                feedback: feedback
            })
        })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            console.log(`POST Feedback from ${clientID}`, response);
            // TODO: postMessage to client
            // window.parent.postMessage(`POST Feedback from ${clientID}`,
                // window.parent.location.origin);
        });
    };
}

export function updateFeedback(closeWhenDone, privacyData) {
    return (dispatch, getState) => {
        const feedback = getState().submit;
        const surveyid = getState().settings.surveyid;
        const clientID = getState().clientID;
        const submittedData = {
            feedback: feedback
        };
        // Privacy data
        if (privacyData) {
            feedback.thankyou = privacyData;
        }
        return fetch(`${config.baseURL}/api/v1/feedbacks/${surveyid}/${clientID}`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submittedData)
        })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error('Bad response from server');
            }
            console.log(`UPDATE Feedback from ${clientID}`, response);
            if (closeWhenDone) {
                window.parent.postMessage({
                    source: window.location.origin,
                    msg: 'close'
                }, '*');
            }
        });
    };
}

function setRequiredData(requiredData) {
    return {
        type: types.SET_REQUIRED_DATA,
        requiredData

    };
}

function setPageDone(done) {
    return {
        type: types.SET_PAGE_DONE,
        done
    };
}

export function setRequired(page = 1) {
    return (dispatch, getState) => {
        const requiredData = getState().survey.content[page - 1].question.map((item) => {
            const updatedItem = {};
            updatedItem.order = item.order;
            updatedItem.required = item.required;
            updatedItem.done = false;
            return updatedItem;
        });
        dispatch(setRequiredData(requiredData));
    };
}

export function checkRequired(action, page) {
    return (dispatch, getState) => {
        let done = true;
        getState().requiredData.forEach((item) => {
            if (item.required && !item.done) {
                done = false;
            }
        });
        dispatch(setPageDone(done));
        if (done || action === 'prev') {
            switch (action) {
            case 'prev':
                if (page) {
                    dispatch(surveyActions.goToPage(page));
                    dispatch(setRequired(page));
                }
                break;
            case 'next':
                if (!getState().settings.preview) {
                    if (getState().paging === 1) {
                        dispatch(saveFeedback());
                    } else {
                        dispatch(updateFeedback());
                    }
                }
                // Send 'next' msg to client
                window.parent.postMessage({
                    source: window.location.origin,
                    msg: 'next'
                }, '*');
                if (page) {
                    dispatch(surveyActions.goToPage(page));
                    dispatch(setRequired(page));
                }
                break;
            case 'done':
                if (!getState().settings.preview) {
                    if (getState().paging === 1) {
                        dispatch(saveFeedback());
                    } else {
                        dispatch(updateFeedback());
                    }
                }
                dispatch(surveyActions.surveyDone());
                break;
            default:
                break;
            }
        }
    };
}

export function updateRequired(order, done) {
    return (dispatch, getState) => {
        const requiredData = getState().requiredData.map((item) => {
            const updatedItem = item;
            if (item.order === order) {
                updatedItem.done = done;
            }
            return updatedItem;
        });
        dispatch(setRequiredData(requiredData));
        dispatch(checkRequired());
    };
}
