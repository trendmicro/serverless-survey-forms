/**
 * @module Select
 *
 *  {'type': 'select',
 *   'label': 'I am select question text',
 *   'data': [
 *       {'value': '1', 'label': 'select label 1'},
 *       {'value': '2', 'label': 'select label 2'},
 *       {'value': '3', 'label': 'select label 3'},
 *       ...
 *   ]
 *  }
 **/

// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';

import Question from '../Question/index';

class Select extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = Object.assign({ isOpen: false }, this._handleState(props));
        this._onToggleOpen = this._onToggleOpen.bind(this);
        this._onClickCallback = this._onClickCallback.bind(this);
        this._handleDocumentClick = this._handleDocumentClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this._handleDocumentClick);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this._handleDocumentClick);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this._handleState(nextProps));
    }

    render() {
        const { id, item, l10n } = this.props;
        const selectClass = {
            [styles.selectGrp]: true,
            [styles.open]: this.state.isOpen
        };
        const selectedItem = item.data.find((obj) => obj.value === this.state.selectedValue);
        return (
            <div ref="root" className="question">
                <Question
                    id={id}
                    text={l10n[item.label] || item.label}
                    required={item.required}
                />
                <div
                    className={classNames(selectClass)}
                    onClick={this._onToggleOpen}
                >
                    <span className={styles.placeholder}>
                        {selectedItem === undefined ?
                        '--' : (l10n[item.label] || selectedItem.label)}
                    </span>
                    <div className={styles.options}>
                        <ul>
                            {this._renderSelectItem()}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    _renderSelectItem() {
        const { id, item, l10n } = this.props;
        const items = item.data.map((itm, idx) => {
            const inputID = `select_${id}_${idx}`;
            const val = itm.value ? itm.value : itm.label;
            const label = l10n[itm.label] || itm.label;
            const optClass = {
                selectItem: true,
                selected: this.state.selectedValue === val
            };
            return (
                <li
                    className={classNames(optClass)}
                    key={idx}
                    id={inputID}
                    data-value={val}
                    data-label={label}
                    onClick={this._onClickCallback}
                >
                    <span>{label}</span>
                </li>
            );
        });
        return items;
    }

    _onToggleOpen() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    _onClickCallback(e) {
        this.setState({
            isOpen: false,
            selectedValue: e.currentTarget.getAttribute('data-value')
        });
        const feedbackArray = [{
            value: e.currentTarget.getAttribute('data-value'),
            label: e.currentTarget.getAttribute('data-label')
        }];
        const feedback = {
            [`Q${this.props.id}`]: {
                type: 'select',
                label: this.props.item.label,
                data: feedbackArray
            }
        };
        this.props.onChangeHandle(feedback);
    }

    _handleDocumentClick(e) {
        // if there are more than two dropdown list, checking the target
        if (!ReactDOM.findDOMNode(this).contains(e.target)) {
            this.setState({
                isOpen: false
            });
        }
    }

    _handleState(_props) {
        const { preData } = _props;
        let selectedValue;
        if (preData && preData.data[0]) {
            const data = preData.data[0];
            selectedValue = data.hasOwnProperty('label') && data.label !== ' ' ? data.value : '';
        }
        return { selectedValue };
    }
}

Select.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

Select.defaultProps = {};

export default Select;
