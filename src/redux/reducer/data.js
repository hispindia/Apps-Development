import {SET_TEI, SET_EVENTS, SET_ATTRIBUTES, SET_COVAC_VACCINE_NAMES, SET_COVAC_DOSE} from '../action';
const INITIAL_STATE = {
  COVACVaccineNames:{},
  COVACDose: {},
  TEIList :[],
  eventList: [],
  attributes: [],
  isValidID: true,

};
export const dataReducer = (state = INITIAL_STATE, {
  type,
  payload
}) => {
  switch (type) {
    case SET_TEI:
      return { ...state,
      TEIList: payload
      };
      case SET_COVAC_VACCINE_NAMES:
        return {
          ...state,
          COVACVaccineNames: payload
        };
        case SET_COVAC_DOSE:
        return {
          ...state,
          COVACDose: payload
        };
      case SET_EVENTS:
      return { ...state,
        eventList: payload
      };
      case SET_ATTRIBUTES:
        return { ...state,
          attributes: payload,
          isValidID: false
        };
     default:
      return state;
  }
};