
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

class L10nList extends PureComponent {

    constructor() {
        super();
        this._renderList = this._renderList.bind(this);
        this._onClickEdit = this._onClickEdit.bind(this);
        this._toggleChange = this._toggleChange.bind(this);
    }

    render() {
        const { surveyL10n } = this.props;
        const l10n = Object.keys(surveyL10n);

        return (
            <div ref="root" className={`${styles.list} ${l10n.length === 0 ? 'nodata' : ''}`}>
                {l10n.length > 0 ?
                    this._renderList() :
                    <div className={styles.description}>No l10n data.</div>}
            </div>
        );
    }

    _renderList() {
        const { lang, surveyL10n, selectedL10n } = this.props;
        let list = [];
        Object.keys(surveyL10n).sort().forEach((item, idx) => {
            const language = (
                <a
                    className="link ut-title"
                    data-id={item}
                    data-basic={lang === item}
                    onClick={this._onClickEdit}
                >{`${item}${lang === item ? ' (default)' : ''}`}</a>);
            const tr = (
                <tr key={idx}>
                    <td className={styles.subject}>
                        <div className={`${styles.checkboxItem} checkboxItem ut-list`}>
                            <input
                                id={`lang${idx}`}
                                type="checkbox"
                                className={styles.checkbox}
                                value={item}
                                checked={item === selectedL10n}
                                onChange={this._toggleChange}
                            />
                            <label htmlFor={`lang${idx}`}>{language}</label>
                        </div>
                    </td>
                </tr>
            );
            list.push(tr);
        });
        return (
            <table className={styles.listTb}>
                <thead>
                    <tr>
                        <th className={styles.subject}>
                            <span>Language</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
        );
    }

    _toggleChange(e) {
        const { questionsActions } = this.props;
        questionsActions.toggleSelectedL10n(e.currentTarget.value);
    }

    _onClickEdit(e) {
        const { selectedL10n, questionsActions, popupActions } = this.props;
        const value = e.currentTarget.getAttribute('data-id');
        const basic = e.currentTarget.getAttribute('data-basic');
        if (selectedL10n !== value) questionsActions.toggleSelectedL10n(value);
        if (basic === 'true') {
            popupActions.setPopup('ExportL10n');
        } else {
            popupActions.setPopup('ReImportL10n');
        }
        e.preventDefault();
    }
}

export default L10nList;
