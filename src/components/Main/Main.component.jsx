import React, { useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";

import { setDisplay, setReportId, setReportList } from "../../store/report/report.action";

import Frame from "./Frame.component";

import { reportFilter } from "../constants";

const Main = ({ data }) => {

  const dispatch = useDispatch();

  const ou = useSelector((state) => state.outree.clickedOU);
  const reports = useSelector((state) => state.report.list);
  const reportId = useSelector((state) => state.report.reportId);
  const display = useSelector((state) => state.report.display);

  useEffect(() => {
    if (data) {
      if (data.ouReports) {
        const reports = data.ouReports.reports.filter((report) =>
          report.name.includes(reportFilter)
        ).map((report) => ({
          ...report,
          name: report.name.replace(reportFilter, ""),
        }));
        const reportId = reports.length ? reports[0].id : "";
        dispatch(setReportId(reportId));
        dispatch(setReportList(reports));
      }
    }
  }, [data]);
  const handleReportSelection = (e) => {
    const { value } = e.target;
    dispatch(setReportId(value));
    dispatch(setDisplay(false));
  };

  const getFrame = () => dispatch(setDisplay(true));

  return (
    <div className="ms-2 w-100">
      <div className="input-group w-50">
        <select
          className="form-select"
          value={reportId}
          onChange={handleReportSelection}
        >
          <option selected disabled>
            Select Report
          </option>
          {reports.map((report) => (
            <option value={report.id}>{report.name}</option>
          ))}
        </select>
        <button className="btn btn-primary ms-2" onClick={getFrame}>
          Generate
        </button>
      </div>
      <div className="h-75 mt-3">
      {display && <Frame report={reportId} ou={ou.id} />}
      </div>
    </div>
  );
};

export default Main;
