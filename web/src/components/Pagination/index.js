/**
 * @module Pagination
 * Pagination component, only appeared if paging is more than one
 *
 **/
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';
import Button from '../Button';

class Pagination extends PureComponent {

    constructor() {
        super();
        this._prev = this._prev.bind(this);
        this._next = this._next.bind(this);
        this._done = this._done.bind(this);
    }

    render() {
        const { settings, currentPage, pages } = this.props;
        return (
            <div
                className={classNames({
                    [`${styles.pagination}`]: settings.type !== 'default',
                    [`${styles.paginationPreview}`]: settings.type === 'default',
                    'ut-pagination': true
                })}
            >
                {
                    pages > 1 && currentPage < pages ?
                        <div
                            className={
                                settings.type === 'default' ?
                                    styles.btnWrapperNextPreview : styles.btnWrapperNext
                            }
                        >
                            <Button
                                string={'next'}
                                onClick={this._next}
                                extraClass={{
                                    'ut-next': true,
                                    [`${styles.pagingBtnNext}`]: true
                                }}
                            />
                        </div> : ''
                }
                {
                    pages > 1 && currentPage < pages ?
                        <div
                            className={classNames({
                                [`${styles.nextMobile}`]: true,
                                'ut-next': true
                            })}
                            onClick={this._next}
                        /> : ''
                }
                {
                    currentPage === pages ?
                        <div
                            className={
                                settings.type === 'default' ?
                                    styles.btnWrapperNextPreview : styles.btnWrapperNext
                            }
                        >
                            <Button
                                string={'submit'}
                                onClick={this._done}
                                extraClass={{
                                    'ut-done': true,
                                    [`${styles.pagingBtnNext}`]: true
                                }}
                            />
                        </div> : ''
                }
                {
                    currentPage === pages ?
                        <div
                            className={classNames({
                                [`${styles.doneMobile}`]: true,
                                'ut-done': true
                            })}
                            onClick={this._done}
                        /> : ''
                }
                {
                    pages > 1 ?
                        <div
                            className={
                                settings.type === 'default' ?
                                    styles.progressWrapperPreview : styles.progressWrapper
                            }
                        >
                            <span
                                className={styles.progressText}
                            >
                                {`${currentPage} / ${pages}`}
                            </span>
                            <div
                                className={classNames({
                                    [`${styles.progress}`]: (currentPage / pages) !== 1,
                                    [`${styles.progressComplete}`]: (currentPage / pages) === 1
                                })}
                                style={{
                                    width: `${((currentPage / pages) * 100)}%`
                                }}
                            />
                        </div> : ''
                }
            </div>
        );
    }

    _prev() {
        this.props.feedbackActions.checkRequired('prev', this.props.currentPage - 1);
    }

    _next() {
        this.props.feedbackActions.checkRequired('next', this.props.currentPage + 1);
    }

    _done() {
        this.props.feedbackActions.checkRequired('done');
    }
}

Pagination.PropTypes = {
    pages: PropTypes.number.isRequired,
    currentPage: PropTypes.number
};

Pagination.defaultProps = {
    currentPage: 1
};

export default Pagination;
