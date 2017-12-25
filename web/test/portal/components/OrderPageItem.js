import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Item from '../../../portal/src/components/EditPanel/OrderPage/Item';

DomMock('<html><body></body></html>');

describe('[Portal] Testing OrderPage Item Component', () => {

    const props = {
        id: 0,
        key: 0,
        orderId: 1,
        page: {
            page: 1,
            description: 'Page 1 title',
            question: []
        },
        moveItem: () => {}
    };

    const ItemContext = wrapInTestContext(Item);
    let contentRoot = TestUtils.renderIntoDocument(<ItemContext {...props} />);

    it('edit orderPage items: page label', () => {
        const span = TestUtils.findRenderedDOMComponentWithClass(contentRoot, 'ut-title');
        expect(span.textContent).toEqual(props.page.description);
    });

    it('edit orderPage items: drag item', () => {
        const backend = contentRoot.getManager().getBackend();
        const component = TestUtils.findRenderedDOMComponentWithClass(contentRoot, 'ut-obj');

        // Expect opacity is 1 before drag
        expect(component.style.opacity).toEqual("1");

        const dragItem = TestUtils.findRenderedComponentWithType(contentRoot, Item);
        const targetItem = dragItem.decoratedComponentInstance;
        backend.simulateBeginDrag([dragItem.getHandlerId()]);
        backend.simulateHover([targetItem.getHandlerId()]);

        // Expect opacity is 0.1 when hover
        expect(component.style.opacity).toEqual("0.1");
    });
});
