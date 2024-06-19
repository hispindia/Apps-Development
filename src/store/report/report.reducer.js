export const REPORT_ACTION_TYPES = {
  SET_REPORT_LIST: 'SET_REPORT_LIST',
  SET_REPORTID: 'SET_REPORTID',
  SET_DISPLAY: 'SET_DISPLAY'
};

export const INITIAL_STATE = {
  list: [],
  reportId: '',
  display: false
};

export const reportReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case REPORT_ACTION_TYPES.SET_REPORT_LIST:
      return { ...state, list: payload };
      case REPORT_ACTION_TYPES.SET_REPORTID:
        return { ...state, reportId: payload };
        case REPORT_ACTION_TYPES.SET_DISPLAY:
          return { ...state, display: payload };
    default:
      return state;
  }
};
