/**
 * @module Radio
 *
 *  {'type': 'radio',
 *   'label': 'I am radio question text',
 *   'data': [
 *       {'value': '1', 'label': 'radio label 1'},
 *       {'value': '2', 'label': 'radio label 2'},
 *       {'value': '3', 'label': 'radio label 3'},
 *       ...
 *   ]
 *  }
 **/

// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next/index';

import Question from '../Question/index';
import Error from '../Error';

class Radio extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = this._handleState(props);
        this._onChangeHandle = this._onChangeHandle.bind(this);
        this._onChangeInput = this._onChangeInput.bind(this);
        this._checkDone = this._checkDone.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._handleState(nextProps));
    }

    render() {
        const { id, itemID, item, feedbackActions, pageDone, l10n } = this.props;
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
                <div className={styles.radioGrp}>
                    {this._renderRadioItem()}
                </div>
            </div>
        );
    }

    _renderRadioItem() {
        const { id, item, l10n } = this.props;
        const { feedbackArray } = this.state;

        const items = item.data.map((itm, idx) => {
            const inputID = `radio_${id}_${idx}`;
            const val = itm.value ? itm.value : itm.label;
            const label = l10n[itm.label] || itm.label;
            const input = l10n[itm.input] || itm.input;
            const example = l10n[itm.example] || itm.example;
            return (
                <div
                    className="radioItem"
                    key={idx}
                >
                    <input
                        id={inputID}
                        type="radio"
                        name={id}
                        value={val}
                        data-label={label}
                        checked={this.state.selected === val}
                        onChange={this._onChangeHandle}
                    />
                    <label htmlFor={inputID}>
                        {label}
                    </label>
                    {
                        input && this.state.selected === val ?
                            <input
                                type="text"
                                placeholder={input}
                                name={val}
                                defaultValue={
                                    feedbackArray[0].hasOwnProperty('input')
                                    && feedbackArray[0].input !== ' '
                                    ? feedbackArray[0].input : ''}
                                onChange={this._onChangeInput}
                                maxLength="200"
                            /> : ''
                    }
                    {
                        example && example !== ' ' && this.state.selected === val ?
                            <div className="subdescription">{example}</div>
                            : ''
                    }
                </div>
            );
        });
        return items;
    }

    _onChangeHandle(e) {
        const feedbackArray = [];
        const feedbackItem = {
            value: e.currentTarget.getAttribute('value'),
            label: e.currentTarget.getAttribute('data-label')
        };
        feedbackArray.push(feedbackItem);
        this.setState({
            selected: e.currentTarget.getAttribute('value'),
            feedbackArray
        }, () => {
            const feedback = {
                [`Q${this.props.id}`]: {
                    type: 'radio',
                    label: this.props.item.label,
                    data: feedbackArray
                }
            };
            this.props.onChangeHandle(feedback);
            // Update complete status
            const done = this._checkDone();
            this.props.feedbackActions.updateRequired(this.props.id, done);
        });
    }

    _onChangeInput(e) {
        const feedbackArray = this.state.feedbackArray;
        // Find the item, update the input
        feedbackArray.map((item) => {
            const updatedItem = item;
            if (item.value === e.currentTarget.getAttribute('name')) {
                updatedItem.input = e.currentTarget.value ? e.currentTarget.value : ' ';
            }
            return updatedItem;
        });
        this.setState({
            feedbackArray
        }, () => {
            const feedback = {
                [`Q${this.props.id}`]: {
                    type: 'radio',
                    label: this.props.item.label,
                    data: feedbackArray
                }
            };
            this.props.onChangeHandle(feedback);
        });
    }

    _checkDone() {
        if (this.state.selected) {
            return true;
        }
        return false;
    }

    _handleState(_props) {
        const { preData } = _props;
        let selected;
        let feedbackArray = [];
        if (preData && preData.data[0]) {
            const data = preData.data[0];
            selected = data.hasOwnProperty('label') && data.label !== ' ' ? data.value : false;
            if (selected) {
                feedbackArray = [{
                    value: selected,
                    label: data.label
                }];
                if (data.hasOwnProperty('input') && data.input !== ' ') {
                    feedbackArray[0].input = data.input;
                }
            }
        }
        return { selected, feedbackArray };
    }
}

Radio.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Radio.defaultProps = {};

export default Radio;
