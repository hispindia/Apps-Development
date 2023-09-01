import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { teiReducer } from "./tei/tei.reducer";

export const rootReducer = combineReducers({
  outree: outreeReducer,
  tei: teiReducer
});
