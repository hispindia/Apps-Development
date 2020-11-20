import { GET_ORG_UNITS_DETAIL, METADATA_RECEIVED, SET_PAYLOAD, SET_DATA_VALUES, SET_TEI_ATTRIBUTE, TRACKED_ENTITY_RECEIVED,
   CHECKED_VALIDATION, EVENT_FAILURE, DYNAMIC_RECEIVED_DATA, PROGRAMS_RECEIVED, PROGRAMSTAGE_RECEIVED, PROGRAMSTAGE_SECTIONS_RECEIVED,SET_MENDATORY_DATAELEMENTS,
    UPDATE_EVENT_VALUES,RESET_FORM, SET_PROGRAM_RULES, PROGRAM_RULE_MERGE, EVENT_POST, RESET,LOADING_PAGE,FETCH_CONDITIONAL_OU, SET_PROGRAM_RULES_CONDITION, CHECK_MANDATORY,TRANSLATION_DATAELEMENTS,SET_LANGUAGE } from '../action';
const INITIAL_EVENT = {
  values: null,
  programStage: null,
  status: {},
  id: null,
  rules: null,
  duplicate: false
};
const INITIAL_DATA = {
  metadata: null,
  orgUnitId: null,
  programStageId: null,
  programId: null,
  eventDate: new Date(),
  status: "ACTIVE",
  tei: null,
  teiAttributeHeader: null
};
const INITIAL_STATE = {
  entity: {
    values: null,
    id: null,
    uniques: []
  },
  event: INITIAL_EVENT,
  payload: INITIAL_DATA,
  dynamicData: {
    programs: [],
    programStages: [] // programStageSections:[]  

  },
  loading: false,
  programStageSections: [],
  dataValue: [],
  attributes: [],
  TEIRender: true,
  tranckedEntityInstances: [],
  Error: false,
  checkingId: null,
  programsRules: [],
  btnStatus: false,
  eventPost: false,
  metaDataLoading:true,
  programStatus: false,
  orgUnitStatus: false,
  failEvent: false,
  pageLoading: false,
  conditionalOU:[],
  programRulesCondition:[],
  mergeProgramRuleCondition: [],
  mandatoryDataElements: [],
  mandatoryElement: false,
  language:null,
  dataElementsTranslation:null
};
export const dataReducer = (state = INITIAL_STATE, {
  type,
  payload
}) => {
  switch (type) {
    case GET_ORG_UNITS_DETAIL:
      return { ...state,
        payload: {
          orgUnitId: payload.id,
          programs: payload.programs,
          orgUnit: payload.displayName
        }
      };

    case SET_PAYLOAD:
      return { ...state,
        payload: {
          orgUnitId: payload.id,
          programsId: payload.programId,
          orgUnit: payload.displayName,
          programStageId: payload.programStageId,
          eventDate: payload.eventDate
        },
        orgUnitStatus:true
      };

    case UPDATE_EVENT_VALUES:
      return { ...state,
        dataValue: payload
      };
      case PROGRAM_RULE_MERGE:
        return { ...state,
          mergeProgramRuleCondition: payload
        };
    case SET_PROGRAM_RULES:
      return { ...state,
        programsRules: payload
      };
      case SET_PROGRAM_RULES_CONDITION:
        return { ...state,
          programRulesCondition: payload
        };
  
    case SET_TEI_ATTRIBUTE:
      return { ...state,
        attributes: payload,
        TEIRender: false
      };
      case CHECK_MANDATORY:
        return { ...state,
          mandatoryElement: true
        };
      case FETCH_CONDITIONAL_OU:
        return { ...state,
          conditionalOU: payload
        };
    case TRACKED_ENTITY_RECEIVED:
      return { ...state,
        tranckedEntityInstances: payload,
        btnStatus: true
      };

    case SET_DATA_VALUES:
      return { ...state,
        dataValue: payload,
        orgUnitStatus:false
      };

    case CHECKED_VALIDATION:
      return { ...state,
        checkingId: payload.id,
        Error: payload.type
      };

      case RESET:
        return { ...state,
          programStageSections:[],
          dynamicData: {
            programs: [],
            programStages: [] 
          },
          btnStatus: false,
        };
        case LOADING_PAGE:
        return { ...state,
          pageLoading:true,
        };
        case RESET_FORM:
        return { ...state,
          programStageSections:[],
          dynamicData: {
            programs: payload,
            programStages: [] 
          },
          btnStatus: false,
        };
    case DYNAMIC_RECEIVED_DATA:
      {
        return { ...state,
          dynamicData: {
            programs: payload,
            programStages: payload.programStages,
            programStageSections: payload.programStageSections
          }
        };
      }

    case PROGRAMS_RECEIVED:
      {
        return { ...state,
          dynamicData: {
            programs: payload,
            loading: true,
          },
          orgUnitStatus:false
        };
      }
      case SET_MENDATORY_DATAELEMENTS:
        {
          return { ...state,
            mandatoryDataElements:payload
          };
        }
    case PROGRAMSTAGE_RECEIVED:
      {
        return { ...state,
          dynamicData: {
            programs: payload.programs,
            programStages: payload.programStages
          },
          orgUnitStatus:false
        };
      }

    case PROGRAMSTAGE_SECTIONS_RECEIVED:
      {
        return { ...state,
          programStageSections: payload,
          btnStatus: true,          
         orgUnitStatus:false,
         mandatoryElement: false
        };
      }
    case METADATA_RECEIVED:
      {
        return { ...state,
          metadata: payload,
          loading: true,
          metaDataLoading:false
        };
      }
      case EVENT_POST:
        {
          return { ...state,
            eventPost: true,
            pageLoading: true
          };
        }
        case EVENT_FAILURE:
        {
          return { ...state,
            failEvent: true,
            pageLoading: true
          };
        }
        case SET_LANGUAGE:
          {
            return { ...state,
              language: payload,
            };
          }
          case TRANSLATION_DATAELEMENTS:
            {
              return { ...state,
                dataElementsTranslation: payload
              };
            }
    default:
      return state;
  }
};