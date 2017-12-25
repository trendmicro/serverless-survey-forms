import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import ControlBtn from '../../../portal/src/components/L10n/ControlBtn';
import IconButton from '../../../portal/src/components/IconButton';

DomMock('<html><body></body></html>');

describe('[Portal] Testing L10nControlBtn Component', () => {

    const props = {
        lang: 'en-US',
        selectedL10n: '',
        questionsActions: () => {},
        popupActions: () => {}
    };

    it('l10n list control button: count l10n btn number', () => {
        const content = TestUtils.renderIntoDocument(
            <ControlBtn {...props} />
        );
        const btn = TestUtils.scryRenderedComponentsWithType(content, IconButton);
        expect(btn.length).toEqual(2);
    });

    it('l10n list control button: if one selectedL10n, buttons will show', () => {
        props.selectedL10n = 'zh-TW';

        const content = TestUtils.renderIntoDocument(
            <ControlBtn {...props} />
        );
        const btn = TestUtils.scryRenderedComponentsWithType(content, IconButton);
        expect(btn.length).toEqual(3);
    });
});
