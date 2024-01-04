import React, { useState, useEffect } from "react";

import { mizoramGeo } from "../constants/mizoram.js";
import IPAUnits from "./IPAUnits";
import FundSummary from "./FundSummary";
import FundDisbursed from "./FundDisbursed.js";
import { ApiService } from "../api/analytics.api.js";
import { scoresId } from "../constants/Ids.js";
import { useSelector } from "react-redux";
import LayoutTree from "./LayoutTree.js";
import LeagueTable from "./LeagueTable.js";

import { First, Second, Third } from "./SVG.js";

const Main = () => {
  const period = useSelector((state) => state.navbar.period);
  const [scoreData, setScoreData] = useState({});
  const [scorePercentData, setScorePercentData] = useState({});

  const orgUnit = useSelector((state) => state.outree.clickedOU);

  useEffect(() => {
    if (orgUnit) {
      const getScores = async () => {
        var scoreOUGroup = [];
        var scoreIds = [];
        var groupName = {};
        var valuesGroup = {};
        var pe =
          period == new Date().getFullYear() ? "LAST_QUARTER" : `${period}Q4`;

        for (let group in scoresId) {
          groupName[scoresId[group]["group"]] = group;
          scoreOUGroup.push(scoresId[group]["group"]);
          scoreIds[scoresId[group]["group"]] = scoresId[group]["score"];
        }

        for (let group of scoreOUGroup) {
          let metaData = {};
          let res = await ApiService.getAssesmentScore(
            scoreIds[group],
            orgUnit.id,
            group,
            pe
          );
          if (res.status == "ERROR") {
            continue;
          }

          valuesGroup[groupName[group]] = [];

          for (let item in res.metaData.items)
            metaData[item] = res.metaData.items[item].name;
          res.rows.forEach((row) =>
            valuesGroup[groupName[group]].push({
              name: metaData[row[1]],
              value: Number(row[3]),
            })
          );

          valuesGroup[groupName[group]].sort((a, b) => a.value - b.value);
          let prevValue = 0;
          let prevIndex = 0;
          valuesGroup[groupName[group]] = valuesGroup[groupName[group]].map(
            (a, index) => {
              if (prevValue != a.value) prevIndex = index;
              prevValue = a.value;
              return { ...a, colorValue: prevIndex };
            }
          );
        }
        setScoreData(valuesGroup);
      };

      const getScorePercent = async () => {
        var scoreOUGroup = [];
        var scoreIds = [];
        var groupName = {};
        var valuesGroup = {};

        for (let group in scoresId) {
          groupName[scoresId[group]["group"]] = group;
          scoreOUGroup.push(scoresId[group]["group"]);
          scoreIds[scoresId[group]["group"]] = scoresId[group]["scorePercent"];
        }

        for (let group of scoreOUGroup) {
          let prevValue = "";
          let metaData = {};
          let res = await ApiService.getAssesmentScore(
            scoreIds[group],
            orgUnit.id,
            group,
            `${period - 1}Q4;${period}Q1;${period}Q2;${period}Q3;${period}Q4`
          );
          let data = {};
          if (res.status == "ERROR") {
            continue;
          }
          valuesGroup[groupName[group]] = [];

          for (let item in res.metaData.items)
            metaData[item] = res.metaData.items[item].name;
          res.rows.forEach((row) => {
            if (!data[row[1]]) data[row[1]] = {};
            data[row[1]][row[2]] = row[3];
          });

          for (let ou in data) {
            let arr = [];
            prevValue = data[ou][`${period - 1}Q4`]
              ? data[ou][`${period - 1}Q4`]
              : "";
            [
              `${period}Q1`,
              `${period}Q2`,
              `${period}Q3`,
              `${period}Q4`,
            ].forEach((quarter) => {
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
            valuesGroup[groupName[group]].push({
              name: metaData[ou],
              values: arr,
            });
          }

          if (valuesGroup[groupName[group]].length > 3) {
            let groupVal = groupName[group];
            [
              `${period}Q1`,
              `${period}Q2`,
              `${period}Q3`,
              `${period}Q4`,
            ].forEach((pe, index) => {
              if (valuesGroup[groupVal].length > 3) {
                valuesGroup[groupVal].sort((a, b) =>
                  b.values[index].value.localeCompare(a.values[index].value)
                );
                if (valuesGroup[groupVal][0]["values"][index]["value"])
                  valuesGroup[groupVal][0]["values"][index]["position"] = (
                    <First />
                  );
                if (valuesGroup[groupVal][1]["values"][index]["value"])
                  valuesGroup[groupVal][1]["values"][index]["position"] = (
                    <Second />
                  );
                if (valuesGroup[groupVal][2]["values"][index]["value"])
                  valuesGroup[groupVal][2]["values"][index]["position"] = (
                    <Third />
                  );
              }
            });
          }
        }
        setScorePercentData(valuesGroup);
      };

      getScores();
      getScorePercent();
    }
  }, [orgUnit, period]);

  return (
    <div className="main-container px-2">
      <div className="row m-2 p-3">
        <IPAUnits />
      </div>
      <div className="row">
        <div className="col border m-2 p-3">
          <h5 className="fw-semibold"> IPA Funds Summary - {period}</h5>
          <FundSummary />
        </div>
        <div className="col border m-2 p-3">
          <h5 className="fw-semibold pb-5">RBF Disbursed Year - {period}</h5>
          <FundDisbursed />
        </div>
      </div>
      <div className="row">
        <div className="col border m-2 p-3">
          <h5 className="fw-bold text-center">
            IPA Units Ex-Ante Assessment Scores & Scores (%){" "}
          </h5>
          <hr class="hr" />
          {scoreData["PHC/UPHC"] || scorePercentData["PHC/UPHC"] ? (
            <>
              <div className="row">
                <div className="col border m-2 p-3">
                  {scoreData["PHC/UPHC"] ? (
                    <LayoutTree
                      chartId={"PHC/UPHC"}
                      data={scoreData["PHC/UPHC"]}
                      period={period}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col border m-2 p-3">
                  {scorePercentData["PHC/UPHC"] ? (
                    <LeagueTable
                      scoreId={"PHC/UPHC"}
                      data={scorePercentData["PHC/UPHC"]}
                      period={period}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {scoreData["CHC/SDH"] || scorePercentData[["CHC/SDH"]] ? (
            <>
              <div className="row">
                <div className="col border m-2 p-3">
                  {scoreData["CHC/SDH"] ? (
                    <LayoutTree
                      chartId={"CHC/SDH"}
                      data={scoreData["CHC/SDH"]}
                      period={period}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="col border m-2 p-3">
                  {scorePercentData[["CHC/SDH"]] ? (
                    <LeagueTable
                      scoreId={"CHC/SDH"}
                      data={scorePercentData["CHC/SDH"]}
                      period={period}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {scoreData["DH"] || scorePercentData["DH"] ? (
            <div className="row">
              <div className="col border m-2 p-3">
                {scoreData["DH"] ? (
                  <LayoutTree
                    chartId={"DH"}
                    data={scoreData["DH"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="col border m-2 p-3">
                {scorePercentData[["DH"]] ? (
                  <LeagueTable
                    scoreId={"DH"}
                    data={scorePercentData["DH"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {scoreData["DHT"] || scorePercentData["DHT"] ? (
            <div className="row">
              <div className="col border m-2 p-3">
                {scoreData["DHT"] ? (
                  <LayoutTree
                    chartId={"DHT"}
                    data={scoreData["DHT"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="col border m-2 p-3">
                {scorePercentData[["DHT"]] ? (
                  <LeagueTable
                    scoreId={"DHT"}
                    data={scorePercentData["DHT"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          {scoreData["SHT/INS"] || scorePercentData["SHT/INS"] ? (
            <div className="row">
              <div className="col border m-2 p-3">
                {scoreData["SHT/INS"] ? (
                  <LayoutTree
                    chartId={"SHT/INS"}
                    data={scoreData["SHT/INS"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="col border m-2 p-3">
                {scorePercentData[["SHT/INS"]] ? (
                  <LeagueTable
                    scoreId={"SHT/INS"}
                    data={scorePercentData["SHT/INS"]}
                    period={period}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
