
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from '../reducers';

export default function configureStore() {
    const loggerMiddleware = createLogger();

    // Middleware
    // Only enable loggerMiddleware in debug mode
    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )(createStore);

    const store = createStoreWithMiddleware(rootReducer);
    return store;
}
