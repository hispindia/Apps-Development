export const TEI_ACTION_TYPES = {
  SET_TEI_LIST: "SET_TEI_LIST",
  SET_TEI_PRESENT: 'SET_TEI_PRESENT'
};

export const INITIAL_STATE = {
  list: [],
  teiPresent:false
};

export const teiReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case TEI_ACTION_TYPES.SET_TEI_LIST:
      return { ...state, list: payload };
      case TEI_ACTION_TYPES.SET_TEI_PRESENT:
        return { ...state, teiPresent: payload };
    default:
      return state;
  }
};
