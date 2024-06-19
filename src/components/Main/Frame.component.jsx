import React, { useState, useEffect } from "react";
import { CircularLoader, AlertBar } from "@dhis2/ui";

import { ApiService } from "../../api/report.api";

import { wrapHtmlInTemplate } from "../constants";
import { useSelector } from "react-redux";

const Frame = ({ report, ou }) => {
  const selectedGroup = useSelector(state=> state.outree.selectedGroup);
  const [reportDesign, setReportDesign] = useState("");
  const [status, setStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ApiService.getReport(report, ou)
      .then((response) => {
        setReportDesign(response);
        setStatus(true);
      })
      .catch((e) => setError(e));
  }, []);

  if (error) {
    return <AlertBar warning>{error}</AlertBar>;
  }
  if (!status) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <CircularLoader />
      </div>
    );
  }

  return (
    <iframe
      id="html-report-id"
      srcDoc={wrapHtmlInTemplate(reportDesign, selectedGroup)}
      title="html-report-content"
      width="100%"
      seamless={true}
      sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
    ></iframe>
  );
};

export default Frame;
