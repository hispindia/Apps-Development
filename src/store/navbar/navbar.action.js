import { NAVBAR_ACTION_TYPES } from "./navbar.reducer";

export const setPeriod = (period) => ({
  type: NAVBAR_ACTION_TYPES.SET_PERIOD,
  payload: period,
});
export const setOUGroup = (group) => ({
  type: NAVBAR_ACTION_TYPES.SET_OU_GROUP,
  payload: group,
});
export const setSelectedGroup = (selected) => ({
  type: NAVBAR_ACTION_TYPES.SET_SELECTED_GROUP,
  payload: selected,
});
