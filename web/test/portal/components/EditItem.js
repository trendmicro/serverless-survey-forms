import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import EditItem from '../../../portal/src/components/EditPanel/EditItem';

DomMock('<html><body></body></html>');

describe('[Portal] Testing EditItem Component', () => {

    const props = {
        id: 0,
        key: 0,
        data: { value: 1, label: 'radio label 1' },
        onChangeHandle: () => {},
        onDeleteHandle: () => {},
        moveItem: () => {}
    };

    const EditItemContext = wrapInTestContext(EditItem);
    let contentRoot = TestUtils.renderIntoDocument(<EditItemContext {...props} />);

    it('edit option items: option content', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithClass(contentRoot, 'ut-input');
        expect(input[0].value).toEqual(props.data.label.toString());
    });

    it('edit option items: drag option', () => {
        const backend = contentRoot.getManager().getBackend();
        const component = TestUtils.findRenderedDOMComponentWithClass(contentRoot, 'ut-item');

        // Expect opacity is 1 before drag
        expect(component.style.opacity).toEqual("1");

        const dragItem = TestUtils.findRenderedComponentWithType(contentRoot, EditItem);
        const targetItem = dragItem.decoratedComponentInstance;
        backend.simulateBeginDrag([dragItem.getHandlerId()]);
        backend.simulateHover([targetItem.getHandlerId()]);

        // Expect opacity is 0.1 when hover
        expect(component.style.opacity).toEqual("0.1");
    });
});
