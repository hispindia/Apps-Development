import { TEI_ACTION_TYPES } from "./tei.reducer";

export const setTeiList = (list) => ({
  type: TEI_ACTION_TYPES.SET_TEI_LIST,
  payload: list,
});
export const setTeiPresent = (bool) => ({
  type: TEI_ACTION_TYPES.SET_TEI_PRESENT,
  payload: bool,
});