
import { createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

export const configStore = () => {
    const store = createStore(
        combineReducers({
         metadata: metadata
        }),
        applyMiddleware( thunk, logger)
    )
    return store;
}
