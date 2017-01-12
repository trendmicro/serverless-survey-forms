
// CSS
import styles from './style.css';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Actions
import * as EditSubjectActions from '../../actions/editSubject';
import * as SubjectActions from '../../actions/subject';
import * as QuestionsActions from '../../actions/questions';
import * as PreviewActions from '../../actions/preview';
import * as AccountActions from '../../actions/account';
import * as UsersActions from '../../actions/users';
import * as WebpageActions from '../../actions/webpage';
import * as SurveysActions from '../../actions/surveys';
import * as PopupActions from '../../actions/popup';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FBLogin from '../../components/FBLogin';
import Loading from '../../components/Loading';
import Create from '../../containers/Create/';
import User from '../../containers/User';
import List from '../../containers/List/';
import Subject from '../../components/Popup/Subject';
import Preview from '../../components/Popup/Preview';
import Unauthorize from '../../components/Popup/Unauthorize';
import Confirm from '../../components/Popup/Confirm';
import NoPermission from '../../components/Popup/NoPermission';
import ExportL10n from '../../components/Popup/ExportL10n';
import ImportL10n from '../../components/Popup/ImportL10n';
import ReImportL10n from '../../components/Popup/ReImportL10n';

export class Portal extends PureComponent {

    constructor() {
        super();
        this._checkAccountStatus = this._checkAccountStatus.bind(this);
        this._handlePopup = this._handlePopup.bind(this);
    }

    render() {
        const { account, loading, subject, lang, surveyID, surveyL10n, surveyVersion,
            preview, previewID, selectedUser, webpage,
            editSubject, editSubjectActions, subjectActions,
            questionsActions, previewActions, usersActions,
            webpageActions } = this.props;
        const headProps = {
            account,
            subject,
            surveyVersion,
            selectedUser,
            webpage,
            editSubjectActions,
            questionsActions,
            usersActions,
            webpageActions
        };
        const subProps = { subject, lang, surveyID, editSubjectActions, subjectActions };
        const preProps = { account, lang, preview, previewID, previewActions };
        const loadingView = loading ? <Loading /> : '';
        return (
            <div ref="root">
                <div className={styles.wrap}>
                    <Header {...headProps} />
                    {this._checkUserLogin()}
                </div>

                {editSubject ? <Subject {...subProps} /> : ''}
                {preview ? <Preview {...preProps} langList={Object.keys(surveyL10n)} /> : ''}
                {this._handlePopup()}
                {this._checkAccountStatus()}

                <Footer />
                {loadingView}
            </div>
        );
    }

    _handlePopup() {
        const { lang, surveyL10n, selectedL10n, popup, popupActions,
            surveysActions, questionsActions } = this.props;
        if (popup) {
            if (popup === 'ExportL10n') {
                return (
                    <ExportL10n
                        lang={lang}
                        surveyL10n={surveyL10n}
                        popupActions={popupActions}
                    />);
            } else if (popup === 'ImportL10n') {
                return (
                    <ImportL10n
                        lang={lang}
                        surveyL10n={surveyL10n}
                        questionsActions={questionsActions}
                        popupActions={popupActions}
                    />);
            } else if (popup === 'ReImportL10n') {
                return (
                    <ReImportL10n
                        lang={lang}
                        selectedL10n={selectedL10n}
                        surveyL10n={surveyL10n}
                        questionsActions={questionsActions}
                        popupActions={popupActions}
                    />);
            }
            return (
                <Confirm
                    popup={popup}
                    popupActions={popupActions}
                    surveysActions={surveysActions}
                />);
        }
    }

    _checkAccountStatus() {
        const { account, token } = this.props;
        if (account.hasOwnProperty('accountid')) {
            if (account.role === 'User') {
                return <NoPermission />;
            } else if (token === '') {
                return <Unauthorize />;
            }
        }
    }

    _checkUserLogin() {
        const { account, webpage } = this.props;
        const webpageArray = webpage.split('/');
        const body = document.getElementsByTagName('body')[0];

        if (!account || !account.hasOwnProperty('accountid')) {
            // if user didn't grant FB permission
            body.classList.remove('bg');
            return <FBLogin />;
        }
        // if user has a account and the account role is Designer or Admin
        body.classList.add('bg');

        // TODOS: temporarily remove router
        let children;
        switch (webpageArray[0]) {
        case 'user':
            children = <User />;
            break;
        case 'create':
        case 'userCreate':
            children = <Create />;
            break;
        case 'userSurvey':
        case 'index':
        default:
            children = <List />;
        }

        return (
            <div className={styles.content}>
                <div className={styles.content_bg}></div>
                <div className={styles.container}>
                    {children}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading,
        token: state.token,
        account: state.account,
        subject: state.subject,
        lang: state.lang,
        surveyID: state.surveyID,
        surveyVersion: state.surveyVersion,
        surveyL10n: state.surveyL10n,
        editSubject: state.editSubject,
        preview: state.preview,
        previewID: state.previewID,
        selectedL10n: state.selectedL10n,
        selectedUser: state.selectedUser,
        webpage: state.webpage,
        popup: state.popup,
        routing: state.routing
    };
}

function mapDispatchToProps(dispatch) {
    return {
        editSubjectActions: bindActionCreators(EditSubjectActions, dispatch),
        subjectActions: bindActionCreators(SubjectActions, dispatch),
        questionsActions: bindActionCreators(QuestionsActions, dispatch),
        previewActions: bindActionCreators(PreviewActions, dispatch),
        accountActions: bindActionCreators(AccountActions, dispatch),
        usersActions: bindActionCreators(UsersActions, dispatch),
        webpageActions: bindActionCreators(WebpageActions, dispatch),
        surveysActions: bindActionCreators(SurveysActions, dispatch),
        popupActions: bindActionCreators(PopupActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Portal);
