import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ControlBtn from '../../../portal/src/components/List/ControlBtn';
import IconButton from '../../../portal/src/components/IconButton';

DomMock('<html><body></body></html>');

describe('[Portal] Testing ControlBtn Component', () => {

    const props = {
        selectedSurveys: '',
        selectedUser: {},
        editSubjectActions: () => {},
        surveysActions: () => {},
        previewActions: () => {}
    };

    it('survey list control button: count surveys number', () => {
        const content = TestUtils.renderIntoDocument(
            <ControlBtn {...props} />
        );
        const btn = TestUtils.scryRenderedComponentsWithType(content, IconButton);
        expect(btn.length).toEqual(1);
    });

    it('survey list control button: if one selectedSurveys, buttons will show', () => {
        props.selectedSurveys = '2222-3333-4444-0000';

        const content = TestUtils.renderIntoDocument(
            <ControlBtn {...props} />
        );
        const btn = TestUtils.scryRenderedComponentsWithType(content, IconButton);
        expect(btn.length).toEqual(6);
    });

    it('survey list control button: no create btn in admin mode', () => {
        props.selectedSurveys = '';
        props.selectedUser = {
            accountid: 'facebook-xxxxx',
            role: 'Admin',
            username: 'Admin TM'
        };

        const content = TestUtils.renderIntoDocument(
            <ControlBtn {...props} />
        );
        const btn = TestUtils.scryRenderedComponentsWithType(content, IconButton);
        expect(btn.length).toEqual(0);
    });
});
