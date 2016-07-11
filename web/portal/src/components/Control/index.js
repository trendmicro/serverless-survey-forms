
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

class Control extends PureComponent {

    constructor() {
        super();
        this._onAddQueClick = this._onAddQueClick.bind(this);
        this._onAddPageClick = this._onAddPageClick.bind(this);
    }

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        return (
            <div ref="root" className={styles.control}>
                <button onClick={this._onAddQueClick}>
                    Add Question
                </button>
                <button onClick={this._onAddQueClick}>
                    Add Text
                </button>
                <button onClick={this._onAddPageClick}>
                    Add Page
                </button>
            </div>
        );
    }

    _onAddQueClick() {
        const { questionsActions } = this.props;
        const data = {
            id: this._generateQuestionID(),
            order: 1,
            type: 'radio',
            label: 'Untitle Question',
            data: [
                { value: '1', label: 'default option' }
            ],
            required: true
        };
        questionsActions.addQuestion(1, data);
    }

    _onAddPageClick() {
        const { questionsActions } = this.props;
        const data = {
            id: this._generateQuestionID(),
            order: 1,
            type: 'radio',
            label: 'Untitle Question',
            data: [
                { value: '1', label: 'default option' }
            ],
            required: true
        };
        questionsActions.addQuestion(2, data);
    }

    _generateQuestionID() {
        return (Date.now().toString(32) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    }
}

export default Control;
