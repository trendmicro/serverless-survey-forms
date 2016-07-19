
import * as types from '../constants/ActionTypes';
import fetch from 'isomorphic-fetch';
import Config from '../config';
import * as fetchAccounts from './account';

function setToken(data) {
    return {
        type: types.SET_TOKEN,
        token: data
    };
}

export function verifyToken(token) {
    return (dispatch) => {
        return fetch(`${Config.baseURL}/mgnt/users/verify`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                // Authenticated: token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.hasOwnProperty('accountid') && data.accountid) {
                dispatch(setToken(token));
                dispatch(fetchAccounts.receiveAccountSuccess(data));
            } else {
                console.log('token expired')
                // token no used: token expired / user doesn't have a account
                dispatch(fetchAccounts.receiveAccountFailure(data));
            }
        })
        .catch(err => {
            console.log('Verify token error');
            dispatch(fetchAccounts.receiveAccountFailure(err.responseJSON));
        });
    };
}