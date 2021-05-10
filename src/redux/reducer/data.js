import { GET_ORG_UNITS_DETAIL, GET_DATASETS, GET_OU, GET_ASSIGN_OU, PAGE_CHANGE} from '../action';
const INITIAL_STATE = {
  ouList: [],
  assignedOU: [],
  isFirstRender: true,
  tableList: []
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
          orgUnit: payload.displayName
        }
      };
      case GET_DATASETS:
      return { ...state,
        dataSets: payload.dataSets
      };
      case GET_OU:
      return { ...state,
        ouList: payload
      };
      case GET_ASSIGN_OU:
        return { ...state,
          assignedOU: payload
        };
        case PAGE_CHANGE:
          return { ...state,
            ouList: payload,
            isFirstRender: false
          };
     default:
      return state;
  }
};