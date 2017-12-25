/**
 * @module Button
 * Customized Button component fulfilling HIE's spec
 */


// CSS
import './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import I18Next from 'i18next';
import classNames from 'classnames';

class Button extends PureComponent {
    constructor(props) {
        super(props);
        this._onClickHandler = this._onClickHandler.bind(this);
    }

    render() {
        const { id, color, size, href, i18nKey, string, disabled, extraProps } = this.props;
        const classSet = {
            'btn-diamond': true,
            disabled: disabled,
            [`btn-diamond-${color}`]: color,
            [`btn-diamond-${size}`]: size
        };
        let button;
        // Button type
        if (href) {
            button = (
                <a
                    ref="button"
                    id={id}
                    onClick={this._onClickHandler}
                    className={classNames(classSet)}
                    href={href}
                    target="_blank"
                    {...extraProps}
                >
                    <span className="btnTL"></span>
                    <span className="btnTR"></span>
                    <span className="btnM">
                    {!i18nKey ? string : I18Next.t(string)}
                    </span>
                    <span className="btnBL"></span>
                    <span className="btnBR"></span>
                </a>
            );
        } else {
            button = (
                <div
                    ref="button"
                    id={id}
                    onClick={this._onClickHandler}
                    className={classNames(classSet)}
                    {...extraProps}
                >
                    <span className="btnTL"></span>
                    <span className="btnTR"></span>
                    <span className="btnM">
                    {!i18nKey ? string : I18Next.t(string)}
                    </span>
                    <span className="btnBL"></span>
                    <span className="btnBR"></span>
                </div>
            );
        }
        return button;
    }

    _onClickHandler(e) {
        if (!this.props.disabled) {
            this.props.onClick(e);
        }
    }
}

Button.propTypes = {
    // id to identify the Button
    id: PropTypes.string,
    // (Required) Button string
    string: PropTypes.string.isRequired,
    // whether the string is an i18n key (default is true)
    i18nKey: PropTypes.bool,
    // button color (ruby/primary, please follow the CSS rule 'btn-diamond-${color}')
    color: PropTypes.string,
    // button size (small, please follow the CSS rule 'btn-diamond-${size}')
    size: PropTypes.string,
    // whether the Button is disabled or not (default is false)
    disabled: PropTypes.bool,
    // (Required) options onClick handler
    onClick: PropTypes.func.isRequired,
    // whether the button is also a link
    href: PropTypes.string,
    // extra Props, ex: { "data-target-text": "test", "data-target-value": "test1" }
    extraProps: PropTypes.object
};

Button.defaultProps = {
    disabled: false, // default disabled state = false
    i18nKey: true // default i18nKey setting = true
};

export default Button;
