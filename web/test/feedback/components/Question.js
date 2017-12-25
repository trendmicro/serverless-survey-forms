import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Question from '../../../src/components/Question';

DomMock('<html><body></body></html>');

describe('[Feedback] Testing Question Component', () => {

    it('should contain correct question id and text', () => {
        const content = TestUtils.renderIntoDocument(
            <Question id={2} text={'Question 2'} />
        );
        const question = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-question');

        expect(question.textContent).toEqual('Question 2');
    });

    it('should contain ut-required', () => {
        const content = TestUtils.renderIntoDocument(
            <Question id={2} text={'Question 2'} required={true} />
        );
        const requiredElement = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-required');

        expect(requiredElement.length).toEqual(1);
    });
});
