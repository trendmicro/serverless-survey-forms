/**
 * @module IconButton
 * Customized IconButton component fulfilling HIE's spec
 */


// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next';
import classNames from 'classnames';

class IconButton extends PureComponent {
    constructor(props) {
        super(props);
        this._onClickHandler = this._onClickHandler.bind(this);
    }

    render() {
        const { id, color, img, i18nKey, string, disabled, selected, extraProps } = this.props;
        const classSet = {
            [styles['btn-icon']]: true,
            [styles.disabled]: disabled,
            [styles.selected]: selected,
            [styles[`btn-icon-${color}`]]: color,
            [styles[`btn-icon-${img}`]]: img
        };
        const txt = string !== '' ?
            (<span className={styles.txt}>
                {!i18nKey ? string : I18Next.t(string)}
            </span>) : '';

        return (
            <div
                ref="button"
                id={id}
                onClick={this._onClickHandler}
                className={classNames(classSet)}
                {...extraProps}
            >
                <span className={styles.icon}></span>
                {txt}
            </div>
        );
    }

    _onClickHandler(e) {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }
}

IconButton.propTypes = {
    // id to identify the Button
    id: PropTypes.string,
    // (Required) Button string
    string: PropTypes.string,
    // whether the string is an i18n key (default is true)
    i18nKey: PropTypes.bool,
    // button color (blue/black, please follow the CSS rule 'btn-icon-${color}')
    color: PropTypes.string,
    // button img (add/share/report/delete, please follow the CSS rule 'btn-icon-${img}')
    img: PropTypes.string,
    // whether the Button is disabled or not (default is false)
    disabled: PropTypes.bool,
    // whether the Button is selected or not (default is false)
    selected: PropTypes.bool,
    // (Required) options onClick handler
    onClick: PropTypes.func.isRequired,
    // extra Props, ex: { "data-target-text": "test", "data-target-value": "test1" }
    extraProps: PropTypes.object
};

IconButton.defaultProps = {
    string: '',      // default string is empty
    selected: false, // default selected state = false
    disabled: false, // default disabled state = false
    i18nKey: true    // default i18nKey setting = true
};

export default IconButton;
