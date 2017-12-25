import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Header from '../../../portal/src/components/Header';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Header Component', () => {

    const props = {
        account: {
            accountid: 'facebook-xxxxx',
            role: 'Admin',
            username: 'User TM'
        },
        subject: '',
        selectedUser: {},
        webpage: 'index',
        editSubjectActions: () => {},
        questionsActions: () => {},
        questionsActions: () => {}
    };

    it('header: normal mode', () => {
        const normalProps = Object.assign({}, props,
            {
                account: {
                    accountid: 'facebook-xxxxx',
                    role: 'Designer',
                    username: 'User TM'
                }
            });
        const content = TestUtils.renderIntoDocument(<Header {...normalProps} />);
        const trend = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-trend');
        expect(trend).toBeInstanceOf(Object);
        const qustom = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-qustom');
        expect(qustom).toEqual([]);
    });

    it('header: admin mode', () => {
        const content = TestUtils.renderIntoDocument(<Header {...props} />);
        const admin = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-admin');
        expect(admin).toBeInstanceOf(Object);
    });

    it('header: edit survey mode', () => {
        const editProps = Object.assign({}, props,
            {
                subject: 'New questionnaire',
                webpage: 'create'
            });
        const content = TestUtils.renderIntoDocument(<Header {...editProps} />);
        const trend = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-trend');
        expect(trend).toEqual([]);
        const qustom = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-qustom');
        expect(qustom).toBeInstanceOf(Object);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual(editProps.subject);
    });

    it('header: admin mode for user list', () => {
        const adminProps = Object.assign({}, props,
            {
                webpage: 'user'
            });
        const content = TestUtils.renderIntoDocument(<Header {...adminProps} />);
        const trend = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-trend');
        expect(trend).toEqual([]);
        const qustom = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-qustom');
        expect(qustom).toBeInstanceOf(Object);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('Administration');
    });

    it('header: admin mode for user\'s survey list', () => {
        const adminProps = Object.assign({}, props,
            {
                selectedUser: {
                    accountid: 'facebook-yyyy',
                    role: 'Designer',
                    username: 'Trend TM'
                },
                webpage: 'userSurvey'
            });
        const content = TestUtils.renderIntoDocument(<Header {...adminProps} />);
        const trend = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-trend');
        expect(trend).toEqual([]);
        const qustom = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-qustom');
        expect(qustom).toBeInstanceOf(Object);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual(`${adminProps.selectedUser.username}'s Survey`);
    });
});
