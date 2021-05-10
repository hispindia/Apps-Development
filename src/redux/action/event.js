import { GET_ORG_UNITS_DETAIL,GET_DATASETS,GET_OU,GET_ASSIGN_OU,PAGE_CHANGE } from './types';
import { createAction } from './actions';
export const getOrgUnitDetail = payload => dispatch => dispatch(createAction(GET_ORG_UNITS_DETAIL, payload));
export const setDataSets = payload => dispatch => dispatch(createAction(GET_DATASETS, payload));
export const setOU = payload => dispatch => dispatch(createAction(GET_OU, payload));
export const setAssignOU = payload => dispatch => dispatch(createAction(GET_ASSIGN_OU, payload));
export const changePage = payload => dispatch => dispatch(createAction(PAGE_CHANGE, payload));





