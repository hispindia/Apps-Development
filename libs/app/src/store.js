import { createStore, applyMiddleware, combineReducers } from 'redux'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'

const middlewares = [ReduxThunk]

if (process.env.NODE_ENV === 'production') middlewares.push(logger)
// development -- to not show logger, production -- to show logger
export const store = (reducers, initial = {}) =>
    createStore(
        combineReducers(reducers),
        initial,
        applyMiddleware(...middlewares)
    )
