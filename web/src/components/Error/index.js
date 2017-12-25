/**
 * @module Error msg
 * Error msg in form
 **/

// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';

class Error extends PureComponent {

    render() {
        const { msg } = this.props;
        let classes = styles.error;
        if (this.props.extraClass) {
            classes = classNames({
                [`${styles.error}`]: true,
                [`${this.props.extraClass}`]: true
            });
        }
        return (
            <span ref="root" className={classes}>
                {msg}
            </span>
        );
    }
}

Error.propTypes = {
    msg: PropTypes.string.isRequired,
    extraClass: PropTypes.string
};

export default Error;
