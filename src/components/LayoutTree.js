import React, { useState, useLayoutEffect } from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import addTreemapModule from "highcharts/modules/treemap";
import addHeatmapModule from "highcharts/modules/heatmap";

addTreemapModule(Highcharts);
addHeatmapModule(Highcharts);

const LayoutTree = ({ chartId, data, period}) => {
  
  var options = {
      
    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        clip: false,
        data: data,
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.value}",
        },
      },
    ],
    legend: {
      enabled: false,
    },
    title: {
      text: "",
    },  
    credits: false,
  };
  if(chartId == 'PHC/UPHC') {
    options['colorAxis'] = {
      minColor: "#FFFFFF",
      maxColor: Highcharts.getOptions().colors[0],
    }
  } else if(chartId == 'CHC/SDH') {
    options['colorAxis'] = {
      minColor: "#FFFFFF",
      maxColor: "#90ed7d",
    }
  } else  if(chartId == 'DH') {
    options['colorAxis'] = {
      minColor: "#FFFFFF",
      maxColor: "#8085e9",
    }
  } else if(chartId == 'DHT') {
    options['colorAxis'] = {
      minColor: "#FFFFFF",
      maxColor: "#e4d354",
    }
  } else if(chartId == 'SHT/INS') {
    options['colorAxis'] = {
      minColor: "#FFFFFF",
      maxColor: "#7cb5ec",
    }
  }
  return (
    <>
      <h6 className="fw-semibold">{chartId} Last Quarter Scores - {period}</h6>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default LayoutTree;
