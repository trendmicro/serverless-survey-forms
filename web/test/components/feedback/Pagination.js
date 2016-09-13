import DomMock from '../../helpers/dom-mock';
import jsdom from 'mocha-jsdom';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Pagination from '../../../src/components/Pagination';

DomMock('<html><body></body></html>');

describe('Testing Pagination Component', () => {
    jsdom({ skipWindowCheck: true });

    it('check total pages < 1: Only submit button', () => {
        const content = TestUtils.renderIntoDocument(
            <Pagination pages={1} currentPage={1} settings={{ type: 'preview' }} />
        );
        // const PrevBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-prev');
        const NextBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-next');
        const DoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-done');

        // Expect only submit button
        // expect(PrevBtn).toEqual([]);
        expect(NextBtn).toEqual([]);
        expect(DoneBtn[0].textContent).toEqual('Submit');

    });

    /* it('check page one scenario: No prev button', () => {
        const content = TestUtils.renderIntoDocument(
            <Pagination pages={4} currentPage={1} settings={{ type: 'preview' }} />
        );
        const PrevBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-prev');

        // Expect no prev button
        expect(PrevBtn).toEqual([]);

    }); */

    it('check page one scenario: Has next button', () => {
        const content = TestUtils.renderIntoDocument(
            <Pagination pages={4} currentPage={1} settings={{ type: 'preview' }} />
        );
        const NextBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-next');

        // Expect to have next button
        expect(NextBtn[0].textContent).toEqual('Next');
    });

    it('check last page scenario: No next button', () => {
        const content = TestUtils.renderIntoDocument(
            <Pagination pages={4} currentPage={4} settings={{ type: 'preview' }} />
        );
        const NextBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-next');

        // Expect no prev button
        expect(NextBtn).toEqual([]);
    });

    it('check last page scenario: Has prev and submit button', () => {
        const content = TestUtils.renderIntoDocument(
            <Pagination pages={4} currentPage={4} settings={{ type: 'preview' }} />
        );
        // const PrevBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-prev');
        const DoneBtn = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-done');

        // Expect to have prev and submit button
        // expect(PrevBtn[0].textContent).toEqual('Prev');
        expect(DoneBtn[0].textContent).toEqual('Submit');
    });
});
