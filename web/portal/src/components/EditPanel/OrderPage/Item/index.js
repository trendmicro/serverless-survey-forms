
// CSS
import styles from './../style.css';

import React from 'react';
import { findDOMNode } from 'react-dom';
import PureComponent from 'react-pure-render/component';
import { DragSource, DropTarget } from 'react-dnd';

import * as types from '../../../../constants/DragTypes';
import IconButton from '../../../IconButton';

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

class Item extends PureComponent {
    render() {
        const { orderId, page, isOver,
            connectDragPreview, connectDragSource, connectDropTarget } = this.props;
        const opacity = isOver ? 0.1 : 1;

        return connectDragPreview(connectDropTarget(
            <div className={`${styles.item} ut-obj`} style={{ opacity }}>
                <div className={styles.info}>
                    Page {orderId}:
                    <span className={`${styles.title} ut-title`}>{page.description}</span>
                </div>
                {connectDragSource(
                    <div className={styles.drag}>
                        <IconButton
                            string="Move"
                            i18nKey={false}
                            img="move"
                            onClick={() => {}}
                            extraProps={{ style: { cursor: 'move' } }}
                        />
                    </div>
                )}
            </div>
        ));
    }
}

export default DragSource(types.DRAG_PAGE, dragSource, dragCollect)(
    DropTarget(types.DRAG_PAGE, dropTarget, dropCollect)(Item)
);
