
import axios from 'axios';

import * as types from '../constants/ActionTypes';
import Config from '../config';
import { expiredToken } from './account';
import { receiveSurveysSuccess } from './surveys';

export function requestUsersFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.RECEIVE_USERS_FAILURE,
            errorMsg: err
        });
    };
}

export function receiveUsersSuccess(data) {
    return {
        type: types.RECEIVE_USERS_SUCCESS,
        users: data
    };
}

export function getUsers() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_USERS_LIST });
        const { token } = getState();
        return axios(`${Config.baseURL}/api/v1/mgnt/users`, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                authorization: token
            }
        })
        .then(response => response.data)
        .then(data => {
            dispatch(receiveUsersSuccess(data.users));
        })
        .catch(err => dispatch(requestUsersFailure(err)));
    };
}

export function changeUserRoleFailure(err) {
    return {
        type: types.RECEIVE_CHANGE_ROLE_FAILURE,
        errorMsg: err
    };
}

export function changeUserRoleSuccess(data) {
    return {
        type: types.RECEIVE_CHANGE_ROLE_SUCCESS,
        users: data
    };
}

export function changeUserRole(idx, role) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_CHANGE_ROLE });
        const { users, token } = getState();
        const user = users[idx];
        // check if this user is Admin, is there any Admin
        if (user.role === 'Admin') {
            let flag = true;
            for (const oneUser of users) {
                if (oneUser.accountid !== user.accountid && oneUser.role === 'Admin') {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                // eslint-disable-next-line no-alert
                alert('You can\'t change the last Admin\'s role.');
                dispatch(changeUserRoleFailure('this is the last Admin'));
                return;
            }
        }

        const postData = {
            accountid: user.accountid,
            username: user.username,
            email: user.email,
            role: role
        };

        return axios(`${Config.baseURL}/api/v1/mgnt/users/`, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                authorization: token
            },
            data: postData
        })
        .then(() => {
            const newUsers = [...users];
            Object.assign(newUsers[idx], { role: role });
            dispatch(changeUserRoleSuccess(newUsers));
        })
        .catch(err => dispatch(changeUserRoleFailure(err)));
    };
}

export function setSelectedUser(data) {
    return {
        type: types.SET_SELECTED_USER,
        selectedUser: data
    };
}

export function emptySelectedUser() {
    return (dispatch) => {
        dispatch(receiveSurveysSuccess([]));
        dispatch(setSelectedUser({}));
    };
}
