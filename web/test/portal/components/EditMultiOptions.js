import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import EditMultiOptions from '../../../portal/src/components/EditPanel/EditMultiOptions';
import EditItem from '../../../portal/src/components/EditPanel/EditItem';

DomMock('<html><body></body></html>');

describe('[Portal] Testing EditMultiOptions Component', () => {

    const fakeData = {
        id: '1AN2AL0F9BNA7A',
        type: 'rating',
        label: 'Testing question text',
        data: [
            { value: 1, label: 'radio label 1' },
            { value: 2, label: 'radio label 2' },
            { value: 3, label: 'radio label 3 with input', input: 'Please input some text.' }
        ],
        input: 'Tell us the reason why you choose this answe',
        required: false
    };
    const props = {
        surveyEditable: true,
        editQuestion: fakeData,
        handleChangeEvent: (data) => {
            fakeData.data.push({ value: 4, label: 'radio label 4' });
        }
    };

    const EditMultiOptionsContext = wrapInTestContext(EditMultiOptions);
    let contentRoot = TestUtils.renderIntoDocument(<EditMultiOptionsContext {...props} />);

    it('show question editor items: option numbers', () => {
        const options = TestUtils.scryRenderedComponentsWithType(contentRoot, EditItem);
        expect(options.length).toEqual(3);
    });

    it('show question editor items: no add other button', () => {
        const options = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-other');
        expect(options).toEqual([]);
    });

    it('show question editor items: add options', () => {
        const btn = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-btn');
        TestUtils.Simulate.click(btn[0]);

        expect(fakeData.data.length).toEqual(4);
    });
});
