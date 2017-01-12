
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import Mixins from '../../../mixins/global';
import Button from '../../Button';
import Select from '../../Select';

class ImportL10n extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { newLang: '' };
        this._onLanguageChange = this._onLanguageChange.bind(this);
        this._btnClickEvent = this._btnClickEvent.bind(this);
    }

    componentDidMount() {
        Mixins.fixScrollbar();
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
    }

    render() {
        // language options setting
        const item = [
            { value: 'en-US', label: 'English (United States)' },
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
                            <div className={styles.title}>Import</div>
                            <div className={styles.title}>
                                Please choose which language you are going to save.
                            </div>
                            <div className={styles.select}>
                                <Select
                                    id="langSelect"
                                    item={item}
                                    onChangeHandle={this._onLanguageChange}
                                />
                                <div id="langMsg" className="input__msg"></div>
                            </div>
                            <div className={styles.title}>
                                Please paste this language’s json.
                            </div>
                            <div>
                                <textarea
                                    id="l10n"
                                    className="textarea"
                                    rows="5"
                                ></textarea>
                                <div id="l10nMsg" className="input__msg"></div>
                            </div>

                            <div className={`bottom ${styles.bottom}`}>
                                <Button
                                    string="Save"
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

    _onLanguageChange(e) {
        const { surveyL10n } = this.props;
        const value = e.currentTarget.getAttribute('data-value');
        const msg = document.getElementById('langMsg');
        if (surveyL10n.hasOwnProperty(value)) {
            msg.innerHTML = 'This language already exists.';
        } else {
            this.setState({ newLang: value });
            msg.innerHTML = '';
        }
    }

    _btnClickEvent(e) {
        const { lang, surveyL10n, popupActions, questionsActions } = this.props;
        const type = e.currentTarget.getAttribute('data-type');
        if (type === 'save') {
            const langMsg = document.getElementById('langMsg');
            let l10n = document.getElementById('l10n').value;
            const msg = document.getElementById('l10nMsg');

            // check l10n json
            if (l10n === '') {
                msg.innerHTML = 'Please paste this language\'s json.';
            } else {
                try {
                    l10n = JSON.parse(l10n);
                    if (typeof l10n === 'object'
                        && l10n instanceof Object
                        && !(l10n instanceof Array)
                        && !l10n.length) {
                        // check whether all l10n keys exist
                        const basicCompared = Object.keys(surveyL10n[lang]).sort();
                        const l10nCompared = Object.keys(l10n).sort();
                        const isEqual = basicCompared.length === l10nCompared.length
                            && basicCompared.every((ele, idx) => ele === l10nCompared[idx]);
                        if (!isEqual) {
                            msg.innerHTML = 'There are some keys can\'t correspond'
                                + ' to the default language.';
                        } else {
                            msg.innerHTML = '';
                            if (this.state.newLang !== '' && langMsg.innerHTML === '') {
                                // save json format
                                questionsActions.importL10n({ [this.state.newLang]: l10n });
                            } else {
                                langMsg.innerHTML = 'Incorrect language.';
                            }
                        }
                    } else {
                        msg.innerHTML = 'Incorrect json format.';
                    }
                } catch (err) {
                    msg.innerHTML = 'Incorrect json format.';
                }
            }
        } else {
            popupActions.closePopup();
        }
    }
}

export default ImportL10n;
