import { REPORT_ACTION_TYPES } from "./report.reducer";

export const setReportList = (list) => ({
  type: REPORT_ACTION_TYPES.SET_REPORT_LIST,
  payload: list,
});

export const setReportId = (report) => ({
  type: REPORT_ACTION_TYPES.SET_REPORTID,
  payload: report,
});

export const setDisplay = (bool) => ({
  type: REPORT_ACTION_TYPES.SET_DISPLAY,
  payload: bool,
});