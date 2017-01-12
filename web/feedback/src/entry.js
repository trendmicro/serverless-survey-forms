
import React from 'react';
import PureComponent from 'react-pure-render/component';
import ReactDOM from 'react-dom';

import Qustom from '../../src/index';


class App extends PureComponent {
    render() {
        return (
            <div>
                <Qustom {...this.props} />
            </div>
        );
    }
}

function getParameterByName(targetName) {
    const url = window.location.href;
    const name = targetName.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initApp() {
    let view;
    if (!getParameterByName('accountid') && !getParameterByName('surveyid')) {
        view = (<h1 className="error">Survey ID and Account ID are required!</h1>);
    } else if (!getParameterByName('surveyid')) {
        view = (<h1 className="error">Survey ID is required!</h1>);
    } else if (!getParameterByName('accountid')) {
        view = (<h1 className="error">Account ID is required!</h1>);
    } else {
        // handle en to en-US
        let locale = getParameterByName('locale') || '';
        locale = locale === 'en' ? 'en-US' : locale;
        const props = {
            accountid: getParameterByName('accountid') || 'context.authorizer.principalId',
            surveyid: getParameterByName('surveyid') || '759e7930-3219-11e6-b8fc-ed3df7fb1eab',
            type: getParameterByName('type') || 'default', // type=default/embedded
            locale: locale, // sync with product or no need
            // preview mode does not send out feedback
            preview: getParameterByName('preview') || false
        };
        view = (<App {...props} />);
    }
    ReactDOM.render(
        view,
        document.getElementById('main')
    );
}

initApp();

if (module.hot) {
    module.hot.accept();
}
