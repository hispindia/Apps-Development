export const OUTREE_ACTION_TYPES = {
  SET_OU_LIST: "SET_OU_LIST",
  SET_USER_OU: "SET_USER_OU",
  set_CLICKED_OU: "set_OU_CLICKED",
  SET_SELECTED_OU: "SET_SELECTED_OU",
};

export const INITIAL_STATE = {
  userOU: null,
  selectedOU: null,
  clickedOU: null,
  ouList: null,
};

export const outreeReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case OUTREE_ACTION_TYPES.SET_USER_OU:
      return { ...state, userOU: payload };
    case OUTREE_ACTION_TYPES.SET_SELECTED_OU:
      return { ...state, selectedOU: payload };
    case OUTREE_ACTION_TYPES.set_CLICKED_OU:
      return { ...state, clickedOU: payload };
    case OUTREE_ACTION_TYPES.SET_OU_LIST:
      return { ...state, ouList: payload };
    default:
      return state;
  }
};
