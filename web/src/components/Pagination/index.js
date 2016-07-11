/**
 * @module Pagination
 * Pagination component, only appeared if paging is more than one
 *
 **/
import styles from './style.css';

import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

class Pagination extends PureComponent {

    constructor() {
        super();
        this._goToPage = this._goToPage.bind(this);
        this._prev = this._prev.bind(this);
        this._next = this._next.bind(this);
    }

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { currentPage, pages } = this.props;
        const pageItems = [];
        for (let i = 1; i < pages + 1; i++) {
            pageItems.push((
                <li
                    key={`paging${i}`}
                    className={
                        currentPage === i ?
                        styles.pagingItemActive :
                        styles.pagingItem
                    }
                    data-index={i}
                    onClick={this._goToPage}
                >
                    {i}
                </li>
            ));
        }
        return (
            <div>
                {
                    currentPage > 1 ?
                        <div
                            className={styles.prev}
                            data-i18n="prev"
                            onClick={this._prev}
                        /> : ''
                }
                {
                    currentPage < pages ?
                        <div
                            className={styles.next}
                            data-i18n="next"
                            onClick={this._next}
                        /> : ''
                }
                <ul className={styles.paging}>
                    {pageItems}
                </ul>
            </div>
        );
    }

    _goToPage(e) {
        this.props.surveyActions.goToPage($(e.target).data('index'));
    }

    _prev() {
        this.props.surveyActions.goToPage(this.props.currentPage - 1);
    }

    _next() {
        this.props.surveyActions.goToPage(this.props.currentPage + 1);
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
