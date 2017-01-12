/**
 * @module Feedback
 * Feedback form component
 * Will handle form components render according to data
 *
 **/
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next';

import Checkbox from '../Checkbox';
import Radio from '../Radio';
import Select from '../Select';
import Text from '../Text';
import Textarea from '../Textarea';
import Rating from '../Rating';
import Privacy from '../Privacy';
import Pagination from '../Pagination';

class Feedback extends PureComponent {

    constructor(props) {
        super(props);
        this._renderPreview = this._renderPreview.bind(this);
        this._renderEmbedded = this._renderEmbedded.bind(this);
        this._renderThankyou = this._renderThankyou.bind(this);
        this._setLocalize = this._setLocalize.bind(this);
        this._onChangeHandle = this._onChangeHandle.bind(this);
        this._onClose = this._onClose.bind(this);
    }

    render() {
        const { settings, done } = this.props;
        let feedbackView;
        if (settings.type === 'default') {
            feedbackView = this._renderPreview();
        } else {
            feedbackView = this._renderEmbedded();
        }
        return (
            <div ref="root">
                {done ? this._renderThankyou() : feedbackView}
            </div>
        );
    }

    _renderEmbedded() {
        const { settings, paging, survey, surveyActions, feedbackActions, pageDone } = this.props;

        const currentPageContent = survey.content[paging - 1];
        const { description, question } = currentPageContent;
        const list = question.map(
            (itm, idx) => this._renderQuestion(itm, idx));

        return (
            <div className={styles.wrap}>
                <div className={styles.header}>
                    <h1>{this._setLocalize('subject')}</h1>
                    <div onClick={this._onClose} className={styles.close} />
                </div>
                <div className={styles.container}>
                    <div className={styles.contentScroll}>
                        <div className={styles.content}>
                        {
                            description && description !== 'Untitled Page' ?
                                <div className={styles.description}>
                                    {this._setLocalize(description)}
                                </div> :
                                ''
                        }
                            <div>{list}</div>
                        </div>
                    </div>
                    <Pagination
                        pages={survey.content.length}
                        pageDone={pageDone}
                        currentPage={paging}
                        surveyActions={surveyActions}
                        feedbackActions={feedbackActions}
                        settings={settings}
                    />
                </div>
            </div>
        );
    }

    _renderPreview() {
        const { settings, paging, survey, surveyActions, feedbackActions, pageDone } = this.props;

        const currentPageContent = survey.content[paging - 1];
        const { description, question } = currentPageContent;
        const list = question.map(
            (itm, idx) => this._renderQuestion(itm, idx));

        return (
            <div className={styles.wrapPreview}>
                <div className={styles.header}>
                    <h1>{this._setLocalize('subject')}</h1>
                </div>
                <div className={styles.container}>
                    <div className={styles.contentScrollPreview}>
                        <div className={styles.content}>
                        {
                            description && description !== 'Untitled Page' ?
                                <div className={styles.description}>
                                    {this._setLocalize(description)}
                                </div> :
                                ''
                        }
                            <div className={styles.feedbackPreview}>{list}</div>
                        </div>
                    </div>
                </div>
                <Pagination
                    pages={survey.content.length}
                    pageDone={pageDone}
                    currentPage={paging}
                    surveyActions={surveyActions}
                    feedbackActions={feedbackActions}
                    settings={settings}
                />
            </div>
        );
    }

    _renderQuestion(item, idx) {
        const requiredProps = {
            feedback: this.props.feedback,
            id: item.order,
            itemID: item.id,
            key: idx,
            item: item,
            paging: this.props.paging,
            pageDone: this.props.pageDone,
            l10n: this.props.l10n,
            requiredData: this.props.requiredData,
            onChangeHandle: this._onChangeHandle,
            feedbackActions: this.props.feedbackActions
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
        case 'rating':
            return (<Rating {...requiredProps} />);
        default:
            return (<div key={idx + 1}>Can't find the survey component: {item.type}</div>);
        }
    }

    _renderThankyou() {
        const { settings, prefillData, submit, feedbackActions, paging } = this.props;
        const { subject } = this.props.survey;
        const { description, privacy } = this.props.survey.thankyou;
        return (
            <div
                className={
                    this.props.settings.type === 'default' ?
                        styles.wrapPreview : styles.wrap}
            >
                <div className={styles.header}>
                    <h1>{subject}</h1>
                    <div onClick={this._onClose} className={styles.close} />
                </div>
                <div className={styles.container}>
                    <div
                        className={
                            this.props.settings.type === 'default' ?
                                styles.contentScrollPreview : styles.contentScroll}
                    >
                        <div className={styles.content}>
                        {
                            description ?
                                <div className={styles.description}>
                                    {I18Next.t('privacy_description')}
                                </div> :
                                ''
                        }
                            <div
                                className={
                                    this.props.settings.type === 'default' &&
                                    Object.keys(privacy).length !== 0 ?
                                    styles.feedbackPreview : ''}
                            >
                            {
                                Object.keys(privacy).length !== 0 ?
                                    <Privacy
                                        settings={settings}
                                        prefillData={prefillData}
                                        paging={paging}
                                        submit={submit}
                                        onChangeHandle={this._onChangeHandle}
                                        feedbackActions={feedbackActions}
                                    /> : ''
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _setLocalize(key) {
        const { survey, l10n } = this.props;
        if (key === 'subject') {
            return l10n.subject || survey.subject;
        }
        return l10n[key] || key;
    }

    _onChangeHandle(feedback) {
        // Add feedback to store
        this.props.feedbackActions.recordFeedback(feedback);
    }

    _onClose() {
        this.props.feedbackActions.sendMsgToClient('close', {
            page: this.props.done ? this.props.paging + 1 : this.props.paging
        });
    }
}

export default Feedback;
