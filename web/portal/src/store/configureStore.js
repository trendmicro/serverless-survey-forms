
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import rootReducer from '../reducers';

export default function configureStore() {
    const middlewares = [thunkMiddleware];
    if (process.env.NODE_ENV === 'development') {
        // Only enable loggerMiddleware in development
        middlewares.push(createLogger());
    }
    middlewares.push(routerMiddleware(browserHistory));

    const store = createStore(
        rootReducer,
        applyMiddleware(...middlewares)
    );
    return store;
}
