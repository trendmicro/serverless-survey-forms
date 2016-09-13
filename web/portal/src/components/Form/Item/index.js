
// CSS
import styles from './style.css';

import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import * as types from '../../../constants/DragTypes';

import Radio from '../Radio';
import Checkbox from '../Checkbox';
import Rating from '../Rating';
import IconButton from '../../IconButton';

const dragSource = {
    beginDrag: function beginDrag(props) {
        return {
            id: props.data.id,
            page: props.page,
            originalIndex: props.getQuestion(props.data.id).index
        };
    },
    endDrag: function endDrag(props, monitor) {
        const didDrop = monitor.didDrop();
        let droppedPage;
        let droppedIndex;
        if (!didDrop) {
            droppedPage = props.dropQuestion.page;
            droppedIndex = props.dropQuestion.index;
        } else {
            droppedPage = monitor.getDropResult().page;
            droppedIndex = monitor.getDropResult().index;
        }
        if (droppedPage !== undefined && droppedIndex !== undefined) {
            props.moveQuestion(monitor.getItem().id, droppedPage, droppedIndex);
            // save Question
            props.questionsActions.saveQuestion();
        }
        props.questionsActions.stopDropQuestion();
    }
};

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

const dropTarget = {
    drop: function drop(props) {
        return {
            id: props.data.id,
            page: props.page,
            originalIndex: props.getQuestion(props.data.id).index
        };
    },
    canDrop: function canDrop() {
        return true;
    },
    hover: function hover(props) {
        const { data, page, dropQuestion, getQuestion, questionsActions } = props;
        const overId = data.id;
        const overPage = page;
        const overIndex = getQuestion(overId).index;
        if (dropQuestion.page !== overPage || dropQuestion.index !== overIndex) {
            questionsActions.setDropQuestion({ page: overPage, index: overIndex });
        }
    }
};

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class Item extends Component {

    constructor() {
        super();
        this._renderQuestion = this._renderQuestion.bind(this);
        this._onClickItem = this._onClickItem.bind(this);
        this._onCopyHandle = this._onCopyHandle.bind(this);
        this._onDeleteHandle = this._onDeleteHandle.bind(this);
    }

    render() {
        const { data, editQuestion, isDragging,
            connectDragPreview, connectDragSource, connectDropTarget } = this.props;
        return connectDragPreview(connectDropTarget(
            <div
                className="questionGrp ut-question"
                style={{
                    display: isDragging ? 'none' : 'block'
                }}
            >
                <div
                    className={`questionItem ${data.id === editQuestion.id ? 'edit' : ''} ut-item`}
                >
                    {this._renderQuestion()}
                    <div className={`control ${styles.control}`}>
                        {connectDragSource(
                            <div>
                                <IconButton
                                    string="Move"
                                    i18nKey={false}
                                    img="move"
                                    onClick={() => {}}
                                    extraProps={{ style: { cursor: 'move' } }}
                                />
                            </div>
                        )}
                        <IconButton
                            string="Copy"
                            i18nKey={false}
                            img="copy"
                            onClick={this._onCopyHandle}
                        />
                        <IconButton
                            string="Remove"
                            i18nKey={false}
                            img="delete"
                            onClick={this._onDeleteHandle}
                        />
                    </div>
                </div>
                <div className="questionLine"></div>
            </div>
        ));
    }

    _renderQuestion() {
        const { data, editQuestion } = this.props;
        const itemData = data.id === editQuestion.id ? editQuestion : data;
        let obj;
        switch (itemData.type) {
        case 'radio':
            obj = (<Radio data={itemData} onClick={this._onClickItem} />);
            break;
        case 'checkbox':
            obj = (<Checkbox data={itemData} onClick={this._onClickItem} />);
            break;
        case 'rating':
            obj = (<Rating data={itemData} onClick={this._onClickItem} />);
            break;
        default:
            obj = (<div>{JSON.stringify(itemData)}</div>);
        }
        return obj;
    }

    _onClickItem() {
        const { data, editQuestionActions } = this.props;
        editQuestionActions.setEditQuestion(data);
    }

    _onCopyHandle() {
        const { idx, page, questionsActions } = this.props;
        questionsActions.copyQuestion(page, idx);
        // save Question
        questionsActions.saveQuestion();
    }

    _onDeleteHandle() {
        const { idx, page, questionsActions } = this.props;
        questionsActions.deleteQuestion(page, idx);
        // save Question
        questionsActions.saveQuestion();
    }
}

export default DragSource(types.DRAG_QUESTION, dragSource, dragCollect)(
    DropTarget(types.DRAG_QUESTION, dropTarget, dropCollect)(Item)
);
