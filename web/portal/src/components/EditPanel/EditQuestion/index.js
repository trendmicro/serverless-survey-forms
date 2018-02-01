
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

import * as values from '../../../constants/DefaultValues';
import Mixins from '../../../mixins/global';
import Select from '../../Select';
import EditMultiOptions from '../EditMultiOptions';
import Button from '../../Button';

class EditQuestion extends PureComponent {

    constructor() {
        super();

        this._renderType = this._renderType.bind(this);
        this._renderTitle = this._renderTitle.bind(this);
        this._renderRequired = this._renderRequired.bind(this);
        this._renderOptions = this._renderOptions.bind(this);
        this._renderAdvance = this._renderAdvance.bind(this);
        this._onTitleChange = this._onTitleChange.bind(this);
        this._onTypeChange = this._onTypeChange.bind(this);
        this._btnClickEvent = this._btnClickEvent.bind(this);
        this._handleChangeEvent = this._handleChangeEvent.bind(this);
        this._onAdvanceChangeHandle = this._onAdvanceChangeHandle.bind(this);
        this._handleFocusEvent = this._handleFocusEvent.bind(this);
        this._onRequiredChangeHandle = this._onRequiredChangeHandle.bind(this);
        this._handleEditModeClick = this._handleEditModeClick.bind(this);
    }

    componentDidMount() {
        Mixins.fixScrollbar();
        $('#editModal').on('click', this._handleEditModeClick);
    }

    componentWillUnmount() {
        Mixins.freeScrollbar();
        $('#editModal').off('click', this._handleEditModeClick);
    }

    _handleEditModeClick(e) {
        const target = e.target;
        const hint = document.getElementsByClassName('js-hint');
        if (target.getAttribute('id') === 'editModal') {
            hint[0].style.display = 'block';
        } else {
            hint[0].style.display = 'none';
        }
    }

