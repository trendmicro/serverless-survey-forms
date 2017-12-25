import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Checkbox from '../../../portal/src/components/Form/Checkbox';
import Question from '../../../portal/src/components/Form/Question';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Form Checkbox Component', () => {

    const props = {
        data: {
            id: '1A0F97AN2ABNAL',
            type: 'checkbox',
            label: 'Question title',
            order: 1,
            data: [
                { value: '1A0F97AN2ABAGR', label: 'Very dissatisfied' },
                { value: '1A0F97AN2A3FEF', label: 'Dissatisfied' },
                { value: '1A0F97AN2A6E3V', label: 'Satisfied' },
                { value: '1A0F97AN25H69O', label: 'Very satisfied' },
                { value: '1A0F97AN2AO03T', label: 'Other', input: 'Placeholder..' }
            ],
            required: true
        },
        onClick: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <Checkbox {...props} />
    );

    it('checkbox: question type', () => {
        const que = TestUtils.scryRenderedComponentsWithType(content, Question);
        expect(que.length).toEqual(1);
        expect(que[0].props.text).toEqual(props.data.label);
        expect(que[0].props.required).toEqual(true);
    });

    it('checkbox: option numbers', () => {
        const opt = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-chk');
        expect(opt.length).toEqual(5);
    });

    it('checkbox: option input', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-input');
        expect(input.length).toEqual(1);
        expect(input[0].getAttribute('placeholder')).toEqual(props.data.data[4].input);
    });
});
