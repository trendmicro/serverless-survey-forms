
import React from 'react';
import PureComponent from 'react-pure-render/component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import $ from 'jquery';

// Actions
import * as QuestionsActions from '../../actions/questions';
import * as EditQuestionIDActions from '../../actions/editQuestionID';

import Design from '../../components/Design';
import Control from '../../components/Control';
import Page from '../../components/Form/Page';
import EditPanel from '../../components/EditPanel';

class Create extends PureComponent {

    componentDidMount() {
        $(this.refs.root).localize();
    }

    componentDidUpdate() {
        $(this.refs.root).localize();
    }

    render() {
        const { editQuestionID, editQuestionIDActions, questionsActions } = this.props;
        const ctrlProps = {
            questionsActions
        };
        const editProps = {
            editQuestionID,
            editQuestionIDActions
        };

        return (
            <div ref="root">
                <Design />
                <Control {...ctrlProps} />
                {editQuestionID !== '' ? <EditPanel {...editProps} /> : ''}
                {this._renderPage()}
            </div>
        );
    }

    _renderPage() {
        const { questions, editQuestionIDActions } = this.props;
        const pageList = [];
        questions.forEach((page, idx) => {
            const pros = {
                key: idx,
                data: page,
                editQuestionIDActions
            };
            pageList.push(<Page {...pros} />);
        });
        return pageList;
    }
}

function mapStateToProps(state) {
    return {
        fbID: state.fbID,
        account: state.account,
        questions: state.questions,
        editQuestionID: state.editQuestionID
    };
}

function mapDispatchToProps(dispatch) {
    return {
        questionsActions: bindActionCreators(QuestionsActions, dispatch),
        editQuestionIDActions: bindActionCreators(EditQuestionIDActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Create);
