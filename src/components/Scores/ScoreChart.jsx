import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";  
import { useSelector } from "react-redux";
import { Loader } from "../Loader";

export const ScoreChart = () => {
  const [xAxis, setXAxis] = useState([]);
  const [series, setSeries] = useState([]);
  const [chartType, setChartType] = useState("column");
  const period = useSelector((state) => state.navbar.period);
  const groupName = useSelector((state) => state.navbar.selectedGroup);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const quaters = period && period.split(";");
  const dimensionDX = [
    "kF4eonlAqWm",
    "PAL0VCxo7SW",
    "MV5KGu86GRC",
    "PP0SXwT8k7Q",
    "cDGN8aQEIXp",
    "kxZYPry1cGD",
  ];

  const options = {
    chart: {
      type: chartType,
    },
    title: {
      text: "IPA Total Ex-Ante Assessment Scores (per quarter)",
    },
    xAxis: {
      categories: xAxis,
    },
    series: series,
  };

  useEffect(() => {
    setSeries([]);
    if (period && groupName && ouGroup) {
      var group,
        ouList = [],
        ouPath = {};
      group = ouGroup.filter((group) => group.name == groupName);
      if (group.length)
        ouList = group[0].ouList.map((ou) => {
          ouPath[ou.id] =
            Array.isArray(ou.ancestors) && ou.ancestors[1]
              ? ou.ancestors[1]["name"]
              : "";
          return ou.id;
        });

      const fetchData = async () => {
        const items = {};
        const plotFields = {
          xAxis: [
            "IPA PHC Ex-Ante Assessment Scores (average)",
            "IPA CHC Ex-Ante Assessment Scores (average)",
            "IPA DH Ex-Ante Assessment Scores (average)",
            "IPA DHT Ex-Ante Assessment Scores (average)",
            "SHT Ex-Ante Assessment Score",
            "INS IPA Ex-Ante Assessments Score",
          ],
          series: [],
          credits: false,
        };
        //get the data from the api

        const data = await fetch(
          `../../analytics.json?paging=false&dimension=dx:${dimensionDX.join(
            ";"
          )}&dimension=pe:${period}&completedOnly=false&outputIdScheme=UID&filter=ou:${ouList.join(
            ";"
          )}
          `
        );
        // convert the data to json
        const resData = await data.json();

        if (resData.metaData.items) {
          let metaData = resData.metaData.items;
          for (let id in metaData) {
            items[id] = metaData[id].name;
          }
        }
        if (resData.rows.length) {
          let rowsData = {};
          resData.rows.forEach((row) => {
            if (!rowsData[row[0]]) rowsData[row[0]] = {};
            rowsData[row[0]][row[1]] = row[2];
          });
          dimensionDX.forEach((dx) => {
            quaters.map((quater, index) => {
              let val =
                rowsData[dx] && rowsData[dx][quater]
                  ? Number(rowsData[dx][quater])
                  : 0;
              if (!plotFields.series[index]) {
                plotFields.series[index] = {
                  name: items[quater],
                  data: [],
                };
              }
              plotFields.series[index]["data"].push(val);
            });
          });
        }
        // set state with the result
        setXAxis(plotFields.xAxis);
        setSeries(plotFields.series);
      };
      // call the function
      fetchData();
    }
  }, [period, groupName, ouGroup]);

  if(!series.length) return <Loader />
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
