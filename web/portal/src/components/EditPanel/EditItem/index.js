
// CSS
import styles from './style.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

import * as values from '../../../constants/DefaultValues';
import * as types from '../../../constants/DragTypes';
import IconButton from '../../IconButton';

const dragSource = {
    beginDrag: function beginDrag(props) {
        return {
            index: props.id
        };
    }
};

const dropTarget = {
    hover: function hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.id;

        if (dragIndex === hoverIndex) return;

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        // Time to actually perform the action
        props.moveItem(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        Object.assign(monitor.getItem(), { index: hoverIndex });
    }
};

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}
function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class EditItem extends Component {

    constructor() {
        super();

        this._renderOption = this._renderOption.bind(this);
        this._renderOptionWithText = this._renderOptionWithText.bind(this);
        this._handleFocusEvent = this._handleFocusEvent.bind(this);
    }

    render() {
        const { id, data, onDeleteHandle, surveyEditable, isOver,
            connectDragPreview, connectDragSource, connectDropTarget } = this.props;
        const opacity = isOver ? 0.1 : 1;

        return connectDragPreview(connectDropTarget(
            <div
                className={`${styles.item} ut-item`}
                style={{ opacity }}
            >
                <div>
                    {data.hasOwnProperty('input') ?
                        this._renderOptionWithText() :
                        this._renderOption()}
                </div>
                <div>
                    <IconButton
                        string="Delete"
                        i18nKey={false}
                        img="delete"
                        onClick={surveyEditable ? () => onDeleteHandle(id) : () => {}}
                        disabled={!surveyEditable}
                    />
                </div>

                {surveyEditable ?
                    connectDragSource(
                        <div>
                            <IconButton
                                string="Move"
                                i18nKey={false}
                                img="move"
                                onClick={() => {}}
                            />
                        </div>
                    ) :
                    <IconButton
                        string="Move"
                        i18nKey={false}
                        img="move"
                        onClick={() => {}}
                        disabled={!surveyEditable}
                    />
                }
            </div>
        ));
    }

    _renderOption() {
        const { id, data, onChangeHandle } = this.props;
        return (
            <div>
                <input
                    data-id={id}
                    data-type="label"
                    type="text"
                    className={`${styles.longText} js-opt ut-input input input--medium`}
                    value={data.label}
                    onChange={onChangeHandle}
                    onFocus={this._handleFocusEvent}
                />
                <div className="input__msg js-opt-msg"></div>
            </div>
        );
    }

    _renderOptionWithText() {
        const { id, data, onChangeHandle } = this.props;
        return (
            <div>
                <input
                    data-id={id}
                    data-type="label"
                    type="text"
                    className={`${styles.shortText} js-optInput input input--medium`}
                    value={data.label}
                    onChange={onChangeHandle}
                    onFocus={this._handleFocusEvent}
                />
                <span> - </span>
                <input
                    data-id={id}
                    data-type="input"
                    type="text"
                    className={`${styles.shortText} js-optInput-input input input--medium`}
                    defaultValue={data.input === ' ' ? '' : data.input}
                    onChange={onChangeHandle}
                    onFocus={this._handleFocusEvent}
                />
                <div className="input__msg js-optInput-msg"></div>
                <input
                    data-id={id}
                    data-type="example"
                    type="text"
                    className={`${styles.longText} js-optInput-example input input--medium`}
                    placeholder="Please type sub description"
                    defaultValue={
                        !data.hasOwnProperty('example') || data.example === ' ' ? '' : data.example}
                    onChange={onChangeHandle}
                />
            </div>
        );
    }

    _handleFocusEvent(e) {
        const target = e.target;
        const compareStr = target.getAttribute('data-type') === 'label' ?
            values.OPTION_TITLE : values.PLACEHOLDER_TITLE;
        if (target.value === compareStr) {
            target.value = '';
        }
    }
}

EditItem.propTypes = {
    id: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    onChangeHandle: PropTypes.func.isRequired
};

EditItem.defaultProps = {};

export default DragSource(types.DRAG_OPTION, dragSource, dragCollect)(
    DropTarget(types.DRAG_OPTION, dropTarget, dropCollect)(EditItem)
);
