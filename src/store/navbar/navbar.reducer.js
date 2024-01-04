export const NAVBAR_ACTION_TYPES = {
  SET_PERIOD: "SET_PERIOD"
};

export const INITIAL_STATE = {
  period: new Date().getFullYear(),
};

export const navbarReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case NAVBAR_ACTION_TYPES.SET_PERIOD:
      return { ...state, period: payload };
    default:
      return state;
  }
};
