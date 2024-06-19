import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { reportReducer } from "./report/report.reducer";

export const rootReducer = combineReducers({
  outree: outreeReducer,
  report: reportReducer
});
