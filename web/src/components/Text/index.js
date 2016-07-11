/**
 * @module Text
 *
 *  {'type': 'text',
 *   'label': 'I am single line text'
 *  }
 **/

// CSS
// import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

import Question from '../Question/index';

class Text extends PureComponent {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { id, item, onChangeHandle } = this.props;
        return (
            <div ref="root" className="question">
                <Question
                    id={id}
                    text={item.label}
                    required={item.required}
                />
                <div>
                    <input
                        id={`text_${id}`}
                        type="text"
                        onChange={onChangeHandle}
                    />
                </div>
            </div>
        );
    }

}

Text.PropTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Text.defaultProps = {};

export default Text;
