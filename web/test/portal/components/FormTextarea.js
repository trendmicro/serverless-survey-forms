import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Textarea from '../../../portal/src/components/Form/Textarea';
import Question from '../../../portal/src/components/Form/Question';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Form Textarea Component', () => {

    const props = {
        data: {
            id: '97AN2A1A0FBNAL',
            type: 'textarea',
            label: 'Question title',
            order: 1,
            input: 'Please type as many words as you can',
            rows: 5,
            required: false
        },
        onClick: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <Textarea {...props} />
    );

    it('textarea: question type', () => {
        const que = TestUtils.scryRenderedComponentsWithType(content, Question);
        expect(que.length).toEqual(1);
        expect(que[0].props.text).toEqual(props.data.label);
        expect(que[0].props.required).toEqual(false);
    });

    it('textarea: option input', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-input');
        expect(input.length).toEqual(1);
        expect(input[0].getAttribute('placeholder')).toEqual(props.data.input);
        expect(input[0].getAttribute('rows')).toEqual(props.data.rows.toString());
    });
});