    render() {
        const { editQuestion } = this.props;

        return (
            <div id="editModal" className="modalEditPanel">
                <div id="editPanel" className="editpanel">
                    <div className="edit">
                        <div className="editContent">
                            {this._renderType()}
                            {this._renderTitle()}
                            {this._renderRequired()}
                            {this._renderOptions()}
                            {editQuestion.type === 'rating' || editQuestion.type === 'textarea' ?
                                this._renderAdvance() : ''}
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="edit-hint shake js-hint" style={{ display: 'none' }}>
                            Please confirm your change
                        </div>
                        <Button
                            string="Save"
                            i18nKey={false}
                            color="ruby"
                            onClick={this._btnClickEvent}
                            extraProps={{ 'data-type': 'save' }}
                        />
                        <Button
                            string="Cancel"
                            i18nKey={false}
                            onClick={this._btnClickEvent}
                            extraProps={{ 'data-type': 'cancel' }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    _renderTitle() {
        const { editQuestion } = this.props;
        return (
            <div className={styles.editSection}>
                <div className={styles.title}>What question do you want to ask?</div>
                <div>
                    <textarea
                        id="editQuestion"
                        className="ut-editQuestion textarea"
                        type="text"
                        value={editQuestion.label}
                        onChange={this._onTitleChange}
                        onFocus={this._handleFocusEvent}
                        rows="2"
                    ></textarea>
                    <div className="input__msg js-title-msg"></div>
                </div>
            </div>
        );
    }

    _renderRequired() {
        const { editQuestion } = this.props;
        return (
            <div className={styles.editSection}>
                <div className={styles.title}>Is this question required?</div>
                <div className={`${styles.checkboxItem} checkboxItem`}>
                    <input
                        id="required"
                        type="checkbox"
                        className="ut-required"
                        checked={editQuestion.required}
                        onChange={this._onRequiredChangeHandle}
                    />
                    <label htmlFor="required">
                        Yes, it is a required question.
                    </label>
                </div>
            </div>);
    }

    _renderType() {
        const { surveyEditable, editQuestion } = this.props;
        // Once add new question, it should add a select option
        const item = [
            { value: 'radio', label: 'Radio Button' },
            { value: 'checkbox', label: 'Checkbox' },
            { value: 'rating', label: 'Rating (Likert Scale)' },
            { value: 'text', label: 'Single line text' },
            { value: 'textarea', label: 'Multiple line text' }];
        return (
            <div className={styles.editSection}>
                <div className={styles.title}>Question Type</div>
                <div className={styles.select}>
                    <Select
                        id={0}
                        item={item}
                        selectedItem={editQuestion.type}
                        onChangeHandle={this._onTypeChange}
                        disabled={!surveyEditable}
                    />
                </div>
            </div>
        );
    }

    _renderOptions() {
        const { surveyEditable, editQuestion } = this.props;
        const props = {
            editQuestion,
            surveyEditable,
            handleChangeEvent: this._handleChangeEvent
        };
        const sectionTitle = editQuestion.type === 'text' || editQuestion.type === 'textarea' ?
            'Placeholder Settings' : 'Multiple Choice Options';

        return (
            <div className={styles.editSection}>
                <div className={styles.title}>{sectionTitle}</div>
                {<EditMultiOptions {...props} />}
            </div>
        );
    }

    _renderAdvance() {
        const { surveyEditable, editQuestion } = this.props;

        if (editQuestion.type === 'rating') {
            const flag = editQuestion.hasOwnProperty('input');
            const input = flag ? editQuestion.input : values.PLACEHOLDER_TITLE;

            return (
                <div className={`${styles.editSection} ut-advance`}>
                    <div className={styles.title}>Advanced Option Settings</div>

                    <div className={`${styles.checkboxItem} checkboxItem`}>
                        <input
                            id="chk"
                            type="checkbox"
                            className={`${styles.input} ut-chk input`}
                            checked={flag}
                            onChange={surveyEditable ? this._onAdvanceChangeHandle : () => {}}
                            disabled={!surveyEditable}
                        />
                        <label htmlFor="chk">
                            Show "Tell Me Why"<span>&nbsp;-&nbsp;</span>
                        </label>
                        <input
                            id="why"
                            type="text"
                            value={input}
                            className={`${styles.input__why} input input--medium`}
                            onChange={this._onAdvanceChangeHandle}
                            onFocus={this._handleFocusEvent}
                            readOnly={!flag}
                        />
                        <div className={`${styles.whyInput} input__msg js-whyInput-msg`}></div>
                    </div>
                </div>
            );
        } else if (editQuestion.type === 'textarea') {
            return (
                <div className={`${styles.editSection} ut-advance`}>
                    <div className={styles.title}>Advanced Settings</div>
                    <div>
                        <div className={styles.rows}>Show rows:</div>
                        <button
                            data-type="decrease"
                            onClick={this._onAdvanceChangeHandle}
                        >-</button>
                        <input
                            id="number"
                            type="text"
                            className={`${styles.input__num} input input--medium`}
                            value={editQuestion.rows}
                            readOnly
                        />
                        <button
                            data-type="increase"
                            onClick={this._onAdvanceChangeHandle}
                        >+</button>
                    </div>
                </div>
            );
        }
    }

    _btnClickEvent(e) {
        const { editQuestion, questionsActions, editQuestionActions } = this.props;
        // Clear all error msg
        $('.js-title-msg, .js-opt-msg, .js-optInput-msg, .js-whyInput-msg, js-text-msg').html('');

        if (e.currentTarget.getAttribute('data-type') === 'cancel') {
            editQuestionActions.stopEditQuestion();
        } else if (e.currentTarget.getAttribute('data-type') === 'save') {
            // Error handling
            let flag = false;
            let opt;
            // Check question
            const questionTxt = document.getElementById('editQuestion');
            if (questionTxt.value === '') {
                $('.js-title-msg').html('Please fill question');
                flag = true;
            }
            // Check options
            opt = $('input[type=text].js-opt');
            Object.keys(opt).forEach((key) => {
                if (!isNaN(key) && opt[key].value === '') {
                    $('.js-opt-msg').eq(key).html('Please fill option');
                    flag = true;
                }
            });
            // Check advanced input in rating
            if (editQuestion.type === 'rating'
                && $('#chk').is(':checked')
                && document.getElementById('why').value === '') {
                $('.js-whyInput-msg').html('Please fill "Tell Me Why" input\'s placeholder');
                flag = true;
            }
            // Check single or multi line text
            opt = $('.js-text');
            if (opt && opt.length > 0) {
                if (opt[0].value === '') {
                    $('.js-text-msg').html('Please fill placehoder');
                    flag = true;
                }
            }

            if (!flag) {
                // save editQuestion to Question
                questionsActions.updateQuestionItem();
                questionsActions.saveQuestion();
                editQuestionActions.stopEditQuestion();
            }
        }
    }

    _onTitleChange(e) {
        const data = { label: e.target.value };
        this._handleChangeEvent(data);
    }

    _onTypeChange(e) {
        const { editQuestion, editQuestionActions } = this.props;
        const type = e.currentTarget.getAttribute('data-value') || 'radio';
        // keep basic question content
        const newQuestion = Object.assign({}, {
            id: editQuestion.id,
            type,
            label: editQuestion.label,
            order: editQuestion.order,
            required: editQuestion.required
        });
        // Once add new question, it should add case content
        // keep advanced question content by question type
        switch (type) {
        case 'radio':
        case 'checkbox':
            newQuestion.data = !editQuestion.hasOwnProperty('data') ?
                [{ value: Mixins.generateQuestionID(), label: values.OPTION_TITLE }] :
                [...editQuestion.data];
            break;
        case 'rating':
            newQuestion.data = !editQuestion.hasOwnProperty('data') ?
                [{ value: Mixins.generateQuestionID(), label: values.OPTION_TITLE }] :
                [...editQuestion.data];
            if (editQuestion.hasOwnProperty('data')) {
                // rating's options should not have input
                editQuestion.data.forEach((opt, idx) => {
                    if (opt.hasOwnProperty('input')) delete newQuestion.data[idx].input;
                });
            }
            break;
        case 'text':
            newQuestion.input = values.PLACEHOLDER_TITLE;
            break;
        case 'textarea':
            newQuestion.input = values.PLACEHOLDER_TITLE;
            newQuestion.rows = 3;
            break;
        default:
        }
        editQuestionActions.updateEditQuestion(newQuestion);
    }

    _handleChangeEvent(data) {
        const { editQuestionActions } = this.props;
        editQuestionActions.setEditQuestion(data);
    }

    _onAdvanceChangeHandle(e) {
        const { editQuestion, editQuestionActions } = this.props;
        const target = e.target;
        if (editQuestion.type === 'rating') {
            const flag = $('#chk').is(':checked');
            const newData = Object.assign({}, editQuestion);
            if (flag) {
                newData.input = $('#why').val();
                this._handleChangeEvent(newData);
            } else {
                delete newData.input;
                editQuestionActions.deleteRatingInput();
            }
        } else if (editQuestion.type === 'textarea') {
            let number = parseInt($('#number').val(), 10);
            if (target.getAttribute('data-type') === 'increase') {
                number++;
                number = number > 10 ? 10 : number;
            } else {
                number--;
                number = number < 2 ? 2 : number;
            }
            const newData = Object.assign({}, editQuestion, { rows: number });
            this._handleChangeEvent(newData);
        }
    }

    _handleFocusEvent(e) {
        const { editQuestion } = this.props;
        const target = e.target;
        if (target.getAttribute('id') === 'why') {
            if (editQuestion.hasOwnProperty('input')
                && editQuestion.input === values.PLACEHOLDER_TITLE) {
                target.value = '';
            }
        } else {
            if (editQuestion.label === values.QUESTION_TITLE) {
                target.value = '';
            }
        }
    }

    _onRequiredChangeHandle() {
        const { editQuestion } = this.props;
        const newData = Object.assign({},
            editQuestion, { required: $('#required').is(':checked') });
        this._handleChangeEvent(newData);
    }
}

export default EditQuestion;
