import { SET_TEI, SET_EVENTS, SET_ATTRIBUTES, SET_COVAC_VACCINE_NAMES, SET_COVAC_DOSE} from './types';
import { createAction } from './actions';
export const setTEIs = payload => dispatch => dispatch(createAction(SET_TEI, payload));
export const setCOVACVaccineNames = payload => dispatch => dispatch(createAction(SET_COVAC_VACCINE_NAMES, payload));
export const setCOVACDose = payload => dispatch => dispatch(createAction(SET_COVAC_DOSE, payload));
export const setEvents = payload => dispatch => dispatch(createAction(SET_EVENTS, payload));
export const setAttribute = payload => dispatch => dispatch(createAction(SET_ATTRIBUTES, payload));





