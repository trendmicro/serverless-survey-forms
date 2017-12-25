/**
 * @module Checkbox
 *
 *  {'type': 'checkbox',
 *   'label': 'I am checkbox question text',
 *   'data': [
 *       {'value': '1', 'label': 'checkbox label 1'},
 *       {'value': '2', 'label': 'checkbox label 2'},
 *       {'value': '3', 'label': 'checkbox label 3'},
 *       ...
 *   ]
 *  }
 **/

// CSS

/* eslint no-unused-vars: 0 */
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next/index';

import Question from '../Question/index';
import Error from '../Error';

class Checkbox extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = this._handleState(props);
        this._onChangeHandle = this._onChangeHandle.bind(this);
        this._onChangeInput = this._onChangeInput.bind(this);
        this._feedback = this._feedback.bind(this);
        this._checkDone = this._checkDone.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._handleState(nextProps));
    }

    render() {
        const { id, item, itemID, feedbackActions, pageDone, l10n } = this.props;
        return (
            <div ref="root" className="question">
                <Question
                    id={id}
                    text={l10n[item.label] || item.label}
                    required={item.required}
                >
                    {!feedbackActions.checkDone(itemID) && pageDone !== 'init' ?
                        <Error msg={I18Next.t('error_required')} /> : ''}
                </Question>
                <div className="checkboxGrp">
                    {this._renderCheckboxItem()}
                </div>
            </div>
        );
    }

    _renderCheckboxItem() {
        const { id, item, l10n } = this.props;
        const { feedback } = this.state;
        const items = item.data.map((itm, idx) => {
            const inputID = `checkbox_${id}_${idx}`;
            const val = itm.value ? itm.value : itm.label;
            const label = l10n[itm.label] || itm.label;
            const input = l10n[itm.input] || itm.input;
            const example = l10n[itm.example] || itm.example;
            return (
                <div
                    className="checkboxItem"
                    key={idx}
                >
                    <input
                        id={inputID}
                        type="checkbox"
                        name={id}
                        value={val}
                        checked={this.state[inputID]}
                        onChange={this._onChangeHandle}
                        data-label={label}
                    />
                    <label htmlFor={inputID}>
                        {label}
                    </label>
                    {
                        input && this.state[inputID] ?
                            <input
                                type="text"
                                placeholder={input}
                                name={val}
                                defaultValue={
                                    feedback[val].hasOwnProperty('input')
                                    && feedback[val].input !== ' '
                                    ? feedback[val].input : ''}
                                onChange={this._onChangeInput}
                                maxLength="200"
                            /> : ''
                    }
                    {
                        example && example !== ' ' && this.state[inputID] ?
                            <div className="subdescription">{example}</div>
                            : ''
                    }
                </div>
            );
        });
        return items;
    }

    _onChangeHandle(e) {
        const feedback = this.state.feedback;
        const selected = this.state.selected.filter((item) =>
            item !== e.currentTarget.getAttribute('value'));

        feedback[e.currentTarget.getAttribute('value')] = {};
        if (e.currentTarget.checked) {
            feedback[e.currentTarget.getAttribute('value')].label =
            e.currentTarget.getAttribute('data-label');
            selected.push(e.currentTarget.getAttribute('value'));
        } else {
            feedback[e.currentTarget.getAttribute('value')].label = false;
        }

        this.setState({
            [`${e.currentTarget.id}`]: !this.state[e.currentTarget.id],
            feedback,
            selected
        }, () => {
            this._feedback();
            // Update complete status
            const done = this._checkDone();
            this.props.feedbackActions.updateRequired(this.props.id, done);
        });
    }

    _onChangeInput(e) {
        const feedback = this.state.feedback;
        feedback[e.currentTarget.getAttribute('name')].input =
            e.currentTarget.value ? e.currentTarget.value : ' ';

        this.setState({
            feedback
        }, () => {
            this._feedback();
        });
    }

    _feedback() {
        let data = this.props.feedback[`Q${this.props.id}`].data;
        data = data.map((item) => {
            const updatedItem = {};
            // Value will be the same
            updatedItem.value = item.value;
            // Updated Label
            if (this.state.feedback[item.value] && this.state.feedback[item.value].label) {
                updatedItem.label = this.state.feedback[item.value].label;
            } else {
                updatedItem.label = ' ';
            }
            // Updated Input
            if (this.state.feedback[item.value] && this.state.feedback[item.value].input) {
                updatedItem.input = this.state.feedback[item.value].input;
            } else if (item.input) {
                updatedItem.input = ' ';
            }
            return updatedItem;
        });
        const updatedfeedback = {
            [`Q${this.props.id}`]: {
                type: 'checkbox',
                label: this.props.item.label,
                data: data
            }
        };
        this.props.onChangeHandle(updatedfeedback);
    }

    _checkDone() {
        if (this.state.selected.length >= 1) {
            return true;
        }
        return false;
    }

    _handleState(_props) {
        const { id, item, preData } = _props;
        const state = {};
        const feedback = {};
        const selected = [];
        item.data.forEach((itm, idx) => {
            const inputID = `checkbox_${id}_${idx}`;
            if (preData
                && preData.data[idx].hasOwnProperty('label')
                && preData.data[idx].label !== ' ') {
                // If there are previous answers, set them to state
                state[inputID] = true;

                const feedbackItx = {};
                feedbackItx.label = itm.label;
                if (preData.data[idx].hasOwnProperty('input')
                    && preData.data[idx].input !== ' ') {
                    feedbackItx.input = preData.data[idx].input;
                }
                feedback[itm.value || itm.label] = feedbackItx;

                selected.push(itm.value || itm.label);
            } else {
                state[inputID] = false;
            }
        });
        state.feedback = feedback;
        state.selected = selected;

        return state;
    }
}

Checkbox.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Checkbox.defaultProps = {};

export default Checkbox;
