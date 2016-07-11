
// CSS
import styles from './style.css';

import React, { Component } from 'react';
import $ from 'jquery';

import Description from '../Description';
import Radio from '../Radio';

class Page extends Component {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { data } = this.props;
        // TODOS: define components
        const list = [];
        data.question.forEach((question, idx) => {
            list.push(this._renderQuestion(question, idx));
        });

        return (
            <div className={styles.wrap}>
                <div>{data.description}</div>
                {list}
            </div>
        );
    }

    _renderQuestion(question, idx) {
        const requiredProps = {
            key: idx,
            data: question,
            editQuestionIDActions: this.props.editQuestionIDActions
        };
        switch (question.type) {
        case 'radio':
            return (<Radio {...requiredProps} />);
        case 'description':
            return (<Description {...requiredProps} />);
        default:
            return (<div>{JSON.stringify(question)}</div>);
        }
    }
}

export default Page;
