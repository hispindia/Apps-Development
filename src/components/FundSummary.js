import React, { useState, useEffect } from "react";
import { ApiService } from "../api/analytics.api";
import { fundsSummaryIds } from "../constants/Ids";
import { useSelector } from "react-redux";

import './style.scss'

const FundSummary = () => {
  const period = useSelector((state) => state.navbar.period);
  const ouList = useSelector((state) => state.outree.ouChildren);
  const [FSList, setFSList] = useState([]);

  useEffect(() => {
    if (ouList.length) {
      ApiService.getFundStatus(fundsSummaryIds, ouList, period).then((res) => {
        var values = [];
        const data = {};
        var metaData = {};
        for (let item in res.metaData.items)
          metaData[item] = res.metaData.items[item].name;

        res.rows.forEach((row) => {
          if (!data[row[1]]) data[row[1]] = {};
          data[row[1]][row[0]] = row[2];
        });
        for (let ou in data) {
          let entityVal = [];
          fundsSummaryIds.forEach((id, index) => {
            if (id.includes(";")) {
              id = id.split(";");
              entityVal[index] = 0;
              id.forEach((i) => {
                let val = data[ou][i] ? data[ou][i] : "";
                entityVal[index] = Number(entityVal[index]) + Number(val);
              });
            } else {
              let val = data[ou][id] ? data[ou][id] : "";
              entityVal[index] = Number(val);
            }
          });
          values.push({
            name: metaData[ou],
            earned: entityVal[0],
            expenditure: entityVal[1],
          });
        }
        values.sort((a, b) => a.name.localeCompare(b.name));
        setFSList(values);
      });
    }
  }, [ouList, period]);

  return (
    <div className="fund-container scroll mt-2">
      <table className="table table-bordered">
        <thead>
          <tr className="table-secondary">
            <th className="header fw-normal text-start" >Mizoram</th>
            <th className="header fw-normal text-start" >Earned+OTG</th>
            <th className="header fw-normal text-start" >Expenditure</th>
          </tr>
        </thead>
        <tbody>
          {FSList.map((entity) => (
            <tr>
              <td>{entity.name}</td>
              <td>{entity.earned}</td>
              <td>{entity.expenditure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundSummary;
