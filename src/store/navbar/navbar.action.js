import { NAVBAR_ACTION_TYPES } from "./navbar.reducer";

export const setPeriod = (period) => ({
  type: NAVBAR_ACTION_TYPES.SET_PERIOD,
  payload: period
});
