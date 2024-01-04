import React, { useState, useEffect } from "react";

import { First, Second, Third, DownArrow, UpArrow } from "./SVG.js";

import ArrowSort from "./ArrowSort.js";

import "./style.scss";

const LeagueTable = ({ scoreId, data, period }) => {
  const [scores, setScores] = useState(data);

  useEffect(() => {
    if (data) setScores(data);
  }, [data]);

  const handleSort = (arrow, quarter, status) => {
    var output = [...data];
    if (arrow == "up" && status) {
      output.sort(
        (a, b) => b["values"][quarter].value - a["values"][quarter].value
      );
    }
    if (arrow == "up" && !status) {
      output = data;
    }
    if (arrow == "down" && status) {
      output.sort(
        (a, b) => a["values"][quarter].value - b["values"][quarter].value
      );
    }
    if (arrow == "down" && !status) {
      output = data;
    }
    setScores(output);
  };
  return (
    <>
      <h6 class="fw-semibold">
        {scoreId} Scores (%){" "}
        <span className="fs-6 fw-normal px-2">
          <First /> 1<sup>st</sup> Place
        </span>
        <span className="fs-6 fw-normal px-2">
          <Second /> 2<sup>nd</sup> Place
        </span>
        <span className="fs-6 fw-normal px-2">
          <Third /> 3<sup>rd</sup> Place
        </span>
      </h6>
      <div className="scroll">
        <table className="table table-bordered">
          <thead>
            <tr className="table-secondary">
              <th className="header fw-normal text-start">S/N</th>
              <th className="header fw-normal text-start">IPA Unit</th>
              <th className="header fw-normal text-start">
                Jan to Mar {period}{" "}
                <ArrowSort handleSort={handleSort} quarter={0} />
              </th>
              <th className="header fw-normal text-start">
                Apr to Jun {period}{" "}
                <ArrowSort handleSort={handleSort} quarter={1} />
              </th>
              <th className="header fw-normal text-start">
                Jul to Sep {period}{" "}
                <ArrowSort handleSort={handleSort} quarter={2} />
              </th>
              <th className="header fw-normal text-start">
                Oct to Dec {period}{" "}
                <ArrowSort handleSort={handleSort} quarter={3} />
              </th>
            </tr>
          </thead>
          <tbody>
            {scores.map((row, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{row["name"]}</td>
                {row.values.map((val) => (
                  <td>
                    {val.status == "high" ? (
                      <UpArrow color="black" />
                    ) : val.status == "low" ? (
                      <DownArrow color="black" />
                    ) : (
                      ""
                    )}{" "}
                    <span>{val.value}</span>{" "}
                    <span className="float-end">{val.position}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeagueTable;
