import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { Portal } from '../../../portal/src/containers/Portal';
import FBLogin from '../../../portal/src/components/FBLogin';
import Subject from '../../../portal/src/components/Popup/Subject';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Portal Component', () => {

    const props = {
        loading: false,
        token: 'xxxx',
        account: {},
        subject: '',
        lang: 'en-US',
        surveyID: '',
        editSubject: false,
        preview: '',
        previewID: '',
        webpage: 'index',
        routing: {},
        editSubjectActions: () => {},
        subjectActions: () => {},
        questionsActions: () => {},
        previewActions: () => {},
        accountActions: () => {}
    };

    it('Portal: FB Login', () => {
        const content = TestUtils.renderIntoDocument(<Portal {...props} />);
        const fb = TestUtils.scryRenderedComponentsWithType(content, FBLogin);
        expect(fb.length).toEqual(1);
    });

    it('Portal: edit subject popup', () => {
        const editProps = Object.assign({}, props,
            { editSubject: true });
        const content = TestUtils.renderIntoDocument(<Portal {...editProps} />);
        const subject = TestUtils.findRenderedComponentWithType(content, Subject);
        expect(subject).toBeInstanceOf(Object);
    });
});
