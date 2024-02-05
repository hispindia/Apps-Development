import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ApiService } from "../api/analytics.api";
import { qMonths } from "../constants/Ids";
import { getQuarters } from "./utils";
import LeagueTable from "./LeagueTable";

const NQAS = ({ chartId, scoreId }) => {
  const period = useSelector((state) => state.navbar.period);
  const orgUnit = useSelector((state) => state.outree.clickedOU);

  const [xAxis, setXAxis] = useState([]);
  const [nqasScore, setNqasScore] = useState("");
  const [quarter, setQuarter] = useState("");

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: xAxis,
    },

    plotOptions: {
      series: {
        color: scoreId["color"],
        dataLabels: {
          enabled: true,
        },
      },
    },

    series: [
      {
        name: "NQAS Ex-Ante Assessment Score (%)",
        data: nqasScore,
      },
    ],
    credits: false,
  };

  useEffect(() => {
    setNqasScore("");
    if (orgUnit) {
      const quarters = getQuarters(period);
      ApiService.getAssesmentScore(
        scoreId["nqas"],
        orgUnit.id,
        scoreId["group"],
        quarters.join(';')
      ).then((res) => {
        if (res.status == "ERROR") return;
        var last4Quarter = [];
        var metaData = {};
        var dataRes = {};
        var plotValues = [];
        var axisValues = [];
        var dataPeriod = "";

        for (let item in res.metaData.items)
          metaData[item] = res.metaData.items[item].name;

        last4Quarter = res.metaData.dimensions.pe.reverse();
        res.rows.forEach((row) => {
          if (!dataRes[row[2]]) dataRes[row[2]] = {};
          dataRes[row[2]][row[1]] = row[3];
        });

        for (let pe of last4Quarter) {
          if (dataRes[pe]) {
            dataPeriod = pe;
            for (let id in dataRes[pe]) {
              plotValues.push({
                name: metaData[id],
                value: Number(dataRes[pe][id]),
              });
            }
            break;
          }
        }

        plotValues.sort((a, b) => b.value - a.value);

        axisValues = plotValues.map((dv) => dv.name);
        plotValues = plotValues.map((dv) => dv.value);
        setXAxis(axisValues);
        setNqasScore(plotValues);
        setQuarter(dataPeriod);
      });
    }
  }, [orgUnit, period]);

  if (!nqasScore) return null;
  return (
    <>
      <h5 className="fw-bold text-center my-3">
        {chartId} NQAS Ex-Ante Assessment Scores (%)
      </h5>
      <hr class="hr" />
      <div className="row g-2">
        <div className={chartId=="PHC/UPHC" ? "col-12 border m-2 p-3":"col border m-2 p-3"}>
          <div className="scroll">
            <h6 className="fw-semibold">
              {chartId} NQAS (
              {quarter
                ? qMonths[quarter.split("Q")[1]] + ", " + quarter.split("Q")[0]
                : ""}
              )
            </h6>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
        <div className={chartId=="PHC/UPHC" ? "col-12 border m-2 p-3":"col border m-2 p-3"}>
          <LeagueTable
            name={`${chartId} NQAS (%)`}
            groupId={scoreId["group"]}
            scoreId={scoreId["nqas"]}
          />
        </div>
      </div>
    </>
  );
};

export default NQAS;
