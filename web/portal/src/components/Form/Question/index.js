/**
 * @module Question
 * question text
 **/

// CSS
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

class Question extends PureComponent {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { text } = this.props;
        return (
            <div ref="root">
                <div className={styles.question}>{text}</div>
            </div>
        );
    }

}

Question.PropTypes = {
    text: PropTypes.string
};

Question.defaultProps = {};

export default Question;
