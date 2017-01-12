
/* eslint new-cap: ["error", { "capIsNew": false, "properties": true }],
no-use-before-define: "off" */

import * as types from '../constants/ActionTypes';
import * as values from '../constants/DefaultValues';

// import { push } from 'react-router-redux';
import fetch from 'isomorphic-fetch';
import Immutable from 'immutable';

import Config from '../config';
import Mixins from '../mixins/global';
import { setSubject } from './subject';
import { expiredToken } from './account';
import { setWebpage } from './webpage';
import { closePopup } from './popup';

export function postSurvey(accountid, postData, token) {
    return fetch(`${Config.baseURL}/api/v1/mgnt/surveys/${accountid}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            authorization: token
        },
        body: JSON.stringify(postData)
    });
}

export function putSurvey(accountid, surveyID, postData, token) {
    return fetch(`${Config.baseURL}/api/v1/mgnt/surveys/${accountid}/${surveyID}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            authorization: token
        },
        body: JSON.stringify(postData)
    });
}

export function getOneSurvey(accountid, surveyID) {
    return fetch(`${Config.baseURL}/api/v1/surveys/${accountid}/${surveyID}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Cache-Control': 'max-age=0'
        }
    });
}

export function setSurveyID(data) {
    return {
        type: types.SET_SURVEYID,
        surveyID: data
    };
}

export function setQuestionEditable(flag) {
    if (flag) {
        return {
            type: types.SET_EDITABLE
        };
    }
    return {
        type: types.SET_NOT_EDITABLE
    };
}

export function finishEdit() {
    return (dispatch, getState) => {
        const { selectedUser, selectedL10n } = getState();
        dispatch(setSurveyID(''));
        dispatch(setSubject('', ''));
        dispatch(setQuestionEditable(true));
        dispatch(toggleSelectedL10n(selectedL10n));
        dispatch({ type: types.INIT_QUESTIONS });
        dispatch({ type: types.INIT_SURVEY_POLICY });
        // TODOS: temporarily remove router
        // dispatch(push('/'));
        if (selectedUser.hasOwnProperty('accountid')) {
            dispatch(setWebpage('userSurvey'));
        } else {
            dispatch(setWebpage('index'));
        }
    };
}

export function addQuestion(page) {
    return (dispatch, getState) => {
        const newQuestion = {
            id: Mixins.generateQuestionID(),
            type: 'radio',
            label: values.QUESTION_TITLE,
            data: [
                { value: Mixins.generateQuestionID(), label: values.OPTION_TITLE }
            ],
            required: true
        };
        const pageIdx = page - 1;
        // Use immutable to generate immutable objects and arrays
        const originQuestions = Immutable.fromJS(getState().questions);
        const newQuestions = originQuestions.updateIn(
            [pageIdx, 'question'],
            quelist => quelist.push(newQuestion)
        );

        dispatch({
            type: types.ADD_QUESTION,
            questions: newQuestions.toJS()
        });
    };
}

export function updateQuestionItem() {
    return (dispatch, getState) => {
        const { questions, editQuestion } = getState();
        const originQuestions = Immutable.fromJS(questions);
        let newQuestions;
        let flag = false;
        originQuestions.find((page, pageIdx) => {
            page.get('question').find((quelist, quelistIdx) => {
                flag = quelist.get('id').includes(editQuestion.id);
                if (flag) {
                    // update question
                    newQuestions = originQuestions.updateIn(
                        [pageIdx, 'question', quelistIdx],
                        () => editQuestion
                    );
                }
                return flag;
            });
            return flag;
        });

        dispatch({
            type: types.EDIT_QUESTION,
            questions: newQuestions.toJS()
        });
    };
}

export function copyQuestion(page, queId) {
    return (dispatch, getState) => {
        const { questions } = getState();
        const pageIdx = page - 1;
        const originQuestions = Immutable.fromJS(questions);
        let newQuestion = originQuestions.getIn([pageIdx, 'question', queId]);
        newQuestion.get('data').forEach((optlist, optlistIdx) => {
            // regenerate options id
            newQuestion = newQuestion.updateIn(
                ['data', optlistIdx, 'value'],
                () => Mixins.generateQuestionID()
            );
        });
        const newQuestions = originQuestions.updateIn(
            [pageIdx, 'question'],
            // regenerate question id
            quelist => quelist.push(newQuestion.set('id', Mixins.generateQuestionID()))
        );

        dispatch({
            type: types.COPY_QUESTION,
            questions: newQuestions.toJS()
        });
    };
}

export function deleteQuestion(page, queId) {
    return (dispatch, getState) => {
        const { questions } = getState();
        const pageIdx = page - 1;
        const originQuestions = Immutable.fromJS(questions);
        const newQuestions = originQuestions.deleteIn([pageIdx, 'question', queId]);
        dispatch({
            type: types.DELETE_QUESTION,
            questions: newQuestions.toJS()
        });
    };
}

export function exchangeQuestion(bfPage, bfIdx, afPage, afIdx, data) {
    return (dispatch, getState) => {
        const { questions } = getState();
        const originQuestions = Immutable.fromJS(questions);
        let newQuestions = originQuestions.deleteIn([bfPage - 1, 'question', bfIdx]);
        const len = newQuestions.getIn([afPage - 1, 'question']).size;
        // subtract itself
        const afterIndex = (bfPage === afPage && bfIdx < afIdx) ? afIdx - 1 : afIdx;

        newQuestions = newQuestions.updateIn(
            [afPage - 1, 'question'],
            quelist => {
                if (afterIndex < len) {
                    return quelist.insert(afterIndex, data);
                }
                return quelist.push(data);
            });

        dispatch({
            type: types.EXCHANGE_QUESTION,
            questions: newQuestions.toJS()
        });
    };
}

export function addPage(page) {
    const newPage = {
        page: page,
        id: Mixins.generateQuestionID(),
        description: values.PAGE_TITLE,
        question: []
    };

    return {
        type: types.ADD_PAGE,
        page: newPage
    };
}

export function copyPage(pageId) {
    return (dispatch, getState) => {
        const originQuestions = Immutable.fromJS(getState().questions);
        let newPage = originQuestions.get(pageId - 1);
        newPage = newPage.set('id', Mixins.generateQuestionID());
        newPage.get('question').forEach((que, queIdx) => {
            newPage = newPage.updateIn(
                ['question', queIdx, 'id'],
                () => Mixins.generateQuestionID()
            );
            que.get('data').forEach((optlist, optlistIdx) => {
                // regenerate options id
                newPage = newPage.updateIn(
                    ['question', queIdx, 'data', optlistIdx, 'value'],
                    () => Mixins.generateQuestionID()
                );
            });
        });
        let newQuestions = originQuestions.push(newPage);
        newQuestions.map((page, pageIdx) => {
            newQuestions = newQuestions.setIn([pageIdx, 'page'], pageIdx + 1);
        });
        dispatch({
            type: types.COPY_PAGE,
            questions: newQuestions.toJS()
        });
    };
}

export function editPageTitle() {
    return (dispatch, getState) => {
        const { page, description } = getState().editPage;
        let newQuestions = Immutable.fromJS(getState().questions);
        newQuestions = newQuestions.setIn([page - 1, 'description'], description);

        dispatch({
            type: types.EDIT_PAGE_TITLE,
            questions: newQuestions.toJS()
        });
    };
}

export function deletePage(pageId) {
    return (dispatch, getState) => {
        let newQuestions = Immutable.fromJS(getState().questions);
        newQuestions = newQuestions.delete(pageId - 1);
        newQuestions.map((page, pageIdx) => {
            newQuestions = newQuestions.setIn([pageIdx, 'page'], pageIdx + 1);
        });

        dispatch({
            type: types.DELETE_PAGE,
            questions: newQuestions.toJS()
        });
    };
}

export function exchangePage() {
    return (dispatch, getState) => {
        const { questions, orderPage } = getState();
        const newQuestions = [];
        orderPage.forEach((pageNum, idx) => {
            newQuestions.push(
                Object.assign({}, questions[pageNum - 1], { page: idx + 1 })
            );
        });

        dispatch({
            type: types.EXCHANGE_PAGE,
            questions: newQuestions
        });
    };
}

export function setSurveyL10n(l10n) {
    const surveyL10n = Object.assign({}, l10n);
    if (surveyL10n.hasOwnProperty('basic')) {
        delete surveyL10n.basic;
    }
    return {
        type: types.SET_SURVEY_L10N,
        surveyL10n
    };
}

export function setSurveyVersion(surveyVersion) {
    return {
        type: types.SET_SURVEY_VERSION,
        surveyVersion
    };
}

export function saveQuestionsSuccess() {
    return {
        type: types.SAVE_QUESTIONS_SUCCESS
    };
}

export function saveQuestionsFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.SAVE_QUESTIONS_FAILURE,
            errorMsg: err
        });
    };
}

export function saveQuestion() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_SAVE_QUESTION });
        const { account, surveyID, subject, lang, surveyL10n, surveyVersion, questions,
            surveyPolicy, selectedUser, token } = getState();
        // save question by selected user account or user's account
        const accountid = selectedUser.hasOwnProperty('accountid') ?
            selectedUser.accountid : account.accountid;
        let genQuestions = Immutable.fromJS(questions);
        // generate order number
        let idx = 0;
        genQuestions.forEach((page, pageIdx) => {
            // If there is no 'id', create one
            if (!page.has('id')) {
                genQuestions = genQuestions.setIn([pageIdx, 'id'], Mixins.generateQuestionID());
            }
            if (page.get('description') === '') {
                // If description is empty, use one whitespace for DynamoDB limitation
                genQuestions = genQuestions.setIn([pageIdx, 'description'], ' ');
            }
            page.get('question').forEach((que, queIdx) => {
                idx ++;
                if (que.get('label') === '') {
                    genQuestions = genQuestions.setIn(
                        [pageIdx, 'question', queIdx, 'label'],
                        values.QUESTION_TITLE);
                }
                if (que.has('input') && que.get('input') === '') {
                    genQuestions = genQuestions.setIn(
                        [pageIdx, 'question', queIdx, 'input'],
                        values.PLACEHOLDER_TITLE);
                }
                genQuestions = genQuestions.setIn([pageIdx, 'question', queIdx, 'order'], idx);
                if (que.has('data')) {
                    que.get('data').forEach((opt, optIdx) => {
                        if (opt.get('label') === '') {
                            genQuestions = genQuestions.setIn(
                                [pageIdx, 'question', queIdx, 'data', optIdx, 'label'],
                                values.OPTION_TITLE);
                        }
                        if (opt.has('input') && opt.get('input') === '') {
                            genQuestions = genQuestions.setIn(
                                [pageIdx, 'question', queIdx, 'data', optIdx, 'input'],
                                values.PLACEHOLDER_TITLE);
                        }
                    });
                }
            });
        });
        // update survey
        dispatch({
            type: types.UPDATE_QUESTIONS,
            questions: genQuestions.toJS()
        });
        // Question format v2
        // replace string to l10n key, and generate l10n json
        // l10n needs to be reducers, record original l10n data, maybe editL10n & editLang
        const l10n = { subject };
        let l10nQuestions = genQuestions;
        l10nQuestions.forEach((page, pageIdx) => {
            // add page description
            if (page.get('description') !== ' ') {
                Object.assign(l10n, { [page.get('id')]: page.get('description') });
                l10nQuestions = l10nQuestions.setIn([pageIdx, 'description'], page.get('id'));
            }
            // handle each question
            page.get('question').forEach((que, queIdx) => {
                // add question title
                Object.assign(l10n, { [que.get('id')]: que.get('label') });
                l10nQuestions = l10nQuestions.setIn(
                    [pageIdx, 'question', queIdx, 'label'], que.get('id'));
                if (que.has('input')) {
                    // add question input
                    Object.assign(l10n, { [`${que.get('id')}_INPUT`]: que.get('input') });
                    l10nQuestions = l10nQuestions.setIn(
                        [pageIdx, 'question', queIdx, 'input'], `${que.get('id')}_INPUT`);
                }
                if (que.has('data')) {
                    // handle each question option
                    que.get('data').forEach((opt, optIdx) => {
                        // add question option
                        Object.assign(l10n, { [opt.get('value')]: opt.get('label') });
                        l10nQuestions = l10nQuestions.setIn(
                            [pageIdx, 'question', queIdx, 'data', optIdx, 'label'],
                            opt.get('value'));
                        if (opt.has('input')) {
                            // add question option
                            Object.assign(l10n,
                                { [`${opt.get('value')}_INPUT`]: opt.get('input') });
                            l10nQuestions = l10nQuestions.setIn(
                                [pageIdx, 'question', queIdx, 'data', optIdx, 'input'],
                                `${opt.get('value')}_INPUT`);
                        }
                    });
                }
            });
        });

        const newL10n = Object.assign({}, surveyL10n, { basic: lang, [lang]: l10n });
        const postData = {
            subject: subject,
            survey: {
                format: Config.surveyFormat,
                content: l10nQuestions.toJS(),
                thankyou: surveyPolicy
            },
            l10n: newL10n
        };
        // update survey version
        if (surveyVersion !== Config.surveyFormat) {
            dispatch(setSurveyVersion(Config.surveyFormat));
        }
        // update survey l10n
        dispatch(setSurveyL10n(newL10n));

        return putSurvey(accountid, surveyID, postData, token)
            .then(response => response.json())
            .then(data => {
                if (data.datetime) {
                    dispatch(saveQuestionsSuccess());
                } else {
                    dispatch(saveQuestionsFailure(data));
                }
            })
            .catch(err => dispatch(saveQuestionsFailure(err)));
    };
}

export function setSurveyPolicy(data) {
    return {
        type: types.SET_SURVEY_POLICY,
        surveyPolicy: data
    };
}

export function editSurveyPolicy(flag) {
    const data = {
        description: 'privacy_description',
        privacy: {}
    };

    if (flag) {
        const privacy = {
            label: 'privacy_label',
            terms: 'privacy_terms',
            input: 'privacy_input'
        };
        data.privacy = privacy;
    }

    return (dispatch) => {
        dispatch(setSurveyPolicy(data));
        dispatch(saveQuestion());
    };
}

export function receiveQuestionsSuccess(data) {
    return {
        type: types.RECEIVE_QUESTIONS_SUCCESS,
        questions: data
    };
}

export function receiveQuestionsFailure(err) {
    return (dispatch) => {
        dispatch(expiredToken());
        dispatch({
            type: types.RECEIVE_QUESTIONS_FAILURE,
            errorMsg: err
        });
    };
}

export function getQuestion(surveyID) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_GET_QUESTION });
        const { account, selectedUser } = getState();
        // get question by selected user account or user's account
        const accountid = selectedUser.hasOwnProperty('accountid') ?
            selectedUser.accountid : account.accountid;
        return getOneSurvey(accountid, surveyID)
            .then(response => response.json())
            .then(data => {
                if (data.surveyid) {
                    const { surveyid, subject, survey, l10n } = data;
                    if (survey.hasOwnProperty('format') && survey.format === 'v2') {
                        // Question format v2
                        // replace string from l10n to content
                        const langMapping = l10n[l10n.basic];
                        let genQuestions = Immutable.fromJS(survey.content);
                        let seq = [];
                        genQuestions.forEach((page, pageIdx) => {
                            // set page description
                            // If there is no description, use one whitespace
                            seq = [pageIdx, 'description'];
                            genQuestions = genQuestions.setIn(
                                seq, langMapping[genQuestions.getIn(seq)] || ' '
                            );
                            // handle each question
                            page.get('question').forEach((que, queIdx) => {
                                // set question title
                                seq = [pageIdx, 'question', queIdx, 'label'];
                                genQuestions = genQuestions.setIn(
                                    seq, langMapping[genQuestions.getIn(seq)]
                                );
                                if (que.has('input')) {
                                    // set question input
                                    seq = [pageIdx, 'question', queIdx, 'input'];
                                    genQuestions = genQuestions.setIn(
                                        seq, langMapping[genQuestions.getIn(seq)]
                                    );
                                }
                                if (que.has('data')) {
                                    // handle each question option
                                    que.get('data').forEach((opt, optIdx) => {
                                        // set question option
                                        seq = [pageIdx, 'question', queIdx,
                                            'data', optIdx, 'label'];
                                        genQuestions = genQuestions.setIn(
                                            seq, langMapping[genQuestions.getIn(seq)]
                                        );
                                        if (opt.has('input')) {
                                            // set question option
                                            seq = [pageIdx, 'question', queIdx,
                                                'data', optIdx, 'input'];
                                            genQuestions = genQuestions.setIn(
                                                seq, langMapping[genQuestions.getIn(seq)]
                                            );
                                        }
                                    });
                                }
                            });
                        });
                        dispatch(setSurveyL10n(l10n));
                        dispatch(setSurveyVersion(survey.format));
                        dispatch(setSubject(langMapping.subject, l10n.basic));
                        dispatch(setSurveyPolicy(survey.thankyou));
                        dispatch(receiveQuestionsSuccess(genQuestions.toJS()));
                    } else {
                        dispatch(setSubject(subject));
                        dispatch(setSurveyVersion('v1'));
                        dispatch(setSurveyPolicy(survey.thankyou));
                        dispatch(receiveQuestionsSuccess(survey.content));
                    }
                    dispatch(setSurveyID(surveyid));
                    // TODOS: temporarily remove router
                    // dispatch(push('/create'));
                    if (selectedUser.hasOwnProperty('accountid')) {
                        dispatch(setWebpage('create'));
                    } else {
                        dispatch(setWebpage('userCreate'));
                    }
                } else {
                    dispatch(receiveQuestionsFailure(data));
                }
            })
            .catch(err => dispatch(receiveQuestionsFailure(err)));
    };
}

export function setDropQuestion(dropQuestion) {
    return {
        type: types.SET_DROP_QUESTION,
        dropQuestion
    };
}

export function stopDropQuestion() {
    return {
        type: types.STOP_DROP_QUESTION
    };
}

export function toggleSelectedL10n(data) {
    return (dispatch, getState) => {
        if (getState().selectedL10n === data) {
            dispatch({
                type: types.REMOVE_SELECTED_L10N
            });
        } else {
            dispatch({
                type: types.ADD_SELECTED_L10N,
                selectedL10n: data
            });
        }
    };
}

export function deleteSelectedL10n() {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_DELETE_L10N });
        const { account, surveyID, lang, surveyL10n, selectedL10n, token } = getState();
        const newL10n = Object.assign({}, surveyL10n, { basic: lang });
        delete newL10n[selectedL10n];
        const postData = {
            l10n: newL10n
        };

        return putSurvey(account.accountid, surveyID, postData, token)
            .then(response => response.json())
            .then(data => {
                if (data.datetime) {
                    dispatch(saveQuestionsSuccess());
                    dispatch(toggleSelectedL10n(selectedL10n));
                    dispatch(setSurveyL10n(newL10n));
                } else {
                    dispatch(saveQuestionsFailure(data));
                }
                dispatch({ type: types.RECEIVE_DELETE_L10N });
            })
            .catch(err => {
                dispatch(saveQuestionsFailure(err));
                dispatch({ type: types.RECEIVE_DELETE_L10N });
            });
    };
}

export function importL10n(l10n) {
    return (dispatch, getState) => {
        dispatch({ type: types.REQUEST_IMPORT_L10N });
        const { account, surveyID, lang, surveyL10n, token } = getState();
        const newL10n = Object.assign({}, surveyL10n, { basic: lang }, l10n);
        const postData = {
            l10n: newL10n
        };
        return putSurvey(account.accountid, surveyID, postData, token)
            .then(response => response.json())
            .then(data => {
                if (data.datetime) {
                    dispatch(saveQuestionsSuccess());
                    dispatch(closePopup());
                    dispatch(setSurveyL10n(newL10n));
                } else {
                    dispatch(saveQuestionsFailure(l10n));
                }
                dispatch({ type: types.RECEIVE_IMPORT_L10N });
            })
            .catch(err => {
                dispatch(saveQuestionsFailure(err));
                dispatch({ type: types.RECEIVE_IMPORT_L10N });
            });
    };
}
