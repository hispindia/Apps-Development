import { OUTREE_ACTION_TYPES } from "./outree.reducer";

export const setUserOU = (ou) => ({
  type: OUTREE_ACTION_TYPES.SET_USER_OU,
  payload: ou,
});
export const setOUList = (ouList) => ({
  type: OUTREE_ACTION_TYPES.SET_OU_LIST,
  payload: ouList,
});
export const setSelectedOU = (ou) => ({
  type: OUTREE_ACTION_TYPES.SET_SELECTED_OU,
  payload: ou,
});
export const setClickedOU = (ou) => ({
  type: OUTREE_ACTION_TYPES.set_CLICKED_OU,
  payload: ou,
});
