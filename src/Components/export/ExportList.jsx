import React from "react";
import { headerNames } from "../../shared/constants";

export default function ExportList({ teiList, sample }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr className="table-success">
            {headerNames[sample].values.map((val) => (
              <td>{val}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {teiList.map((tei, index) => (
            <tr>
              <td>{index + 1}</td>
              {tei.map((data) => (
                <td>{data ? data : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
