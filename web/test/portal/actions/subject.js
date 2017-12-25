import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import expect from 'expect';
import * as actions from '../../../portal/src/actions/subject';
import * as types from '../../../portal/src/constants/ActionTypes';
import Config from '../../../portal/src/config';

const mockStore = configureStore([thunkMiddleware]);

describe('[Portal] subject action', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create an action to set subject', () => {
        const subject = 'Hello World';
        const lang = 'en-US';
        expect(
            actions.setSubject(subject)
        ).toEqual({
            type: types.SET_SUBJECT,
            subject,
            lang
        });
    });

    it('should create an action to set subject success', () => {
        expect(
            actions.setSubjectSuccess()
        ).toEqual({
            type: types.SET_SUBJECT_SUCCESS
        });
    });

    it('should create an action to set subject failure', () => {
        const store = mockStore({ surveyID: '', subject: '' });
        const expectedActions = [
            { type: types.EDIT_SUBJECT, editSubject: false },
            { type: types.EXPIRED_TOKEN },
            { type: types.SET_SUBJECT_FAILURE, errorMsg: 'Error' }
        ];

        store.dispatch(actions.setSubjectFailure('Error'));
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });

    it('should create an action to save subject', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const subject = 'Hello World';
        const lang = 'en-US';
        const surveyID = '1111-2222-3333';
        const surveyPolicy = {};
        const token = 'xxxxxxx';
        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: [],
                thankyou: surveyPolicy
            },
            l10n: {
                basic: lang,
                [lang]: { subject }
            }
        };

        nock(Config.baseURL, {
            reqheaders: { 'authorization': token }
        })
        .post(`/api/v1/mgnt/surveys/${account.accountid}`, postData)
        .reply(200, {
            surveyid: surveyID,
            datetime: Date.now()
        });

        const store = mockStore({
            account,
            surveyPolicy,
            token
        });
        const expectedActions = [
            { type: types.REQUEST_SET_SUBJECT },
            { type: types.SET_SUBJECT, subject, lang },
            { type: types.SET_SURVEYID, surveyID },
            { type: types.EDIT_SUBJECT, editSubject: false },
            { type: types.SET_SUBJECT_SUCCESS },
            { type: types.SET_WEBPAGE, webpage: 'create' }
        ];

        return store.dispatch(actions.saveSubject(subject, lang))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            });
    });

    it('should create an action to edit subject', () => {
        const account = {
            accountid: 'facebook-xxxxxx',
            username: 'Mr. Test',
            role: 'Admin'
        };
        const surveyID = '1111-2222-3333';
        const subject = 'Hello World';
        const lang = 'en-US';
        const surveyVersion = Config.surveyFormat;
        const questions = [ {
                page: 1,
                id: '1B02QVCJ3AQFSP9829GUY',
                description: 'I am Page 1',
                question: []
            } ];
        const surveyL10n = {
            [lang]: {
                subject,
                '1B02QVCJ3AQFSP9829GUY': 'I am Page 1'
            }
        };
        const surveyPolicy = {};
        const selectedUser = {};
        const token = 'xxxxxxx';

        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: [{
                    page: 1,
                    id: '1B02QVCJ3AQFSP9829GUY',
                    description: '1B02QVCJ3AQFSP9829GUY',
                    question: []
                }],
                thankyou: surveyPolicy
            },
            l10n: {
                basic: lang,
                surveyL10n
            }
        };

        const store = mockStore({ account, surveyID, lang, subject, surveyL10n: {}, surveyVersion,
            questions, surveyPolicy, selectedUser, token });
        const expectedActions = [
            { type: types.SET_SUBJECT, subject, lang },
            { type: types.REQUEST_SAVE_QUESTION },
            {
                type: types.UPDATE_QUESTIONS,
                questions: questions
            },
            { type: types.SET_SURVEY_L10N, surveyL10n }
        ];

        store.dispatch(actions.editSubject(subject, lang));
        expect(
            store.getActions()
        ).toEqual(expectedActions);
    });
});
