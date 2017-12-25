import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import EditPage from '../../../portal/src/components/EditPanel/EditPage';

DomMock('<html><body></body></html>');

describe('[Portal] Testing EditPage Component', () => {

    const props = {
        editPage: { page: 1, description: 'Test page title' },
        editPageActions: () => {},
        questionsActions: () => {}
    };

    it('edit option items: option content', () => {
        const content = TestUtils.renderIntoDocument(
            <EditPage {...props} />
        );
        const input = TestUtils.findRenderedDOMComponentWithTag(content, 'input');
        expect(input.value).toEqual(props.editPage.description);
    });
});
