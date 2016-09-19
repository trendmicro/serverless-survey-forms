/**
 * @module Rating
 *
 *  {'type': 'rating',
 *   'label': 'I am rating question text',
 *   'data': [
 *       {'value': '1', 'label': 'rating label 1'},
 *       {'value': '2', 'label': 'rating label 2'},
 *       {'value': '3', 'label': 'rating label 3'},
 *       ...
 *   ]
 *  }
 **/

// CSS
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next';

import Question from '../Question/index';
import Error from '../Error';

class Rating extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            rating: undefined,
            reason: false,
            feedbackArray: []
        };
        this._onChangeHandle = this._onChangeHandle.bind(this);
        this._renderLabel = this._renderLabel.bind(this);
        this._onChangeInput = this._onChangeInput.bind(this);
        this._checkDone = this._checkDone.bind(this);
    }

    render() {
        const { id, item } = this.props;
        return (
            <div ref="root" className="question">
                <Question
                    id={id}
                    text={item.label}
                    required={item.required}
                />
                <div className={styles.ratingWrapper}>
                    <ul className={styles.ratingGrp}>
                        {this._renderRatingItem()}
                    </ul>
                    {
                        item.input && this.state.selected ?
                            <input
                                type="text"
                                placeholder={item.input}
                                onChange={this._onChangeInput}
                            /> : ''
                    }
                    {!this.props.pageDone ? <Error msg={I18Next.t('error_required')} /> : ''}
                </div>
            </div>
        );
    }

    _renderRatingItem() {
        const { id, item } = this.props;
        const items = item.data.map((itm, idx) => {
            const inputID = `rating_${id}_${idx}`;
            const val = itm.value;
            const label = itm.label;
            return (
                <li
                    className={styles.ratingItem}
                    id={inputID}
                    key={idx}
                    data-value={val}
                    data-label={label}
                    onClick={this._onChangeHandle}
                >
                    <div className={styles.label}>{label}</div>
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
                            checked={this.state.selected === inputID}
                            onChange={this._onChangeHandle}
                        />
                        <label htmlFor={inputID} />
                    </div>
                </li>
            );
        });
        return items;
    }

    _renderLabel(item) {
        return (
            <li className={styles.label}>{item.label}</li>
        );
    }

    _onChangeHandle(e) {
        const feedbackArray = [{
            value: e.currentTarget.getAttribute('data-value'),
            label: e.currentTarget.getAttribute('data-label'),
            input: this.state.reason ? this.state.reason : ' '
        }];
        this.setState({
            selected: e.currentTarget.id,
            rating: e.currentTarget.getAttribute('data-value'),
            feedbackArray
        }, () => {
            const feedback = {
                [`Q${this.props.id}`]: {
                    type: 'rating',
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
        this.setState({
            reason: e.currentTarget.value
        }, () => {
            feedbackArray.map((item) => {
                const updatedItem = item;
                updatedItem.input = this.state.reason ? this.state.reason : ' ';
                return updatedItem;
            });
            const feedback = {
                [`Q${this.props.id}`]: {
                    type: 'rating',
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
}

Rating.PropTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Rating.defaultProps = {};

export default Rating;
