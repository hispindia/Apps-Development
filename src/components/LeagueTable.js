import React, { useState, useEffect } from "react";
import "./style.scss";

import { First, Second, Third, DownArrow, UpArrow } from "./SVG.js";

import ArrowSort from "./ArrowSort.js";

import { useSelector } from "react-redux";
import { getQuarters } from "./utils.js";
import { qMonths } from "../constants/Ids.js";
import { ApiService } from "../api/analytics.api.js";

const LeagueTable = ({ name, groupId, scoreId }) => {
  const [scores, setScores] = useState('');
  const [periodHead, setPeriodHead] = useState([]);
  const orgUnit = useSelector((state) => state.outree.clickedOU);
  const period = useSelector((state) => state.navbar.period);

  useEffect(()=> {
    const quaters = getQuarters(period);
    quaters.shift();
    const head = quaters.map(q => qMonths[(q.split('Q')[1])] + ', ' + q.split('Q')[0]);
    setPeriodHead(head);
  }, [period])

  useEffect(() => {
    setScores('');
    if (orgUnit) {
      const quarters = getQuarters(period);
      ApiService.getAssesmentScore(
        scoreId,
        orgUnit.id,
        groupId,
        quarters.join(";")
      ).then((res) => {
        if(res.status=="ERROR") return;
        if(res.rows.length) {
          var metaData = {};
          var data = {};
          var prevValue = "";
          var newScores = [];
  
          for (let item in res.metaData.items)
            metaData[item] = res.metaData.items[item].name;
  
          res.rows.forEach((row) => {
            if (!data[row[1]]) data[row[1]] = {};
            data[row[1]][row[2]] = row[3];
          });
  
          for (let ou in data) {
            let arr = [];
            prevValue = data[ou][quarters[0]] ? data[ou][quarters[0]] : "";
            quarters
              .filter((_, index) => index !== 0)
              .forEach((quarter) => {
                let val = data[ou][quarter] ? data[ou][quarter] : "";
                let status = "";
  
                if (val) {
                  let calVal = "";
                  if (!prevValue) calVal = prevValue;
                  else calVal = val - prevValue;
  
                  if (calVal >= 5) status = "high";
                  if (calVal <= -5) status = "low";
                }
                prevValue = val;
  
                arr.push({
                  period: quarter,
                  value: val,
                  status: status,
                  position: "",
                });
              });
              newScores.push({
                name: metaData[ou],
                values: arr
              })
            }
  
            if (newScores.length > 3) {
              quarters
                .filter((_, index) => index !== 0)
                .forEach((pe, index) => {
                  if (newScores.length > 3) {
                    newScores.sort((a, b) =>
                      b.values[index].value.localeCompare(a.values[index].value)
                    );
                    if (newScores[0]["values"][index]["value"])
                      newScores[0]["values"][index]["position"] = (
                        <First />
                      );
                    if (newScores[1]["values"][index]["value"])
                      newScores[1]["values"][index]["position"] = (
                        <Second />
                      );
                    if (newScores[2]["values"][index]["value"])
                      newScores[2]["values"][index]["position"] = (
                        <Third />
                      );
                  }
                });
            }
            setScores(newScores);
        }
      });
    }
  }, [orgUnit, period]);
  
  const handleSort = (arrow, quarter, status) => {
    var output = [...scores];
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
    scores && 
    <>
      <h6 class="fw-semibold">
        {name}
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
              {periodHead.map((quarter,index) => (
                <th className="header fw-normal text-start">
                  {quarter}
                  <ArrowSort handleSort={handleSort} quarter={index} />
                </th>
              ))}
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
