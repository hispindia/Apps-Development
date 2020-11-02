import { PROGRAMSTAGE_SECTIONS_UPDATE,RESET,RESET_FORM,SET_PROGRAM_RULES_CONDITION, LOADING_PAGE,FETCH_CONDITIONAL_OU, METADATA_RECEIVED, EVENT_FAILURE,EVENT_POST, SET_DATA_VALUES, SET_TEI_ATTRIBUTE, TRACKED_ENTITY_RECEIVED, CHECKED_VALIDATION,PROGRAM_RULE_MERGE, UPDATE_EVENT_VALUES, SET_PROGRAM_RULES, SET_PAYLOAD, PROGRAMS_RECEIVED, PROGRAMSTAGE_RECEIVED, PROGRAMSTAGE_SECTIONS_RECEIVED, SET_MENDATORY_DATAELEMENTS,CHECK_MANDATORY } from './types';
import { createAction } from './actions';
import { eventRules } from '../../helpers/eventRules';
export const LoadMetaData = payload => dispatch => {
  dispatch(createAction(METADATA_RECEIVED, payload))
};
export const setPayload = payload => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs
  const programStages = getState().data.dynamicData.programStages
   let data= {
    programs:programs,
    programStages:programStages
   }
  dispatch(createAction(SET_PAYLOAD, payload));
  dispatch(createAction(PROGRAMSTAGE_RECEIVED, data));
}
export const getOrgUnitDetail = payload => dispatch => dispatch(createAction(SET_PAYLOAD, payload));
export const getProgramStageSections = payload => (dispatch, getState) => {
  let dataValues = getState().data.dataValue;
  const programRules = getState().data.programsRules;
  const selectedOU = getState().data.payload;
  dataValues[selectedOU.orgUnitId] = true;
  try {
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_RECEIVED, payload));
    const data = eventRules(dataValues, payload , programRules);

    dispatch(createAction(SET_DATA_VALUES, data['0']));
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_UPDATE, data['1']));
  } catch (error) {
    console.error("Error in Program stage Section!");
  }
} 
export const setDataValues = payload => dispatch => dispatch(createAction(SET_DATA_VALUES, payload));
export const getPrograms = payload => dispatch => dispatch(createAction(PROGRAMS_RECEIVED, payload));
export const getProgramStages = id => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs;
  let program = programs.filter(program => program.id === id);
  let ps = program['0'].programStages.filter( ps => ps["attributeValues"]["bulkEventPush"]);
  let payload = {
    programs: programs,
    programStages: ps
  };
  dispatch(createAction(PROGRAMSTAGE_RECEIVED, payload));
};
export const updateEventValues = payload => dispatch => dispatch(createAction(UPDATE_EVENT_VALUES, payload));
export const getTEIAttribute = payload => dispatch => dispatch(createAction(SET_TEI_ATTRIBUTE, payload));
export const getTrackedEntityInstances = payload => dispatch => dispatch(createAction(TRACKED_ENTITY_RECEIVED, payload));
export const validation = payload => dispatch => dispatch(createAction(CHECKED_VALIDATION, payload));
export const setProgramRule = payload => dispatch => dispatch(createAction(SET_PROGRAM_RULES, payload));
export const getProgramRuleChecking = (dataValues, programStageSection, programRules) => (dispatch, getState) => {
  const selectedOU = getState().data.payload;
  dataValues[selectedOU.orgUnitId] = true;
  try {
    const data = eventRules(dataValues, programStageSection, programRules);
    dispatch(createAction(SET_DATA_VALUES, data['0']));
    dispatch(createAction(PROGRAMSTAGE_SECTIONS_UPDATE, data['1']));
  } catch (error) {
    console.error(error);
  }
};
export const postingEvent = () => dispatch => dispatch(createAction(EVENT_POST));
export const failureEvent = () => dispatch => dispatch(createAction(EVENT_FAILURE));
export const resetDyanamicData = () => dispatch => dispatch(createAction(RESET));
export const resetStaticData = () => (dispatch, getState) => {
  const programs = getState().data.dynamicData.programs;
  dispatch(createAction(RESET_FORM, programs));
}
export const loadingPage = () => dispatch => dispatch(createAction(LOADING_PAGE));
export const setCondtionalOU = payload => dispatch => dispatch(createAction(FETCH_CONDITIONAL_OU,payload));
export const loadProgramRuleCondition = payload => dispatch => dispatch(createAction(SET_PROGRAM_RULES_CONDITION,payload));
export const programConditionCheck = payload => (dispatch, getState) => {
  const mergeProgramRuleCondition = getState().data.mergeProgramRuleCondition;
  if(!mergeProgramRuleCondition[payload.id]){
    mergeProgramRuleCondition[payload.id] = payload.value;
   payload = mergeProgramRuleCondition
  dispatch(createAction(PROGRAM_RULE_MERGE,payload));
  }
}
export const setMandatoryDataElements = payload => dispatch => dispatch(createAction(SET_MENDATORY_DATAELEMENTS,payload));
export const checkMandatory = () => dispatch => dispatch(createAction(CHECK_MANDATORY));


