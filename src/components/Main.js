import React, { useState, useEffect } from "react";
import IPAUnits from "./IPAUnits";
import FundSummary from "./FundSummary";
import FundDisbursed from "./FundDisbursed.js";
import { ApiService } from "../api/analytics.api.js";
import { scoresId } from "../constants/Ids.js";
import { useSelector } from "react-redux";
import LayoutTree from "./LayoutTree.js";
import LeagueTable from "./LeagueTable.js";

import NQAS from "./NQAS";

const Main = () => {
  const period = useSelector((state) => state.navbar.period);

  const [scoreData, setScoreData] = useState({});
  const [scoreDataPeriod, setScoreDataPeriod] = useState({});

  const orgUnit = useSelector((state) => state.outree.clickedOU);

  useEffect(() => {
    if (orgUnit) {
      const getScores = async () => {
        var scoreOUGroup = [];
        var scoreIds = [];
        var groupName = {};
        var valuesGroup = {};
        var periodGroup = {};
        var last4Quarter = [];
        var pe = "LAST_4_QUARTERS";

        for (let group in scoresId) {
          groupName[scoresId[group]["group"]] = group;
          scoreOUGroup.push(scoresId[group]["group"]);
          scoreIds[scoresId[group]["group"]] = scoresId[group]["score"];
        }

        for (let group of scoreOUGroup) {
          let metaData = {};
          let dataRes = {};
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
          periodGroup[groupName[group]] = "";

          for (let item in res.metaData.items)
            metaData[item] = res.metaData.items[item].name;

          last4Quarter = res.metaData.dimensions.pe.reverse();

          res.rows.forEach((row) => {
            if (!dataRes[row[2]]) dataRes[row[2]] = {};
            dataRes[row[2]][row[1]] = row[3];
          });
          for (let pe of last4Quarter) {
            if (dataRes[pe]) {
              periodGroup[groupName[group]] = pe;
              for (let id in dataRes[pe]) {
                valuesGroup[groupName[group]].push({
                  name: metaData[id],
                  value: Number(dataRes[pe][id]),
                });
              }
              break;
            }
          }
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
        setScoreDataPeriod(periodGroup);
        setScoreData(valuesGroup);
      };
      getScores();
    }
  }, [orgUnit, period]);

  return (
    <div className="main-container px-2">
      <div className="row m-2 p-3">
        <IPAUnits />
      </div>
      <div className="row">
        <div className="col border m-2 p-3">
          <h5 className="fw-semibold"> IPA Funds Summary till {period}</h5>
          <FundSummary />
        </div>
        <div className="col border m-2 p-3">
          <h5 className="fw-semibold pb-5">RBF Disbursed till {period}</h5>
          <FundDisbursed />
        </div>
      </div>
      <div className="row">
        <div className="col border m-2 p-3">
          <NQAS chartId="PHC/UPHC" scoreId={scoresId["PHC/UPHC"]} />

          <h5 className="fw-bold text-center my-3">
            PHC/UPHC IPA Ex-Ante Assessment Scores (%){" "}
          </h5>
          <hr class="hr" />
          <div className="row">
            <div className="col border m-2 p-3">
              {scoreData["PHC/UPHC"] ? (
                <LayoutTree
                  chartId={"PHC/UPHC"}
                  data={scoreData["PHC/UPHC"]}
                  period={scoreDataPeriod["PHC/UPHC"]}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row">
            <div className="col border m-2 p-3">
              <LeagueTable
                name="PHC/UPHC Scores (%)"
                groupId={scoresId["PHC/UPHC"]["group"]}
                scoreId={scoresId["PHC/UPHC"]["scorePercent"]}
              />
            </div>
          </div>
          <NQAS chartId="CHC/SDH" scoreId={scoresId["CHC/SDH"]} />
          {scoreData["CHC/SDH"] ? (
            <>
              <h5 className="fw-bold text-center my-3">
                CHC/SDH IPA Ex-Ante Assessment Scores (%){" "}
              </h5>
              <hr class="hr" />

              <div className="row">
                <div className="col border m-2 p-3">
                  <LayoutTree
                    chartId={"CHC/SDH"}
                    data={scoreData["CHC/SDH"]}
                    period={scoreDataPeriod["CHC/SDH"]}
                  />
                </div>
                <div className="col border m-2 p-3">
                  <LeagueTable
                    name="CHC/SDH Scores (%)"
                    groupId={scoresId["CHC/SDH"]["group"]}
                    scoreId={scoresId["CHC/SDH"]["scorePercent"]}
                  />
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <NQAS chartId="DH" scoreId={scoresId["DH"]} />

          {scoreData["DH"] ? (
            <>
              <h5 className="fw-bold text-center my-3">
                DH IPA Ex-Ante Assessment Scores (%){" "}
              </h5>
              <hr class="hr" />

              <div className="row">
                <div className="col border m-2 p-3">
                  <LayoutTree
                    chartId={"DH"}
                    data={scoreData["DH"]}
                    period={scoreDataPeriod["DH"]}
                  />
                </div>
                <div className="col border m-2 p-3">
                  <LeagueTable
                    name="DH Scores (%)"
                    groupId={scoresId["DH"]["group"]}
                    scoreId={scoresId["DH"]["scorePercent"]}
                  />
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {scoreData["DHT"] ? (
            <>
              <h5 className="fw-bold text-center my-3">
                DHT IPA Ex-Ante Assessment Scores (%){" "}
              </h5>
              <hr class="hr" />

              <div className="row">
                <div className="col border m-2 p-3">
                  <LayoutTree
                    chartId={"DHT"}
                    data={scoreData["DHT"]}
                    period={scoreDataPeriod["DHT"]}
                  />
                </div>
                <div className="col border m-2 p-3">
                  <LeagueTable
                    name="DHT Scores (%)"
                    groupId={scoresId["DHT"]["group"]}
                    scoreId={scoresId["DHT"]["scorePercent"]}
                  />
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          {scoreData["SHT/INS"] ? (
            <>
              <h5 className="fw-bold text-center my-3">
                SHT/INS IPA Ex-Ante Assessment Scores (%){" "}
              </h5>
              <hr class="hr" />

              <div className="row">
                <div className="col border m-2 p-3">
                  <LayoutTree
                    chartId={"SHT/INS"}
                    data={scoreData["SHT/INS"]}
                    period={scoreDataPeriod["SHT/INS"]}
                  />
                </div>
                <div className="col border m-2 p-3">
                  <LeagueTable
                    name="SHT/INS Scores (%)"
                    groupId={scoresId["SHT/INS"]["group"]}
                    scoreId={scoresId["SHT/INS"]["scorePercent"]}
                  />
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
