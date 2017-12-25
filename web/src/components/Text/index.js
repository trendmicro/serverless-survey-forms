/**
 * @module Text
 *
 *  {'type': 'text',
 *   'label': 'I am single line text'
 *  }
 **/

// CSS
// import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next/index';

import Question from '../Question/index';
import Error from '../Error';
import styles from './style.css';

class Text extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = this._handleState(props);
        this._onChangeHandle = this._onChangeHandle.bind(this);
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
                <div className={styles.inputItem}>
                    <input
                        id={`text_${id}`}
                        placeholder={l10n[item.input] || item.input}
                        type="text"
                        onChange={this._onChangeHandle}
                        defaultValue={this.state.input ? this.state.input : ''}
                        maxLength="200"
                    />
                </div>
            </div>
        );
    }

    _onChangeHandle(e) {
        this.setState({
            input: e.currentTarget.value
        }, () => {
            const feedbackArray = [
                {
                    input: this.state.input ? this.state.input : false
                }
            ];
            const feedback = {
                [`Q${this.props.id}`]: {
                    type: 'input',
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

    _checkDone() {
        if (this.state.input) {
            return true;
        }
        return false;
    }

    _handleState(_props) {
        const { preData } = _props;
        const input = preData && preData.data[0].hasOwnProperty('input')
            && preData.data[0].input !== ' ' ? preData.data[0].input : false;
        return { input };
    }

}

Text.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Text.defaultProps = {};

export default Text;
