
import axios from 'axios';

import * as types from '../constants/ActionTypes';
import Config from '../config';
import { expiredToken } from './account';

export function receiveSubscribersFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.RECEIVE_SUBSCRIBERS_FAILURE,
            errorMsg: err
        });
    };
}

export function receiveSubscribersSuccess(data) {
    return {
        type: types.RECEIVE_SUBSCRIBERS_SUCCESS,
        subscribers: data
    };
}

export function getSubscribers() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_SUBSCRIBERS_LIST });
        const { token, surveyID } = getState();
        return axios(`${Config.baseURL}/api/v1/mgnt/subscribers/${surveyID}`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                authorization: token
            }
        })
        .then(response => {
            if (response.status >= 400) {
                return {};
            }
            return response.data;
        })
        .then(data => {
            if (data.hasOwnProperty('email')) {
                dispatch(receiveSubscribersSuccess(data.email));
            } else {
                dispatch(receiveSubscribersSuccess([]));
            }
        })
        .catch(err => dispatch(receiveSubscribersFailure(err)));
    };
}

export function addSubscribersFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.ADD_SUBSCRIBERS_FAILURE,
            errorMsg: err
        });
    };
}

export function addSubscribersSuccess(data) {
    return {
        type: types.ADD_SUBSCRIBERS_SUCCESS,
        subscribers: data
    };
}

export function addSubscriber(email) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_ADD_SUBSCRIBERS });
        const { token, surveyID, subscribers } = getState();
        const method = subscribers.length === 0 ? 'POST' : 'PUT';
        const newEmail = subscribers.concat(email);
        const postData = { email: newEmail };
        return axios(`${Config.baseURL}/api/v1/mgnt/subscribers/${surveyID}`, {
            method: method,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            },
            data: postData
        })
        .then(response => {
            if (response.status >= 400) {
                return [];
            }
            return newEmail;
        })
        .then(data => {
            dispatch(addSubscribersSuccess(data));
        })
        .catch(err => dispatch(addSubscribersFailure(err)));
    };
}

export function deleteSubscribersFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.DELETE_SUBSCRIBERS_FAILURE,
            errorMsg: err
        });
    };
}

export function deleteSubscribersSuccess(data) {
    return {
        type: types.DELETE_SUBSCRIBERS_SUCCESS,
        subscribers: data
    };
}

export function deleteSubscriber(email) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_DELETE_SUBSCRIBERS });
        const { token, surveyID, subscribers } = getState();
        const idx = subscribers.indexOf(email);
        const newEmail = [...subscribers];
        newEmail.splice(idx, 1);
        let method = 'DELETE';
        let postData = {};
        if (newEmail.length > 0) {
            method = 'PUT';
            postData = { email: newEmail };
        }
        return axios(`${Config.baseURL}/api/v1/mgnt/subscribers/${surveyID}`, {
            method: method,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            },
            data: postData
        })
        .then(response => {
            if (response.status >= 400) {
                return [];
            }
            return newEmail;
        })
        .then(data => {
            dispatch(deleteSubscribersSuccess(data));
        })
        .catch(err => dispatch(deleteSubscribersFailure(err)));
    };
}
