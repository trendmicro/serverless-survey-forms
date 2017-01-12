
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';

import Config from '../../../config';
import Mixins from '../../../mixins/global';
import IFrame from '../../IFrame';
import IconButton from '../../IconButton';
import Select from '../../Select';

class Preview extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = {
            previewType: `${props.preview}Icon`,
            selectedLang: props.lang
        };

        this._btnClickEvent = this._btnClickEvent.bind(this);
        this._onChangePreviewType = this._onChangePreviewType.bind(this);
        this._onLanguageChange = this._onLanguageChange.bind(this);
    }

    componentDidMount() {
        Mixins.fixScrollbar();
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
    }

    render() {
        const { account, previewID, preview, langList } = this.props;
        const { previewType, selectedLang } = this.state;
        const type = preview === 'embedded' ? preview : 'default';
        let buttons = [];
        ['embeddedIcon', 'previewPhoneIcon', 'previewPadIcon', 'previewDesktopIcon'].
            forEach((btn, idx) => {
                buttons.push(
                    <IconButton
                        key={idx}
                        id={`preview${idx}Btn`}
                        i18nKey={false}
                        img={btn}
                        selected={previewType === btn}
                        onClick={this._onChangePreviewType}
                        extraProps={{ 'data-type': btn }}
                    />);
            });

        // language options setting
        const langItem = [];
        langList.forEach((_lang) => {
            langItem.push({ value: _lang, label: _lang });
        });

        // to prevent cache, add Date.now() to change src
        const url = `${Config.baseURL}/feedback/index.html?v=${Date.now()}`
            + `&accountid=${account.accountid}&surveyid=${previewID}`
            + `&locale=${selectedLang}&preview=true`;
        const classSet = {
            [styles.embedded]: preview === 'embedded'
        };
        const qustom = (
            <div className={classNames(classSet)}>
                <div className={`${styles.preview} ${styles[preview]}`}>
                    <IFrame
                        url={`${url}&type=${type}`}
                    />
                </div>
            </div>);

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
                            <div className={styles.header}>
                                <div className={styles.title}>Preview</div>
                                <div className={styles.control}>
                                    {buttons}
                                </div>
                                <div className={styles.select}>
                                    <Select
                                        id="langSelect"
                                        item={langItem}
                                        selectedItem={selectedLang}
                                        onChangeHandle={this._onLanguageChange}
                                    />
                                </div>
                            </div>
                            {qustom}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _onChangePreviewType(e) {
        const { previewActions } = this.props;
        const type = e.currentTarget.getAttribute('data-type').replace('Icon', '');
        this.setState({
            previewType: e.currentTarget.getAttribute('data-type')
        });
        previewActions.changePreview(type);
    }

    _btnClickEvent() {
        const { previewActions } = this.props;
        previewActions.closePreview();
    }

    _onLanguageChange(e) {
        this.setState({
            selectedLang: e.currentTarget.getAttribute('data-value')
        });
    }
}

export default Preview;
