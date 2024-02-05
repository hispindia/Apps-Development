import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { ApiService } from "../api/analytics.api";
import { rbfFundId } from "../constants/Ids";
import { getYears } from "./utils";
import { Loader } from "./Loader";

const FundDisbursed = () => {
  const period = useSelector((state) => state.navbar.period);
  const ouList = useSelector((state) => state.outree.ouChildren);

  const [xAxis, setXAxis] = useState([]);
  const [rbfFund, setRbfFund] = useState([]);

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
        dataLabels: {
          formatter: function () {
            return new Intl.NumberFormat("en-IN").format(this.y);
          },
          enabled: true,
        },
      },
    },

    series: [
      {
        name: "RBF Disbursed",
        data: rbfFund,
        tooltip: {
          pointFormatter: function () {
            return (
              "RBF Disbursed: " + new Intl.NumberFormat("en-IN").format(this.y)
            );
          },
        },
      },
    ],
    credits: false,
  };

  useEffect(() => {
    setRbfFund([]);
    if (ouList.length) {
      const periods = getYears(period);
      ApiService.getFundDisbursed(rbfFundId, ouList, periods.join(";")).then(
        (data) => {
          console.log(data);
          var metaData = {};
          var dataValues = {};
          var sortedDV = [];
          var axisValues = [];
          var plotValues = [];

          for (let item in data.metaData.items)
            metaData[item] = data.metaData.items[item].name;
          data.rows.forEach((row) => (dataValues[row[1]] = Number(row[2])));

          for (let id in dataValues) {
            sortedDV.push({ name: metaData[id], value: dataValues[id] });
          }
          sortedDV.sort((a, b) => b.value - a.value);

          axisValues = sortedDV.map((dv) => dv.name);
          plotValues = sortedDV.map((dv) => dv.value);
          setXAxis(axisValues);
          setRbfFund(plotValues);
        }
      );
    }
  }, [ouList, period]);

  if (!rbfFund.length) return <Loader />;
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default FundDisbursed;
