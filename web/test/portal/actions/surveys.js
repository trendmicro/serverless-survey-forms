import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/surveys';
import * as types from '../../../portal/src/constants/ActionTypes';
import Config from '../../../portal/src/config';

DomMock('<html><body></body></html>');
const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] surveys action', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to save surveys failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.RECEIVE_SURVEYS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.requestSurveysFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to save surveys success', () => {
        expect(
            actions.receiveSurveysSuccess([])
        ).toEqual({
            type: types.RECEIVE_SURVEYS_SUCCESS,
            surveys: []
        });
    });

    it('should create an action to get surveys', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const selectedUser = {};
        const token = 'xxxxxxx';
        const surveys = [
            {
                accountid: 'facebook-00000',
                subject: 'I am Questionnaire',
                surveyid: '11111-0000-2222-3333',
                datetime: 1470380181870,
                count: 10
            },{
                accountid: 'facebook-00000',
                subject: 'TODOS',
                surveyid: '2222-3333-4444-0000',
                datetime: 1470301920229,
                count: 0
            } ];

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .get(`/api/v1/mgnt/surveys/${account.accountid}`)
        .reply(200, {
            surveys: surveys
        });

        const store = mockStore({
            account,
            selectedUser,
            token
        });
        const expectedActions = [
            { type: types.REMOVE_SELECTED_SURVEYS },
            { type: types.REQUEST_SURVEYS_LIST },
            { type: types.RECEIVE_SURVEYS_SUCCESS, surveys }
        ];

        return store.dispatch(actions.getSurveys())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to toggle selected surveys', () => {
        const selectedSurveys = '11111-0000-2222-3333';
        const store = mockStore({ selectedSurveys });

        store.dispatch(actions.toggleSelectedSurveys(selectedSurveys));
        expect(
            store.getActions()
        ).toEqual(
            [ { type: types.REMOVE_SELECTED_SURVEYS } ]
        );
        store.clearActions();

        const toggleSurveys = '2222-3333-4444-0000';
        store.dispatch(actions.toggleSelectedSurveys(toggleSurveys));
        expect(
            store.getActions()
        ).toEqual(
            [ { type: types.ADD_SELECTED_SURVEYS,
                selectedSurveys: toggleSurveys } ]
        );
    });

    it('should create an action to delete surveys failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.RECEIVE_DELETE_SURVEYS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.requestDeleteSurveysFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to delete surveys success', () => {
        expect(
            actions.receiveDeleteSurveysSuccess()
        ).toEqual({ type: types.RECEIVE_DELETE_SURVEYS_SUCCESS });
    });

    it('should create an action to delete survey', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const selectedUser = {};
        const selectedSurveys = '11111-0000-2222-3333';
        const token = 'xxxxxxx';

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/surveys/${account.accountid}/${selectedSurveys}`, 'DELETE')
        .reply(200, {});

        const store = mockStore({
            account,
            selectedUser,
            selectedSurveys,
            token
        });
        const expectedActions = [
            { type: types.REQUEST_DELETE_SURVEYS },
            { type: types.RECEIVE_DELETE_SURVEYS_SUCCESS },
            { type: types.REMOVE_SELECTED_SURVEYS },
            { type: types.REMOVE_SELECTED_SURVEYS },
            { type: types.REQUEST_SURVEYS_LIST }
        ];

        return store.dispatch(actions.deleteSurvey())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to export surveys failure', () => {
        expect(
            actions.receiveReportFailure('Error')
        ).toEqual({ type: types.RECEIVE_REPORT_FAILURE, errorMsg: 'Error' });
    });

    it('should create an action to export surveys success', () => {
        expect(
            actions.receiveReportSuccess()
        ).toEqual({ type: types.RECEIVE_REPORT_SUCCESS });
    });

    it('should create an action to handle export surveys header', () => {
        const question = [
            {
                id: '1AN2AL0F9BNA7A',
                type: 'rating',
                label: 'Question 1',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                input: 'Please input the reason',
                required: false
            }, {
                id: '1AN2AL0F9AQ7AC',
                type: 'checkbox',
                label: 'Question 2',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'option A' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'option B', input: 'Tell me' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BNABC',
                type: 'radio',
                label: 'Question 3',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied', input: 'Why' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BGG1A',
                type: 'text',
                label: 'Question 4',
                input: 'Please type here',
                required: false
            }, {
                id: '1AN2AL0F9BAREA',
                type: 'textarea',
                label: 'Question 5',
                input: 'Please type here',
                required: false
            }];
        expect(
            actions.handleReportHeader(question, true, {})
        ).toEqual([
            ['Client ID', 'Product Uid', 'Locale', 'Q1_Question 1', 'Please input the reason',
            'Q2_Question 2', 'option A', 'option B', 'Tell me', 'Q3_Question 3', 'Why',
            'Q4_Question 4', 'Q5_Question 5', 'Privacy email', 'Feedback time']
        ]);
    });

    it('should create an action to handle export surveys content', () => {
        const question = [
            {
                id: '1AN2AL0F9BNA7A',
                type: 'rating',
                label: 'Question 1',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                input: 'the reason',
                required: false
            }, {
                id: '1AN2AL0F9AQ7AC',
                type: 'checkbox',
                label: 'Question 2',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'option A' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'option B', input: 'Why' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BNABC',
                type: 'radio',
                label: 'Question 3',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied', input: 'Why' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BGG1A',
                type: 'text',
                label: 'Question 4',
                input: 'Please type here',
                required: false
            }, {
                id: '1AN2AL0F9BAREA',
                type: 'textarea',
                label: 'Question 5',
                input: 'Please type here',
                required: false
            }];
        const feedback = [{
            clientid: '11112222',
            datetime: 1475233633672,
            feedback: {
                productUid: 'xxxxxxx',
                Q1: {
                    label: 'Question 1',
                    type: 'rating',
                    data: [{
                        value: '1APPJND2CYBHCD9V0FEBA',
                        label: 'Satisfied',
                        input: 'the reason'
                    }],
                },
                Q2: {
                    label: 'Question 2',
                    type: 'checkbox',
                    data: [
                        { value: '1APPJND2CYA3FQEBJ3K7O', label: 'option A' },
                        { value: '1APPJND2CYBHCD9V0FEBA', label: 'option B', input: 'option B\'s input' }
                    ]
                },
                Q3: {
                    label: 'Question 3',
                    type: 'radio',
                    data: [{
                        value: '1APPJND2CYA3FQEBJ3K7O',
                        label: 'Dissatisfied',
                        input: 'radio\'s input'
                    }]
                },
                Q4: {
                    label: 'Question 4',
                    type: 'text',
                    data: [{
                        input: 'Single line input'
                    }]
                },
                Q5: {
                    label: 'Question 5',
                    type: 'textarea',
                    data: [{
                        input: 'Multiline input'
                    }]
                }
            }
        }];

        const result = actions.handleReportContent(question, false, feedback, {});
        result[0].pop();
        expect(
            result
        ).toEqual([
            ['11112222\b', 'xxxxxxx', '', 'Satisfied', 'the reason', '2', 'option A',
            'option B', 'option B\'s input', 'Dissatisfied', 'radio\'s input',
            'Single line input', 'Multiline input']
        ]);
    });

    it('should create an action to handle export surveys content when no data', () => {
        const question = [
            {
                id: '1AN2AL0F9BNA7A',
                type: 'rating',
                label: 'Question 1',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                input: 'Why',
                required: false
            }, {
                id: '1AN2AL0F9AQ7AC',
                type: 'checkbox',
                label: 'Question 2',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'option A' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'option B', input: 'Why' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BNABC',
                type: 'radio',
                label: 'Question 3',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied', input: 'Why' }
                ],
                required: false
            }, {
                id: '1AN2AL0F9BGG1A',
                type: 'text',
                label: 'Question 4',
                input: 'Please type here',
                required: false
            }, {
                id: '1AN2AL0F9BAREA',
                type: 'textarea',
                label: 'Question 5',
                input: 'Please type here',
                required: false
            }];
        const feedback = [{
            clientid: '11112222',
            datetime: 1475233633672,
            feedback: {}
        }];
        const result = actions.handleReportContent(question, true, feedback);
        result[0].pop();
        expect(
            result
        ).toEqual([
            ['11112222\b', '--', '', '', '', '', '', '', '', '', '', '', '', '']
        ]);
    });

    it('should create an action to export survey', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const selectedUser = {};
        const selectedSurveys = '11111-0000-2222-3333';
        const token = 'xxxxxxx';

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .get(`/api/v1/mgnt/report/${account.accountid}/${selectedSurveys}`)
        .reply(200, {
            accountid: account.accountid,
            surveyid: selectedSurveys,
            subject: 'Hello World',
            datetime: Date.now(),
            survey: {
                content: [
                    {
                        page: 1,
                        description: 'I am Page 1',
                        question: [{
                            id: '1AN2AL0F9BNA7A',
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
            },
            data:[]
        });

        const store = mockStore({
            account,
            selectedUser,
            selectedSurveys,
            token
        });
        const expectedActions = [
            { type: types.REQUEST_REPORT },
            { type: types.RECEIVE_REPORT_SUCCESS }
        ];

        return store.dispatch(actions.exportSurvey())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to duplicate surveys failure', () => {
        expect(
            actions.postCopiedSurveyFailure('Error')
        ).toEqual({ type: types.POST_COPIEDSURVEY_FAILURE, errorMsg: 'Error' });
    });

    it('should create an action to duplicate surveys success', () => {
        expect(
            actions.postCopiedSurveySuccess()
        ).toEqual({ type: types.POST_COPIEDSURVEY_SUCCESS });
    });

    it('should create an action to post copied survey', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const subject = 'Hello World';
        const surveyID = '1111-2222-3333';
        const surveyPolicy = {};
        const token = 'xxxxxxx';
        const postData = {
            subject: subject,
            survey: {
                content: [],
                thankyou: surveyPolicy
            },
            l10n: {}
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .post(`/api/v1/mgnt/surveys/${account.accountid}`, JSON.stringify(postData))
        .reply(200, {
            surveyid: surveyID,
            datetime: Date.now()
        });
        const store = mockStore({
            account,
            surveyPolicy,
            selectedUser: {},
            token
        });
        const expectedActions = [
            { type: types.POST_COPIEDSURVEY_SUCCESS },
            { type: types.REMOVE_SELECTED_SURVEYS },
            { type: types.REQUEST_SURVEYS_LIST }
        ];

        return store.dispatch(actions.postCopiedSurvey({ subject, survey: { content: [], thankyou: surveyPolicy } }))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to duplicate survey', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const subject = 'Hello';
        const selectedSurveys = '1111-2222-3333';
        const questions = [{
            page: 1,
            description: 'I am Page 1',
            question: [{
                id: '1AN2AL0F9BNA7A',
                type: 'rating',
                label: 'Testing question text',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
                ],
                input: 'Tell us the reason why you choose this answer',
                required: false
            }]
        }];

        nock(Config.baseURL, {
            reqheaders: { 'Cache-Control': 'max-age=0' }
        })
        .get(`/api/v1/surveys/${account.accountid}/${selectedSurveys}`)
        .reply(200, {
            surveyid: selectedSurveys,
            subject,
            survey: {
                content: questions,
                thankyou: {}
            }
        });

        const store = mockStore({ account, selectedSurveys });
        const expectedActions = [
            { type: types.REQUEST_COPY_SURVEY }
        ];

        return store.dispatch(actions.copySurvey())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to delete all feedbacks failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.DELETE_ALLFEEDBACKS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.requestDeleteAllFeedbacksFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to delete all feedbacks success', () => {
        expect(
            actions.receiveDeleteAllFeedbacksSuccess()
        ).toEqual({ type: types.DELETE_ALLFEEDBACKS_SUCCESS });
    });

    it('should create an action to delete all feedbacks', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const selectedUser = {};
        const token = 'xxxxxxx';
        const surveys = [
            {
                accountid: 'facebook-00000',
                subject: 'I am Questionnaire',
                surveyid: '11111-0000-2222-3333',
                datetime: 1470380181870,
                count: 10
            },{
                accountid: 'facebook-00000',
                subject: 'TODOS',
                surveyid: '2222-3333-4444-0000',
                datetime: 1470301920229,
                count: 0
            } ];
        const selectedSurveys = '11111-0000-2222-3333';

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/feedbacks/${selectedSurveys}`, 'DELETE')
        .reply(200, {});

        const store = mockStore(
            {
                account,
                selectedSurveys,
                selectedUser,
                token
            });
        const expectedActions = [
            { type: types.REQUEST_DELETE_ALLFEEDBACKS },
            { type: types.DELETE_ALLFEEDBACKS_SUCCESS },
            { type: types.REMOVE_SELECTED_SURVEYS },
            { type: types.REQUEST_SURVEYS_LIST }
        ];

        return store.dispatch(actions.deleteAllFeedbacks())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });
});
