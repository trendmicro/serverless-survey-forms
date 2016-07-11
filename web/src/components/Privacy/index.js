/**
 * @module Privacy
 * Privacy agreement component
 *
 **/
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

class Privacy extends PureComponent {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { item } = this.props;
        return (
            <div ref="root" className="question">
                <div className={styles.question}>{item.label}</div>
                <div className={styles.terms}>
                    <input type="checkbox" />
                    <div className={styles.desc}>{item.terms}</div>
                    <input type="text" placeholder={item.input} />
                </div>
            </div>
        );
    }

}

Privacy.PropTypes = {
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Privacy.defaultProps = {};

export default Privacy;
