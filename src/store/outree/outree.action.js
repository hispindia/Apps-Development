import { OUTREE_ACTION_TYPES } from "./outree.reducer";

export const setUserOU = (ou) => ({
  type: OUTREE_ACTION_TYPES.SET_USER_OU,
  payload: ou,
});
export const setOUChildren = (ouChildren) => ({
  type: OUTREE_ACTION_TYPES.SET_OU_CHILDREN,
  payload: ouChildren,
});
export const setClickedOU = (ou) => ({
  type: OUTREE_ACTION_TYPES.SET_CLICKED_OU,
  payload: ou,
});
