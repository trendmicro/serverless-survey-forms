import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/questions';
import * as types from '../../../portal/src/constants/ActionTypes';
import * as values from '../../../portal/src/constants/DefaultValues';
import Config from '../../../portal/src/config';

DomMock('<html><body></body></html>');
const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] questions action', () => {
    let questions = [];
    beforeEach(() => {
        questions = [{
            page: 1,
            id: '1B02MFKVS0UXF2JYR95NQ',
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
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to set survey ID', () => {
        const surveyID = '11111-0000-2222-3333';
        expect(
            actions.setSurveyID(surveyID)
        ).toEqual({
            type: types.SET_SURVEYID,
            surveyID
        });
    });

    it('should create an action to finish edit question', () => {
        const store = mockStore({
            selectedUser: {},
            surveyL10n: {}
        });
        const expectedActions = [
            { type: types.SET_SURVEYID, surveyID: '' },
            { type: types.SET_SUBJECT, subject: '', lang: '' },
            { type: types.SET_EDITABLE },
            { type: types.REMOVE_SELECTED_L10N },
            { type: types.INIT_QUESTIONS },
            { type: types.INIT_SURVEY_POLICY },
            { type: types.SET_WEBPAGE, webpage: 'index' }
        ];

        store.dispatch(actions.finishEdit());
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });

    it('should create an action to add question', () => {
        const store = mockStore({ questions });

        store.dispatch(actions.addQuestion(1));
        const result = store.getActions();
        expect(result[0].type).toEqual(types.ADD_QUESTION);
        expect(result[0].questions[0].question.length).toEqual(2);
    });

    it('should create an action to update question', () => {
        const editQuestion = {
            id: '1AN2AL0F9BNA7A',
            type: 'radio',
            label: 'Hello World',
            data: [
                { value: '1APPJND2CYA3FQEBJ3K7O', label: 'Dissatisfied' },
                { value: '1APPJND2CYBHCD9V0FEBA', label: 'Satisfied' }
            ],
            input: 'Tell us the reason why you choose this answer',
            required: false
        };
        const store = mockStore({ questions, editQuestion });

        store.dispatch(actions.updateQuestionItem());
        const result = store.getActions();
        expect(result[0].type).toEqual(types.EDIT_QUESTION);
        expect(result[0].questions[0].question[0]).toEqual(editQuestion);
    });

    it('should create an action to copy question', () => {
        const store = mockStore({ questions });

        store.dispatch(actions.copyQuestion(1, 0));
        const result = store.getActions();
        expect(result[0].type).toEqual(types.COPY_QUESTION);

        expect(result[0].questions[0].question.length).toEqual(2);

        expect(
            result[0].questions[0].question[1].label
        ).toEqual(result[0].questions[0].question[0].label);

        expect(
            result[0].questions[0].question[1].id
        ).not.toEqual(result[0].questions[0].question[0].id);
    });

    it('should create an action to delete question', () => {
        const store = mockStore({ questions });

        store.dispatch(actions.deleteQuestion(1, 0));
        expect(
            store.getActions()
        ).toEqual([{
            type: types.DELETE_QUESTION,
            questions: [{
                page: 1,
                id: '1B02MFKVS0UXF2JYR95NQ',
                description: 'I am Page 1',
                question: []
            }]
        }]);
    });

    it('should create an action to exchange question', () => {
        const ExQuestions = [{
            page: 1,
            description: 'I am Page 1',
            question: [{
                id: 'AAAAAA',
                type: 'checkbox',
                label: 'Testing checkbox text',
                data: [],
                input: '',
                required: false
            }, {
                id: 'BBBBBB',
                type: 'rating',
                label: 'Testing rating text',
                data: [],
                input: '',
                required: false
            }]
        }];
        const store = mockStore({ questions: ExQuestions });
        store.dispatch(
            actions.exchangeQuestion(1, 1, 1, 0, {
                id: 'BBBBBB',
                type: 'rating',
                label: 'Testing rating text',
                data: [],
                input: '',
                required: false
            })
        );
        expect(
            store.getActions()
        ).toEqual([{
            type: types.EXCHANGE_QUESTION,
            questions: [{
                page: 1,
                description: 'I am Page 1',
                question: [{
                    id: 'BBBBBB',
                    type: 'rating',
                    label: 'Testing rating text',
                    data: [],
                    input: '',
                    required: false
                }, {
                    id: 'AAAAAA',
                    type: 'checkbox',
                    label: 'Testing checkbox text',
                    data: [],
                    input: '',
                    required: false
                }]
            }]
        }]);
    });

    it('should create an action to add page', () => {
        const origin = actions.addPage(2);

        expect(
            origin
        ).toEqual({
            type: types.ADD_PAGE,
            page: {
                page: 2,
                id: origin.page.id,
                description: values.PAGE_TITLE,
                question: []
            }
        });
    });

    it('should create an action to copy page', () => {
        const store = mockStore({ questions });

        store.dispatch(actions.copyPage(1));
        const result = store.getActions();
        expect(result[0].type).toEqual(types.COPY_PAGE);
        expect(result[0].questions.length).toEqual(2);
        expect(result[0].questions[0].description).toEqual(result[0].questions[1].description);
        expect(result[0].questions[1].page).toEqual(2);
    });

    it('should create an action to edit page title', () => {
        const store = mockStore({
            questions,
            editPage: {
                page: 1,
                id: '1B02MFKVS0UXF2JYR95NQ',
                description: 'Hello'
            }
        });

        store.dispatch(actions.editPageTitle());
        expect(
            store.getActions()
        ).toEqual([{
            type: types.EDIT_PAGE_TITLE,
            questions: [{
                page: 1,
                id: '1B02MFKVS0UXF2JYR95NQ',
                description: 'Hello',
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
            }]
        }]);
    });

    it('should create an action to delete page', () => {
        questions = [{
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
        }, {
            page: 2,
            description: 'I am Page 2',
            question: []
        }];
        const store = mockStore({ questions });

        store.dispatch(actions.deletePage(1));
        expect(
            store.getActions()
        ).toEqual([{
            type: types.DELETE_PAGE,
            questions: [{
                page: 1,
                description: 'I am Page 2',
                question: []
            }]
        }]);
    });

    it('should create an action to exchange page', () => {
        const ExPage = [
            {
                page: 1,
                description: 'Come from P1',
                question: []
            }, {
                page: 2,
                description: 'Come from P2',
                question: []
            }];
        const store = mockStore({ questions: ExPage, orderPage: [2, 1] });

        store.dispatch(actions.exchangePage());
        expect(
            store.getActions()
        ).toEqual([{
            type: types.EXCHANGE_PAGE,
            questions: [
                {
                    page: 1,
                    description: 'Come from P2',
                    question: []
                }, {
                    page: 2,
                    description: 'Come from P1',
                    question: []
                }]
        }]);
    });

    it('should create an action to save questions success', () => {
        expect(
            actions.saveQuestionsSuccess()
        ).toEqual({
            type: types.SAVE_QUESTIONS_SUCCESS
        });
    });

    it('should create an action to save questions failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.SAVE_QUESTIONS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.saveQuestionsFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to save questions', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const surveyID = '1111-2222-3333';
        const subject = 'Hello World';
        const lang = 'en-US';
        const surveyVersion = Config.surveyFormat;
        const surveyPolicy = {
            description: 'Thanks for sharing your feedback with Trend Micro.',
            privacy: {}
        };
        const selectedUser = {};
        const token = 'xxxxxxx';
        questions = [{
            page: 1,
            id: '1B02N4NJA6FMHZFEVLJT0',
            description: '',
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
        }];
        const surveyL10n = {
            [lang]: {
                subject,
                '1AN2AL0F9BNA7A': 'Testing question text',
                '1AN2AL0F9BNA7A_INPUT': 'Tell us the reason why you choose this answer',
                '1APPJND2CYA3FQEBJ3K7O': 'Dissatisfied',
                '1APPJND2CYBHCD9V0FEBA': 'Satisfied'
            }
        };
        const newQuestions = [Object.assign({}, questions[0], { description: ' ' })];
        const l10nQuestions = [{
            page: 1,
            id: '1B02N4NJA6FMHZFEVLJT0',
            description: ' ',
            question: [{
                id: '1AN2AL0F9BNA7A',
                order: 1,
                type: 'rating',
                label: '1AN2AL0F9BNA7A',
                data: [
                    { value: '1APPJND2CYA3FQEBJ3K7O', label: '1APPJND2CYA3FQEBJ3K7O' },
                    { value: '1APPJND2CYBHCD9V0FEBA', label: '1APPJND2CYBHCD9V0FEBA' }
                ],
                input: '1AN2AL0F9BNA7A_INPUT',
                required: false
            }]
        }];
        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: l10nQuestions,
                thankyou: surveyPolicy
            },
            l10n: {
                basic: lang,
                [lang]: {
                    subject,
                    '1AN2AL0F9BNA7A': 'Testing question text',
                    '1AN2AL0F9BNA7A_INPUT': 'Tell us the reason why you choose this answer',
                    '1APPJND2CYA3FQEBJ3K7O': 'Dissatisfied',
                    '1APPJND2CYBHCD9V0FEBA': 'Satisfied'
                }
            }
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/surveys/${account.accountid}/${surveyID}`, 'PUT', postData)
        .reply(200, { datetime: Date.now() });

        const store = mockStore({ account, surveyID, subject, lang, surveyL10n: {}, surveyVersion,
            questions, surveyPolicy, selectedUser, token });
        const expectedActions = [
            { type: types.REQUEST_SAVE_QUESTION },
            { type: types.UPDATE_QUESTIONS, questions: newQuestions },
            {
                type: types.SET_SURVEY_L10N,
                surveyL10n
            },
            { type: types.SAVE_QUESTIONS_SUCCESS }
        ];

        return store.dispatch(actions.saveQuestion())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to set survey policy', () => {
        const surveyPolicy = {
            description: 'Thanks for sharing your feedback with Trend Micro.',
            privacy: {}
        };
        expect(
            actions.setSurveyPolicy(surveyPolicy)
        ).toEqual({
            type: types.SET_SURVEY_POLICY,
            surveyPolicy
        });
    });

    it('should create an action to edit survey policy', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const surveyID = '1111-2222-3333';
        const subject = 'Hello World';
        const lang = 'en-US';
        const surveyPolicy = {
            description: 'privacy_description',
            privacy: {}
        };
        const selectedUser = {};
        const token = 'xxxxxxx';
        const oneQuestion = Object.assign({}, questions[0].question[0], { order: 1 });
        const newQuestions = [Object.assign({}, questions[0], { question: [oneQuestion] })];

        const store = mockStore({ account, surveyID, subject, lang, questions, surveyPolicy, selectedUser, token });
        store.dispatch(actions.editSurveyPolicy(true));
        expect(
            store.getActions()
        ).toEqual([
            {
                type: types.SET_SURVEY_POLICY,
                surveyPolicy: {
                    description: 'privacy_description',
                    privacy: {
                        label: 'privacy_label',
                        terms: 'privacy_terms',
                        input: 'privacy_input'
                    }
                }
            },
            { type: types.REQUEST_SAVE_QUESTION },
            {
                type: types.UPDATE_QUESTIONS,
                questions: newQuestions
            },
            {
                type: types.SET_SURVEY_VERSION,
                surveyVersion: Config.surveyFormat
            },
            {
                type: types.SET_SURVEY_L10N,
                surveyL10n: {
                    [lang]: {
                        subject,
                        '1B02MFKVS0UXF2JYR95NQ': 'I am Page 1',
                        '1AN2AL0F9BNA7A': 'Testing question text',
                        '1APPJND2CYA3FQEBJ3K7O': 'Dissatisfied',
                        '1APPJND2CYBHCD9V0FEBA': 'Satisfied',
                        '1AN2AL0F9BNA7A_INPUT': 'Tell us the reason why you choose this answer'
                    }
                }
            }
        ]);
    });

    it('should create an action to get questions success', () => {
        expect(
            actions.receiveQuestionsSuccess(questions)
        ).toEqual({
            type: types.RECEIVE_QUESTIONS_SUCCESS,
            questions
        });
    });

    it('should create an action to get questions failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EXPIRED_TOKEN },
            { type: types.RECEIVE_QUESTIONS_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.receiveQuestionsFailure('Error'));
        expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create an action to get questions', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const selectedUser = {};
        const subject = 'Hello';
        const lang = 'en-US';
        const surveyID = '1111-2222-3333';

        nock(Config.baseURL, {
            reqheaders: { 'Cache-Control': 'max-age=0' }
        })
        .get(`/api/v1/surveys/${account.accountid}/${surveyID}`)
        .reply(200, {
            surveyid: surveyID,
            subject,
            survey: {
                content: questions,
                thankyou: {}
            }
        });

        const store = mockStore({ account, selectedUser });
        const expectedActions = [
            { type: types.REQUEST_GET_QUESTION },
            { type: types.SET_SUBJECT, subject, lang },
            { type: types.SET_SURVEY_VERSION, surveyVersion: 'v1' },
            { type: types.SET_SURVEY_POLICY, surveyPolicy: {} },
            { type: types.RECEIVE_QUESTIONS_SUCCESS, questions },
            { type: types.SET_SURVEYID, surveyID },
            { type: types.SET_WEBPAGE, webpage: 'userCreate' }
        ];

        return store.dispatch(actions.getQuestion(surveyID))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to set drop question', () => {
        const dropQuestion = {
            page: 1,
            index: 1
        };

        expect(
            actions.setDropQuestion(dropQuestion)
        ).toEqual({
            type: types.SET_DROP_QUESTION,
            dropQuestion
        });
    });

    it('should create an action to stop drop question', () => {
        expect(
            actions.stopDropQuestion()
        ).toEqual({ type: types.STOP_DROP_QUESTION });
    });

    it('should create an action to set question editable or not', () => {
        expect(
            actions.setQuestionEditable(false)
        ).toEqual({ type: types.SET_NOT_EDITABLE });
        expect(
            actions.setQuestionEditable(true)
        ).toEqual({ type: types.SET_EDITABLE });
    });

    it('should create an action to set SurveyL10n', () => {
        const surveyL10n = {
            subject: 'Hello',
            '1B02MFKVS0UXF2JYR95NQ': 'I am Page 1'
        };
        expect(
            actions.setSurveyL10n(surveyL10n)
        ).toEqual({
            type: types.SET_SURVEY_L10N,
            surveyL10n
        });
    });

    it('should create an action to set SurveyVersion', () => {
        const surveyVersion = Config.surveyFormat;
        expect(
            actions.setSurveyVersion(surveyVersion)
        ).toEqual({
            type: types.SET_SURVEY_VERSION,
            surveyVersion
        });
    });

    it('should create an action to toggle SelectedL10n', () => {
        const store = mockStore({ selectedL10n: 'en-US' });
        store.dispatch(actions.toggleSelectedL10n('en-US'));
        store.dispatch(actions.toggleSelectedL10n('zh-TW'));
        expect(
            store.getActions()
        ).toEqual([
            {
                type: types.REMOVE_SELECTED_L10N
            }, {
                type: types.ADD_SELECTED_L10N,
                selectedL10n: 'zh-TW'
            }]);
    });

    it('should create an action to delete SelectedL10n', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const subject = 'Hello';
        const surveyID = '1111-2222-3333';
        const lang = 'en-US';
        const surveyL10n = {
            'en-US': {
                subject: 'Hello'
            },
            'zh-TW': {
                subject: 'Hello'
            }
        };
        const selectedL10n = 'zh-TW';
        const token = 'xxxxxxx';
        const surveyVersion = Config.surveyFormat;

        const newL10n = Object.assign({}, surveyL10n, { basic: lang });
        delete newL10n[selectedL10n];
        const postData = {
            l10n: newL10n
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/surveys/${account.accountid}/${surveyID}`, 'PUT', postData)
        .reply(200, { datetime: Date.now() });

        const store = mockStore({ account, surveyID, subject, lang, surveyL10n, surveyVersion,
            selectedL10n, token });
        const expectedActions = [
            { type: types.REQUEST_DELETE_L10N },
            { type: types.SAVE_QUESTIONS_SUCCESS },
            { type: types.REMOVE_SELECTED_L10N },
            {
                type: types.SET_SURVEY_L10N,
                surveyL10n: {
                    'en-US': { subject: 'Hello' }
                }
            },
            { type: types.RECEIVE_DELETE_L10N }
        ];

        return store.dispatch(actions.deleteSelectedL10n())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to import L10n', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const surveyID = '1111-2222-3333';
        const lang = 'en-US';
        const surveyL10n = {
            'en-US': {
                subject: 'Hello'
            }
        };
        const token = 'xxxxxxx';
        const newL10n = Object.assign({}, surveyL10n, { basic: lang },
            { 'zh-TW': { subject: 'Hello' } });
        const postData = {
            l10n: newL10n
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .intercept(`/api/v1/mgnt/surveys/${account.accountid}/${surveyID}`, 'PUT', postData)
        .reply(200, { datetime: Date.now() });

        const store = mockStore({ account, surveyID, lang, surveyL10n, token });
        const expectedActions = [
            { type: types.REQUEST_IMPORT_L10N },
            { type: types.SAVE_QUESTIONS_SUCCESS },
            { type: types.CLOSE_POPUP },
            {
                type: types.SET_SURVEY_L10N,
                surveyL10n: {
                    'en-US': { subject: 'Hello' },
                    'zh-TW': { subject: 'Hello' }
                }
            },
            { type: types.RECEIVE_IMPORT_L10N }
        ];

        return store.dispatch(actions.importL10n({ 'zh-TW': { subject: 'Hello' } }))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });
});
