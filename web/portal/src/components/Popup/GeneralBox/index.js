
// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from 'react-pure-render/component';

import Mixins from '../../../mixins/global';

class GeneralBox extends PureComponent {

    componentDidMount() {
        Mixins.fixScrollbar();
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
    }

    render() {
        const { id, renderText, renderFooter, closeHandler } = this.props;
        const button = typeof closeHandler === 'function' ?
            (<button
                type="button"
                className="close"
                data-type="cancel"
                onClick={closeHandler}
            >×
            </button>) : '';
        const bottom = typeof renderFooter === 'function' ?
            (<div className={styles.bottom}>
                {renderFooter()}
            </div>) : '';

        return (
            <div id={id} className={`${styles.popup} popup`}>
                <div className="popup_wrap">
                    <div className={`${styles.wrap} wrap`}>
                        {button}
                        <div className={`${styles.content} content`}>
                            <div className={styles.title}>
                                {renderText()}
                            </div>
                            {bottom}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GeneralBox.propTypes = {
    id: PropTypes.string,
    renderText: PropTypes.func.isRequired,
    renderFooter: PropTypes.func,
    closeHandler: PropTypes.func
};

GeneralBox.defaultProps = {
    id: 'popup'
};

export default GeneralBox;
