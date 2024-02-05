export const NAVBAR_ACTION_TYPES = {
  SET_PERIOD: "SET_PERIOD",
  SET_OU_GROUP: "SET_OU_GROUP",
  SET_SELECTED_GROUP: "SET_SELECTED_GROUP",
};

const INIITAL_STATE = {
  period: null,
  ouGroup: null,
  selectedGroup: 'ALL IPA Units',
};

export const navbarReducer = (state = INIITAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case NAVBAR_ACTION_TYPES.SET_PERIOD:
      return { ...state, period: payload };
    case NAVBAR_ACTION_TYPES.SET_OU_GROUP:
      return { ...state, ouGroup: payload };
    case NAVBAR_ACTION_TYPES.SET_SELECTED_GROUP:
      return { ...state, selectedGroup: payload };
    default:
      return state;
  }
};
