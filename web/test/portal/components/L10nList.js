import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import L10nList from '../../../portal/src/components/L10n/L10nList';

DomMock('<html><body></body></html>');

describe('[Portal] Testing L10nList Component', () => {

    const props = {
        surveyL10n: {
            'en-US': {
                subject: 'This is subject'
            },
            'zh-TW': {
                subject: 'This is subject in Chinese'
            }
        },
        lang: 'zh-TW',
        selectedL10n: 'zh-TW',
        questionsActions: () => {},
        popupActions: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <L10nList {...props} />
    );

    it('l10n list: count l10n\'s number', () => {
        const list = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-list');
        expect(list.length).toEqual(2);
    });

    it('l10n list: check l10n data', () => {
        const title = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-title');
        expect(title[0].getAttribute('data-id')).toEqual('en-US');
        expect(title[1].getAttribute('data-id')).toEqual('zh-TW');
    });
});
