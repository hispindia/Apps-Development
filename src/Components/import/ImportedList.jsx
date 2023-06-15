import React from "react";
import { headerNames } from "../../shared/constants";

export default function ImportedList({ passedList, sample }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr className="table-secondary">
            {headerNames[sample].values.map((val) => (
              <td>{val}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {passedList.map((tei, index) => (
            <tr className={tei.status}>
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
