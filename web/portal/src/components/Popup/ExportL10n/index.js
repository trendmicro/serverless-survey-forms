
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import Mixins from '../../../mixins/global';
import Button from '../../Button';

class ExportL10n extends PureComponent {

    constructor(props) {
        super(props);
        this._btnClickEvent = this._btnClickEvent.bind(this);
    }

    componentDidMount() {
        Mixins.fixScrollbar();
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
    }

    render() {
        const { lang, surveyL10n } = this.props;
        const originJson = surveyL10n[lang];
        const orderedJson = {};
        Object.keys(originJson).sort().forEach((key) => {
            orderedJson[key] = originJson[key];
        });

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
                            <div className={styles.title}>Export</div>
                            <div className={styles.title}>
                                {`Here is the basic json. Please follow
                                ${lang} json format and translate content.`}
                            </div>
                            <div>
                                <textarea
                                    id="l10n"
                                    className="textarea"
                                    value={JSON.stringify(orderedJson, undefined, 4)}
                                    rows="5"
                                    readOnly="true"
                                ></textarea>
                            </div>

                            <div className={`bottom ${styles.bottom}`}>
                                <Button
                                    string="Download"
                                    i18nKey={false}
                                    color="ruby"
                                    onClick={this._btnClickEvent}
                                    extraProps={{ 'data-type': 'download' }}
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

    _btnClickEvent(e) {
        const { lang, surveyL10n, popupActions } = this.props;
        const type = e.currentTarget.getAttribute('data-type');
        if (type === 'download') {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', `${lang}.json`);
            downloadLink.setAttribute('href',
                `data:application/json;charset=utf-8,
                ${encodeURIComponent(JSON.stringify(surveyL10n[lang]))}`);
            downloadLink.click();
        } else {
            popupActions.closePopup();
        }
    }
}

export default ExportL10n;
