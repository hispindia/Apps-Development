import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { navbarReducer } from "./navbar/navbar.reducer";

export const rootReducer = combineReducers({
  outree: outreeReducer,
  navbar: navbarReducer,
});
