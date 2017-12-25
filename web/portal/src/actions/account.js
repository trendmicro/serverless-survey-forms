
import * as types from '../constants/ActionTypes';
import axios from 'axios';
import Config from '../config';
import { finishEdit } from './questions';

export function receiveAccountSuccess(data) {
    return {
        type: types.RECEIVE_ACCOUNT_SUCCESS,
        account: data
    };
}

export function receiveAccountFailure(err) {
    return {
        type: types.RECEIVE_ACCOUNT_FAILURE,
        errorMsg: err
    };
}

export function expiredToken() {
    window.localStorage.QustomPortalTK = '';

    return (dispatch, getState) => {
        const { surveyID, subject } = getState();
        if (surveyID || subject) dispatch(finishEdit());
        dispatch({
            type: types.EXPIRED_TOKEN
        });
    };
}

export function setToken(token) {
    window.localStorage.QustomPortalTK = token;
    return {
        type: types.SET_TOKEN,
        token
    };
}

export function verifyToken(token) {
    return (dispatch) =>
        axios(`${Config.baseURL}/api/v1/mgnt/users/me`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                authorization: token
            }
        })
        .then(response => response.data)
        .then(data => {
            if (data.hasOwnProperty('accountid') && data.accountid) {
                dispatch(setToken(token));
                dispatch(receiveAccountSuccess(data));
            } else {
                // token no used: token expired / user doesn't have a account
                dispatch(receiveAccountFailure(data));
            }
        })
        .catch(err => dispatch(receiveAccountFailure(err)));
}
