import '../../helpers/env';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/subscribers';
import * as types from '../../../portal/src/constants/ActionTypes';
import Config from '../../../portal/src/config';

const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] subscribers action', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to get subscribers failure', () => {
        const store = mockStore({ });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.RECEIVE_SUBSCRIBERS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.receiveSubscribersFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to get subscribers success', () => {
        const subscribers = ['aaa@aaa.com', 'bbb@bb.com'];
        expect(
            actions.receiveSubscribersSuccess(subscribers)
        ).toEqual({
            type: types.RECEIVE_SUBSCRIBERS_SUCCESS,
            subscribers
        });
    });

    it('should create an action to get subscribers', () => {
        const token = 'xxxxxxx';
        const subscribers = ['aaa@aaa.com', 'bbb@bb.com'];
        const surveyID = 'xxx-yyy-zzz';

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .get(`/api/v1/mgnt/subscribers/${surveyID}`)
        .reply(200, { email: subscribers });

        const store = mockStore({ token, surveyID });
        const expectedActions = [
            { type: types.REQUEST_SUBSCRIBERS_LIST },
            { type: types.RECEIVE_SUBSCRIBERS_SUCCESS, subscribers }
        ];

        return store.dispatch(actions.getSubscribers())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to add subscribers failure', () => {
        const store = mockStore({ });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.ADD_SUBSCRIBERS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.addSubscribersFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to add subscribers success', () => {
        const subscribers = ['aaa@aaa.com', 'bbb@bb.com'];
        expect(
            actions.addSubscribersSuccess(subscribers)
        ).toEqual({
            type: types.ADD_SUBSCRIBERS_SUCCESS,
            subscribers
        });
    });

    it('should create an action to add subscribers', () => {
        const token = 'xxxxxxx';
        const subscribers = [];
        const surveyID = 'xxx-yyy-zzz';
        const newEmail = subscribers.concat('ccc@ccc.com');
        const postData = Object.assign({}, { email: newEmail });

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/subscribers/${surveyID}`, 'POST', postData)
        .reply(200, {});

        const store = mockStore({ token, surveyID, subscribers });
        const expectedActions = [
            { type: types.REQUEST_ADD_SUBSCRIBERS },
            {
                type: types.ADD_SUBSCRIBERS_SUCCESS,
                subscribers: newEmail
            }
        ];

        return store.dispatch(actions.addSubscriber('ccc@ccc.com'))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to delete subscribers failure', () => {
        const store = mockStore({ });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.DELETE_SUBSCRIBERS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.deleteSubscribersFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to delete subscribers success', () => {
        const subscribers = ['aaa@aaa.com', 'bbb@bb.com'];
        expect(
            actions.deleteSubscribersSuccess(subscribers)
        ).toEqual({
            type: types.DELETE_SUBSCRIBERS_SUCCESS,
            subscribers
        });
    });

    it('should create an action to delete subscribers', () => {
        const token = 'xxxxxxx';
        const subscribers = ['aaa@aaa.com'];
        const surveyID = 'xxx-yyy-zzz';
        const newEmail = 'aaa@aaa.com';

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/subscribers/${surveyID}`, 'DELETE', {})
        .reply(200, {});

        const store = mockStore({ token, surveyID, subscribers });
        const expectedActions = [
            { type: types.REQUEST_DELETE_SUBSCRIBERS },
            {
                type: types.DELETE_SUBSCRIBERS_SUCCESS,
                subscribers: []
            }
        ];

        return store.dispatch(actions.deleteSubscriber(newEmail))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });
});
