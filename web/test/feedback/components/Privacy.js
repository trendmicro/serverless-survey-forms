import DomMock from '../../helpers/dom-mock';
import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Privacy from '../../../src/components/Privacy';

DomMock('<html><body></body></html>');

describe('[Feedback] Testing Privacy Component', () => {
    jsdom({ skipWindowCheck: true });
    const info = {
        label: 'If Trend Micro has a follow-up survey on Trend Micro Mail Scanner, would you like to participate?',
        terms: 'Yes, Trend Micro can reach me at this address:',
        input: 'Please enter your email address.'
    };
    const prefillData = {
        email: 'test@test.com',
        privacy_policy_url: 'https://test/privacy/'
    };

    it('should contain correct content', () => {
        const content = TestUtils.renderIntoDocument(
            <Privacy
                prefillData={prefillData}
            />
        );
        const label = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-label');
        const terms = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-terms');

        expect(label.textContent).toEqual(info.label);
        expect(terms.textContent).toEqual(info.terms);
    });

    it('should contain two inputs', () => {
        const content = TestUtils.renderIntoDocument(
            <Privacy
                prefillData={prefillData}
            />
        );

        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(content, 'input');
        expect(inputs.length).toEqual(2);
    });

    it('should contain privacy policy url', () => {
        const content = TestUtils.renderIntoDocument(
            <Privacy
                prefillData={prefillData}
            />
        );
        const url = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-privacy-policy');
        const isExist = TestUtils.isDOMComponent(url);
        expect(isExist).toEqual(true);
    });

    it('should not contain privacy policy url', () => {
        const content = TestUtils.renderIntoDocument(
            <Privacy
                prefillData={{
                    email: 'test@test.com'
                }}
            />
        );
        const url = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-privacy-policy');
        expect(url).toEqual([]);
    });
});
