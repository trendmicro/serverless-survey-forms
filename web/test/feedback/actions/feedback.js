import '../../helpers/env';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../src/actions/feedback';
import * as types from '../../../src/constants/ActionTypes';
import Config from '../../../src/config';

const mockStore = configureStore([thunkMiddleware]);

describe('[Feedback] feedback action', () => {
    it('should create an action to set feedback', () => {
        const survey = {
            content: [
                {
                    page: 1,
                    description: 'I am Page 1',
                    question: [{
                        id: '1AN2AL0F9BNA7A',
                        order: 1,
                        type: 'rating',
                        label: 'Testing question text',
                        data: [
                            { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                            { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                        ],
                        input: 'Tell us the reason why you choose this answer',
                        required: false
                    }]
                }
            ],
            thankyou: {
                privacy: {}
            },
            format: 'v1'
        };
        const feedback = {
            Q1: {
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                required: false
            }
        };

        expect(
            actions.setFeedback(survey)
        ).toEqual({
            type: types.SET_FEEDBACK_FORMAT,
            feedback
        });
    });

    it('should create an action to set feedback', () => {
        const feedback = {
            Q1: {
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                label: "1B2NAJM077LSHAIE6RY4Z",
                type:"checkbox"
            }
        };
        expect(
            actions.recordFeedback(feedback)
        ).toEqual({
            type: types.RECORD_FEEDBACK,
            feedback
        });
    });

    it('should create an action to save clientID', () => {
        expect(
            actions.saveClientID('12345678')
        ).toEqual({
            type: types.SAVE_CLIENT_ID,
            clientID: '12345678'
        });
    });

    it('should create an action to update feedback', () => {
        const clientID = 'chrome1111';
        const settings = {
            accountid: "facebook-xxxxxx",
            locale: "zh-TW",
            preview: false,
            surveyid: "1111-2222-3333-4444",
            type: "default"
        };
        const submit = {
            Q1: {
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                label: "1B2NAJM077LSHAIE6RY4Z",
                type:"checkbox"
            }
        };
        const prefillData = {};
        const postData = {
            feedback: Object.assign({}, submit, { locale: settings.locale, productUid: ' ' })
        };
        nock(Config.baseURL)
        .intercept(`/api/v1/feedbacks/${settings.surveyid}/${clientID}`, 'PUT', JSON.stringify(postData))
        .reply(200, { datetime: Date.now() });

        const store = mockStore({ clientID, settings, submit, prefillData });
        const expectedActions = [];
        return store.dispatch(actions.updateFeedback())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to set requiredData', () => {
        const requiredData = [{
            done: true,
            id: "1B2NAJM077LSHAIE6RY4Z",
            order: 1,
            required: true
        }];
        expect(
            actions.setRequiredData(requiredData)
        ).toEqual({
            type: types.SET_REQUIRED_DATA,
            requiredData
        });
    });

    it('should create an action to set PageDone', () => {
        expect(
            actions.setPageDone("init")
        ).toEqual({
            type: types.SET_PAGE_DONE,
            done: "init"
        });
    });

    it('should create an action to set required', () => {
        const survey = {
            content: [
                {
                    page: 1,
                    description: 'I am Page 1',
                    question: [{
                        id: '1AN2AL0F9BNA7A',
                        order: 1,
                        type: 'rating',
                        label: 'Testing question text',
                        data: [
                            { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                            { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                        ],
                        input: 'Tell us the reason why you choose this answer',
                        required: true
                    }]
                }
            ],
            thankyou: {
                privacy: {}
            },
            format: 'v1'
        };
        const requiredData = [{
            done: false,
            id: "1AN2AL0F9BNA7A",
            order: 1,
            required: true
        }];

        const store = mockStore({ survey });
        const expectedActions = [
            { type: types.SET_REQUIRED_DATA, requiredData },
            { type: types.SET_PAGE_DONE, done: 'init' }
        ];
        store.dispatch(actions.setRequired(1));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to check required', () => {
        const requiredData = [{
            done: true,
            id: "1AN2AL0F9BNA7A",
            order: 1,
            required: true
        }];
        const settings = {
            accountid: "facebook-xxxxxx",
            locale: "zh-TW",
            preview: false,
            surveyid: "1111-2222-3333-4444",
            type: "default"
        };
        const prefillData = {};
        const store = mockStore({ requiredData, settings, prefillData });

        store.dispatch(actions.checkRequired("done", 0));
        const expectedActions = [
            { type: types.SET_PAGE_DONE, done: true },
            { type: types.SURVEY_DONE }
        ];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to update required', () => {
        const requiredData = [{
            done: false,
            id: "1AN2AL0F9BNA7A",
            order: 1,
            required: true
        }];
        const store = mockStore({ requiredData });

        store.dispatch(actions.updateRequired(1, true));
        const expectedActions = [
            {
                type: types.SET_REQUIRED_DATA,
                requiredData: [{
                    done: true,
                    id: "1AN2AL0F9BNA7A",
                    order: 1,
                    required: true
                }]
            }];
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to check done', () => {
        const requiredData = [{
            done: true,
            id: "1AN2AL0F9BNA7A",
            order: 1,
            required: true
        }];
        const store = mockStore({ requiredData });
        expect(
            store.dispatch(actions.checkDone("1AN2AL0F9BNA7A"))
        ).toEqual(true);
    });
});
