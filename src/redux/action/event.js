import { SET_TEI, SET_EVENTS, SET_ATTRIBUTES} from './types';
import { createAction } from './actions';
export const setTEIs = payload => dispatch => dispatch(createAction(SET_TEI, payload));
export const setEvents = payload => dispatch => dispatch(createAction(SET_EVENTS, payload));
export const setAttribute = payload => dispatch => dispatch(createAction(SET_ATTRIBUTES, payload));





