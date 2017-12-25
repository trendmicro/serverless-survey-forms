import '../../helpers/env';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/users';
import * as types from '../../../portal/src/constants/ActionTypes';
import Config from '../../../portal/src/config';

const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] users action', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to get users failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.RECEIVE_USERS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.requestUsersFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to get users success', () => {
        const users = [
            {
                accountid: 'facebook-XXXXXX',
                username: 'Mr. Cheng',
                email: 'cheng@trend.com.tw',
                role: 'User'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. Wang',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }, {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Miss Lin',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }];
        expect(
            actions.receiveUsersSuccess(users)
        ).toEqual({
            type: types.RECEIVE_USERS_SUCCESS,
            users: users
        });
    });

    it('should create an action to get users', () => {
        const token = 'xxxxxxx';
        const users = [
            {
                accountid: 'facebook-XXXXXX',
                username: 'Mr. Cheng',
                email: 'cheng@trend.com.tw',
                role: 'User'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. Wang',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }, {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Miss Lin',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }];

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .get('/api/v1/mgnt/users')
        .reply(200, { users });

        const store = mockStore({ token });
        const expectedActions = [
            { type: types.REQUEST_USERS_LIST },
            { type: types.RECEIVE_USERS_SUCCESS, users }
        ];

        return store.dispatch(actions.getUsers())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to change user\'s role failure', () => {
        expect(
            actions.changeUserRoleFailure('Error')
        ).toEqual({
            type: types.RECEIVE_CHANGE_ROLE_FAILURE,
            errorMsg: 'Error'
        });
    });

    it('should create an action to change user\'s role success', () => {
        const users = [
            {
                accountid: 'facebook-XXXXXX',
                username: 'Mr. Cheng',
                email: 'cheng@trend.com.tw',
                role: 'User'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. Wang',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }, {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Miss Lin',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }];
        expect(
            actions.changeUserRoleSuccess(users)
        ).toEqual({
            type: types.RECEIVE_CHANGE_ROLE_SUCCESS,
            users: users
        });
    });

    it('should create an action to change user\'s role', () => {
        const token = 'xxxxxxx';
        const users = [
            {
                accountid: 'facebook-XXXXXX',
                username: 'Mr. Cheng',
                email: 'cheng@trend.com.tw',
                role: 'Admin'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. Wang',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }, {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Miss Lin',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }];
        const postData = Object.assign({}, users[0], { role: 'Designer' });

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept('/api/v1/mgnt/users/', 'PUT', postData)
        .reply(200, {});

        const store = mockStore({ users, token });
        const expectedActions = [
            { type: types.REQUEST_CHANGE_ROLE },
            {
                type: types.RECEIVE_CHANGE_ROLE_SUCCESS,
                users: [
                    {
                        accountid: 'facebook-XXXXXX',
                        username: 'Mr. Cheng',
                        email: 'cheng@trend.com.tw',
                        role: 'Designer'
                    }, {
                        accountid: 'facebook-YYYYYY',
                        username: 'Mr. Wang',
                        email: 'wang@trend.com.tw',
                        role: 'Designer'
                    }, {
                        accountid: 'facebook-ZZZZZZZ',
                        username: 'Miss Lin',
                        email: 'lin@trend.com.tw',
                        role: 'Admin'
                    } ]
            }
        ];

        return store.dispatch(actions.changeUserRole(0, 'Designer'))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to change user\'s role when he is the last Admin', () => {
        const token = 'xxxxxxx';
        const users = [
            {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Miss Lin',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. Wang',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }];
        const store = mockStore({ users, token });
        const expectedActions = [
            { type: types.REQUEST_CHANGE_ROLE },
            {
                type: types.RECEIVE_CHANGE_ROLE_FAILURE,
                errorMsg: 'this is the last Admin'
            }
        ];

        store.dispatch(actions.changeUserRole(0, 'Designer'));
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });

    it('should create an action to set selected user', () => {
        const selectedUser = 'facebook-XXXXXX';
        expect(
            actions.setSelectedUser(selectedUser)
        ).toEqual({
            type: types.SET_SELECTED_USER,
            selectedUser
        });
    });

    it('should create an action to empty selected user', () => {
        const store = mockStore({});
        const expectedActions = [
            { type: types.RECEIVE_SURVEYS_SUCCESS, surveys: [] },
            { type: types.SET_SELECTED_USER, selectedUser: {} }
        ];
        store.dispatch(actions.emptySelectedUser());
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });
});
