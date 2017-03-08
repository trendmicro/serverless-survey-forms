
/* eslint no-unused-vars:0 */
require('../css/main.css');

import React from 'react';
import PureComponent from 'react-pure-render/component';
import $ from 'jquery';

// Router
import { browserHistory, Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Redux
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

// Actions
import * as SettingsActions from './actions/settings';
import * as SurveyActions from './actions/survey';

// I18N/Formats
import I18Next from 'i18next/index';
import XHR from 'i18next-xhr-backend/index';
import I18nextJquery from 'jquery-i18next';

import Survey from './containers/Survey/';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

function getPromise(fetchFunc, ...extraParams) {
    return new Promise((resolve, reject) => {
        fetchFunc(resolve, reject, ...extraParams);
    });
}

function i18nSetting(resolve, reject, locale) {
    I18Next
    .use(XHR)
    .init({
        lng: locale,
        fallbackLng: 'en-US',
        debug: false,
        ns: 'translation',
        backend: {
            loadPath: '../../assets/L10N/__lng__/__ns__.json'
        },
        interpolation: {
            prefix: '__',
            suffix: '__'
        },
        load: 'currentOnly'
    }, () => {
        resolve('i18next init');
        $('[data-i18n]').localize();
    });

    I18nextJquery.init(I18Next, $, {
        tName: 't',
        i18nName: 'i18n',
        handleName: 'localize',
        selectorAttr: 'data-i18n',
        targetAttr: 'i18n-target',
        optionsAttr: 'i18n-options',
        useOptionsAttr: true,
        parseDefaultValueFromContent: false
    });
}

class App extends PureComponent {
    constructor(props) {
        super(props);

        // set locale by parameter
        // if no parameter, set locale by browser language
        // navigator.userLanguage is for IE < 11
        const locale = props.locale ||
            navigator.languages && navigator.languages[0] ||
            navigator.language ||
            navigator.userLanguage;
        const settings = Object.assign({}, props, { locale: locale });

        store.dispatch(SettingsActions.settings(settings));
        // Localization init settings
        getPromise(i18nSetting, locale)
        .then(() => {
            // check whether clientid has feedback
            if (settings.clientid) {
                return store.dispatch(
                    SurveyActions.getFeeback(
                        settings.accountid, settings.surveyid, settings.clientid
                    )
                );
            }
            // fetch survey from API
            return store.dispatch(SurveyActions.fetchSurvey(settings.accountid, settings.surveyid));
        });
    }

    componentWillReceiveProps(nextProps) {
        store.dispatch(SettingsActions.settings(Object.assign({}, nextProps)));
    }

    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Route path="*" component={Survey} {...this.state} />
                </Router>
            </Provider>
        );
    }
}

const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
const eventer = window[eventMethod];
const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
eventer(messageEvent, (e) => {
    console.log('Qustom onmessage event: ', e);
    if (!e ||
        !e.data) {
        console.log('Qustom: Not a valid message', e);
        return;
    }
    // Enable this when dev env issue fixed: /(^https:\/\/).+(\.trendmicro\.com$)/
    if (!e.origin.match(/(^https:\/\/)/)) {
        console.log('Qustom: e.origin didn\'t use https protocol', e.origin);
        return;
    }
    if (!e.data.source ||
        e.origin !== e.data.source) {
        console.log('Qustom: Received Message did not come from its match source',
            e.origin, e.data.source);
        return;
    }
    console.log('Qustom Init: Post Message received from Client:  ', e.origin, e.data);
    // Store client prefilling info
    store.dispatch(SurveyActions.savePrefill(e.data));
    // Via message channel
    if (e.ports && e.ports[0]) {
        window.port2 = e.ports[0];
    }
}, false);

export default App;
