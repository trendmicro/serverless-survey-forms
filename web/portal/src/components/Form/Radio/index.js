
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';

import Question from '../Question';

class Radio extends PureComponent {

    constructor() {
        super();
        this._onClickQuestion = this._onClickQuestion.bind(this);
    }

    render() {
        const { data } = this.props;
        return (
            <div
                className="question"
                onClick={this._onClickQuestion}
            >
                <Question
                    text={data.label}
                />
                <div className={styles.radioGrp}>
                    {this._renderRadioItem()}
                </div>
            </div>
        );
    }

    _renderRadioItem() {
        const { data } = this.props;
        const items = data.data.map((itm, idx) => {
            const label = itm.label;
            const input = itm.input;
            return (
                <div
                    className={styles.radioItem}
                    key={idx}
                >
                    <input type="radio" />
                    <label>
                        {label}
                    </label>
                    {
                        input ?
                            <input type="text" placeholder={input} /> :
                            ''
                    }
                </div>
            );
        });
        return items;
    }

    _onClickQuestion(e) {
        e.stopPropagation();
        const { data, editQuestionIDActions } = this.props;
        editQuestionIDActions.setEditQuestionID(data.id);
    }
}

export default Radio;
