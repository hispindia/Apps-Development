import * as ActionType from '../action/actionType'
const initialState = {
    program : '',
    programRules: ''
}
export const EventRules = (state= initialState, action) => {
    switch(action.type) {
        case ActionType.METADATA_RECEIVED :
            return  { data: 'Here is content available'}
        default:
            return state
    }

}
