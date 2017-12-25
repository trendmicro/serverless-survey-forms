import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import { wrapInTestContext } from '../../helpers/dnd-test';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import OrderPage from '../../../portal/src/components/EditPanel/OrderPage';
import Item from '../../../portal/src/components/EditPanel/OrderPage/Item';

DomMock('<html><body></body></html>');

describe('[Portal] Testing OrderPage Component', () => {

    const fakeData = [{
            page: 1,
            description: 'Page 1 title',
            question: []
        },{
            page: 2,
            description: 'Page 2 title',
            question: []
        }];

    const props = {
        questions: fakeData,
        orderPage: [2, 1],
        editPageActions: () => {},
        questionsActions: () => {}
    };

    const OrderPageContext = wrapInTestContext(OrderPage);
    const contentRoot = TestUtils.renderIntoDocument(<OrderPageContext {...props} />);

    it('show order page: page number', () => {
        const item = TestUtils.scryRenderedComponentsWithType(contentRoot, Item);
        expect(item.length).toEqual(2);
    });
});
