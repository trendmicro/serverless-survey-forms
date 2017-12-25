import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import SurveyList from '../../../portal/src/components/List/SurveyList';

DomMock('<html><body></body></html>');

describe('[Portal] Testing SurveyList Component', () => {

    const props = {
        surveys: [
            {
                accountid: 'facebook-00000',
                subject: 'I am Questionnaire',
                surveyid: '11111-0000-2222-3333',
                datetime: 1470380181870,
                count: 10
            },{
                accountid: 'facebook-00000',
                subject: 'TODOS',
                surveyid: '2222-3333-4444-0000',
                datetime: 1470301920229,
                count: 0
            }],
        selectedSurveys: '2222-3333-4444-0000',
        questionsActions: () => {},
        surveysActions: {
            toggleSelectedSurveys: (val) => {
                props.selectedSurveys = val;
            }
        }
    };
    const content = TestUtils.renderIntoDocument(
        <SurveyList {...props} />
    );

    it('survey list: count surveys number', () => {
        const list = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-list');
        expect(list.length).toEqual(2);
    });

    it('survey list: check survey data', () => {
        const title = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-title');
        expect(title[0].textContent).toEqual(props.surveys[0].subject.toString());
        expect(title[1].textContent).toEqual(props.surveys[1].subject.toString());
        const count = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-count');
        expect(count[0].textContent).toEqual(props.surveys[0].count.toString());
        expect(count[1].textContent).toEqual(props.surveys[1].count.toString());
    });

    it('survey list: if this survey has feedback, it cannot edit', () => {
        const title = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-title');
        expect(title[0].getAttribute('data-num')).toEqual("10");
        expect(title[1].getAttribute('data-num')).toEqual("0");
        expect(title[0].classList.length).toEqual(2);
        expect(title[1].classList.length).toEqual(2);
    });

    it('survey list: selected survey', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithTag(content, 'input');
        expect(input[0].checked).toEqual(false);
        expect(input[1].checked).toEqual(true);
    });

    it('survey list: change selected survey', () => {
        const input = TestUtils.scryRenderedDOMComponentsWithTag(content, 'input');
        TestUtils.Simulate.change(input[0]);
        expect(props.selectedSurveys).toEqual(input[0].value);
    });
});
