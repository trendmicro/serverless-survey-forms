import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Item from '../../../portal/src/components/Form/Item';
import Radio from '../../../portal/src/components/Form/Radio';
import Checkbox from '../../../portal/src/components/Form/Checkbox';
import Rating from '../../../portal/src/components/Form/Rating';
import Text from '../../../portal/src/components/Form/Text';
import Textarea from '../../../portal/src/components/Form/Textarea';

DomMock('<html><body></body></html>');

describe('[Portal] Testing Pagination Item Component', () => {

    const props = {
        id: 1,
        page: 1,
        data: {
            id: '1A0F97AN2ABNAL',
            type: 'radio',
            label: 'Testing',
            data: [
                { value: 1, label: 'Option 1' },
                { value: 2, label: 'Option 2' },
                { value: 3, label: 'Option 3' },
                { value: 4, label: 'Option 4' },
                { value: 5, label: 'Option 5' }
            ],
            required: false
        },
        dropQuestion: {},
        editQuestion: {
            id: '1A0F97AN2ABNAL',
            type: 'radio',
            label: 'Testing',
            data: [
                { value: 1, label: 'Option 1' },
                { value: 2, label: 'Option 2' },
                { value: 3, label: 'Option 3' },
                { value: 4, label: 'Option 4' },
                { value: 5, label: 'Option 5' }
            ],
            required: false
        },
        questionsActions: {
            setDropQuestion: () => {}
        },
        editQuestionActions: () => {},
        moveQuestion: () => {},
        getQuestion: (val) => {
            return { index: val };
        }
    };

    it('pagination item edit: selected item class', () => {
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);
        const item = TestUtils.findRenderedDOMComponentWithClass(contentRoot, 'ut-item');
        expect(item.classList.contains('edit')).toBe(true);
    });

    it('pagination item edit: radio item', () => {
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);
        const radio = TestUtils.findRenderedComponentWithType(contentRoot, Radio);
        expect(
            TestUtils.isCompositeComponentWithType(radio, Radio)
        ).toBe(true);
    });

    it('pagination item edit: checkbox item', () => {
        props.editQuestion.type = 'checkbox';
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);
        const chk = TestUtils.findRenderedComponentWithType(contentRoot, Checkbox);
        expect(
            TestUtils.isCompositeComponentWithType(chk, Checkbox)
        ).toBe(true);
    });

    it('pagination item edit: rating item', () => {
        props.editQuestion.type = 'rating';
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);
        const rating = TestUtils.findRenderedComponentWithType(contentRoot, Rating);
        expect(
            TestUtils.isCompositeComponentWithType(rating, Rating)
        ).toBe(true);
    });

    it('pagination item edit: text item', () => {
        const textProps = Object.assign({}, props);
        textProps.editQuestion = {
            id: '1A0F97AN2ABNAL',
            type: 'text',
            label: 'Testing',
            input: 'Please type here',
            required: false
        };
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...textProps} />);
        const text = TestUtils.findRenderedComponentWithType(contentRoot, Text);
        expect(
            TestUtils.isCompositeComponentWithType(text, Text)
        ).toBe(true);
    });

    it('pagination item edit: textarea item', () => {
        const textProps = Object.assign({}, props);
        textProps.editQuestion = {
            id: '1A0F97AN2ABNAL',
            type: 'textarea',
            label: 'Testing',
            input: 'Please type as many words as you can',
            rows: 3,
            required: false
        };
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...textProps} />);
        const text = TestUtils.findRenderedComponentWithType(contentRoot, Textarea);
        expect(
            TestUtils.isCompositeComponentWithType(text, Textarea)
        ).toBe(true);
    });

    it('pagination item edit: drag item style', () => {
        const ItemContext = wrapInTestContext(Item);
        const contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);
        const backend = contentRoot.getManager().getBackend();
        const component = TestUtils.findRenderedDOMComponentWithClass(contentRoot, 'ut-question');

        // Expect display is block before drag
        expect(component.style.display).toEqual('block');

        const dragItem = TestUtils.findRenderedComponentWithType(contentRoot, Item);
        const targetItem = dragItem.decoratedComponentInstance;
        backend.simulateBeginDrag([dragItem.getHandlerId()]);
        backend.simulateHover([targetItem.getHandlerId()]);

        // Expect display is none when hover
        expect(component.style.display).toEqual('none');
    });
});
