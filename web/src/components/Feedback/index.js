/**
 * @module Feedback
 * Feedback form component
 * Will handle form components render according to data
 *
 **/
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

import Checkbox from '../Checkbox';
import Radio from '../Radio';
import Select from '../Select';
import Text from '../Text';
import Textarea from '../Textarea';
import Privacy from '../Privacy';
import Pagination from '../Pagination';

class Feedback extends PureComponent {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { paging, surveyActions } = this.props;
        const { content } = this.props.survey.data;

        const currentPageContent = content[paging - 1];
        const { description, question } = currentPageContent;
        const list = question.map(
            (itm, idx) => this._renderQuestion(itm, idx));

        return (
            <div ref="root" className={styles.wrap}>
                <div className={styles.container}>
                    <div className={styles.title} data-i18n={this.props.survey.data.title}></div>
                    {
                        description ?
                            <div className={styles.description}>{description}</div> :
                            ''
                    }
                    <div>{list}</div>
                    {
                        content.length > 1 ?
                            <Pagination
                                pages={content.length}
                                currentPage={paging}
                                surveyActions={surveyActions}
                            /> :
                            ''
                    }
                </div>
            </div>
        );
    }

    _renderQuestion(item, idx) {
        const requiredProps = {
            id: item.order,
            key: idx,
            item: item,
            onChangeHandle: this._onChangeHandle
        };
        switch (item.type) {
        case 'radio':
            return (<Radio {...requiredProps} />);
        case 'checkbox':
            return (<Checkbox {...requiredProps} />);
        case 'text':
            return (<Text {...requiredProps} />);
        case 'textarea':
            return (<Textarea {...requiredProps} />);
        case 'select':
            return (<Select {...requiredProps} />);
        case 'privacy':
            return (<Privacy {...requiredProps} />);
        default:
            return (<div key={idx + 1}>Can't find the survey component: {item.type}</div>);
        }
    }

    _onChangeHandle(e) {
        // TODOS: record the answer, add to store
        console.log(e.currentTarget);
    }
}

export default Feedback;
