import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Confirm from '../../../portal/src/components/Popup/Confirm';
import Button from '../../../portal/src/components/Button';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Confirm Component', () => {

    const props = {
        popup: '',
        popupActions: () => {},
        surveysActions: () => {}
    };

    it('confirm popup for deleteOneSurvey', () => {
        const popProps = Object.assign({}, props, { popup: 'deleteOneSurvey' });
        const content = TestUtils.renderIntoDocument(<Confirm {...popProps} />);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('Do you really want to delete this survey?');

        const btn = TestUtils.scryRenderedComponentsWithType(content, Button);
        expect(btn.length).toEqual(2);
    });

    it('confirm popup for deleteAllFeedbacks', () => {
        const popProps = Object.assign({}, props, { popup: 'deleteAllFeedbacks' });
        const content = TestUtils.renderIntoDocument(<Confirm {...popProps} />);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('Do you really want to clear all feedbacks in this survey?');

        const btn = TestUtils.scryRenderedComponentsWithType(content, Button);
        expect(btn.length).toEqual(2);
    });

    it('confirm popup for notEditableSurvey', () => {
        const popProps = Object.assign({}, props, { popup: 'notEditableSurvey' });
        const content = TestUtils.renderIntoDocument(<Confirm {...popProps} />);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('Because there are some feedback in this survey, '
                + 'you can\'t change format. You can only modify text.');

        const btn = TestUtils.scryRenderedComponentsWithType(content, Button);
        expect(btn.length).toEqual(1);
    });

    it('confirm popup for notEditableAdmin', () => {
        const popProps = Object.assign({}, props, { popup: 'notEditableAdmin' });
        const content = TestUtils.renderIntoDocument(<Confirm {...popProps} />);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('You can\'t edit survey in Admin mode.');

        const btn = TestUtils.scryRenderedComponentsWithType(content, Button);
        expect(btn.length).toEqual(1);
    });

    it('confirm popup for addSubscriber', () => {
        const popProps = Object.assign({}, props, { popup: 'addSubscriber' });
        const content = TestUtils.renderIntoDocument(<Confirm {...popProps} />);

        const title = TestUtils.findRenderedDOMComponentWithClass(content, 'ut-title');
        expect(title.textContent).toEqual('Please fill subscriber\'s email.');

        const btn = TestUtils.scryRenderedComponentsWithType(content, Button);
        expect(btn.length).toEqual(2);
    });
});
