import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Privacy from '../../../portal/src/components/Form/Privacy';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Privacy Component', () => {

    const props = {
        surveyPolicy: {
            description: 'Thanks for sharing your feedback with Trend Micro.',
            privacy: {
                label: 'If Trend Micro has a follow-up survey on the Email Scan, would you like to participate?',
                terms: 'Yes, Trend Micro can reach me at this address: ',
                input: 'Please enter your email address.'
            }
        },
        questionsActions: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <Privacy {...props} />
    );

    it('privacy edit: checked option', () => {
        const chk = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-chk');
        expect(chk.checked).toBe(true);
    });
});
