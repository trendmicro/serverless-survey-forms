import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Text from '../../../portal/src/components/Form/Text';
import Question from '../../../portal/src/components/Form/Question';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Form Text Component', () => {

    const props = {
        data: {
            id: '97AN2A1A0FBNAL',
            type: 'text',
            label: 'Question title',
            order: 1,
            input: 'Please type here',
            required: false
        },
        onClick: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <Text {...props} />
    );

    it('text: question type', () => {
        const que = TestUtils.scryRenderedComponentsWithType(content, Question);
        expect(que.length).toEqual(1);
        expect(que[0].props.text).toEqual(props.data.label);
        expect(que[0].props.required).toEqual(false);
    });

    it('text: option input', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-input');
        expect(input.length).toEqual(1);
        expect(input[0].getAttribute('placeholder')).toEqual(props.data.input);
    });
});
