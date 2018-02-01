
// CSS
import styles from './style.css';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';

class Select extends PureComponent {

    constructor(props) {
        super(props);
        // set initial states
        this.state = {
            isOpen: false,
            selectedValue: props.selectedItem || ''
        };
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

    render() {
        const { item, disabled } = this.props;
        const selectClass = {
            [styles.selectGrp]: true,
            [styles.open]: this.state.isOpen,
            [styles.disabled]: disabled
        };
        const selectedItem = item.find((obj) => obj.value === this.state.selectedValue);

        return (
            <div
                ref="root"
                className={classNames(selectClass)}
                onClick={!disabled ? this._onToggleOpen : () => {}}
            >
                <span className={styles.placeholder}>
                    {selectedItem === undefined ? '--' : selectedItem.label}
                </span>
                <div className={styles.options}>
                    <ul>
                        {this._renderSelectItem()}
                    </ul>
                </div>
            </div>
        );
    }

    _renderSelectItem() {
        const { id, item } = this.props;
        const items = item.map((itm, idx) => {
            const inputID = `select_${id}_${idx}`;
            const val = itm.value ? itm.value : itm.label;
            const label = itm.label;
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
        const newValue = e.currentTarget.getAttribute('data-value');
        if (this.state.selectedValue === newValue) {
            this.setState({ isOpen: false });
        } else {
            this.setState({
                isOpen: false,
                selectedValue: newValue
            });
            this.props.onChangeHandle(e);
        }
    }

    _handleDocumentClick(e) {
        // if there are more than two dropdown list, checking the target
        if (!ReactDOM.findDOMNode(this).contains(e.target)) {
            this.setState({
                isOpen: false
            });
        }
    }

}

Select.propTypes = {
    id: PropTypes.number.isRequired,
    item: PropTypes.array.isRequired,
    selectedItem: PropTypes.string,
    disabled: PropTypes.bool,
    onChangeHandle: PropTypes.func.isRequired
};

Select.defaultProps = {
    disabled: false
};

export default Select;
