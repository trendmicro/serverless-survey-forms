
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import Mixins from '../../../mixins/global';
import Button from '../../Button';
import Select from '../../Select';

class Subject extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = { selectedLang: props.lang || 'en-US' };
        this._btnClickEvent = this._btnClickEvent.bind(this);
        this._onLanguageChange = this._onLanguageChange.bind(this);
    }

    componentDidMount() {
        Mixins.fixScrollbar();
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
    }

    render() {
        const { subject } = this.props;
        // language options setting
        const item = [
            { value: 'ar', label: 'Arabic (Standard)' },
            { value: 'de', label: 'German (Standard)' },
            { value: 'en-US', label: 'English (United States)' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French (Standard)' },
            { value: 'fr-CA', label: 'French (Canada)' },
            { value: 'it', label: 'Italian (Standard)' },
            { value: 'pt', label: 'Portuguese' },
            { value: 'ru', label: 'Russian' },
            { value: 'sv', label: 'Swedish' },
            { value: 'zh-TW', label: 'Chinese (Taiwan)' }
        ];
        return (
            <div className={`${styles.popup} popup`}>
                <div className="popup_wrap">
                    <div className={`${styles.wrap} wrap`}>
                        <button
                            type="button"
                            onClick={this._btnClickEvent}
                            className="close"
                            data-type="cancel"
                        >×
                        </button>
                        <div className={`${styles.content} content`}>
                            <div className={styles.title}>
                                What would you like to name this survey?
                            </div>
                            <input
                                id="subject"
                                className={`${styles.input} input input--medium`}
                                type="text"
                                defaultValue={subject}
                                placeholder="Subject Name"
                                onChange={this._handleInput}
                            />
                            <div id="msg" className={`${styles.input__msg} input__msg`}></div>
                            <div className={`${styles.title} ${styles.language}`}>
                                What language is used in this survey?
                            </div>
                            <Select
                                id="langSelect"
                                item={item}
                                selectedItem={this.state.selectedLang}
                                onChangeHandle={this._onLanguageChange}
                            />

                            <div className={`bottom ${styles.bottom}`}>
                                <Button
                                    string="Start"
                                    i18nKey={false}
                                    color="ruby"
                                    onClick={this._btnClickEvent}
                                    extraProps={{ 'data-type': 'save' }}
                                />
                                <Button
                                    string="Cancel"
                                    i18nKey={false}
                                    onClick={this._btnClickEvent}
                                    extraProps={{ 'data-type': 'cancel' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _handleInput() {
        const msg = document.getElementById('msg');
        if (msg.innerHTML.length) msg.innerHTML = '';
    }

    _onLanguageChange(e) {
        this.setState({
            selectedLang: e.currentTarget.getAttribute('data-value')
        });
    }

    _btnClickEvent(e) {
        const { surveyID, editSubjectActions, subjectActions } = this.props;
        const { selectedLang } = this.state;
        const msg = document.getElementById('msg');
        msg.innerHTML = '';

        if (e.currentTarget.getAttribute('data-type') === 'cancel') {
            editSubjectActions.openEdit(false);
        } else if (e.currentTarget.getAttribute('data-type') === 'save') {
            // Error handling
            const subject = document.getElementById('subject').value;
            if (subject === '') {
                msg.innerHTML = 'Please fill subject name';
            } else {
                if (!surveyID) {
                    subjectActions.saveSubject(subject, selectedLang);
                } else {
                    subjectActions.editSubject(subject, selectedLang);
                }
            }
        }
    }
}

export default Subject;
