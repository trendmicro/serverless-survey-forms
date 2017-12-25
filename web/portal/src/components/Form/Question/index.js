/**
 * @module Question
 * question text
 **/

// CSS
import styles from './style.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Question extends Component {

    render() {
        const { id, text, required } = this.props;
        return (
            <div
                ref="root"
                className={classNames({
                    [`${styles.question}`]: true,
                    [`${styles.required}`]: required
                })}
            >
                <div
                    title={id}
                    className={styles.title}
                >
                    <div
                        className={styles.text}
                        dangerouslySetInnerHTML={this._handleQuestionTitle(text)}
                    />
                </div>
            </div>
        );
    }

    _handleQuestionTitle(text) {
        return { __html: text.replace(/(\r\n|\r|\n)/g, '<br />') };
    }

}

Question.PropTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string,
    required: PropTypes.bool
};

Question.defaultProps = {};

export default Question;
