import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { IndicatorScoreId } from "../../constants/Ids.js";
import { Loader } from "../Loader/index.js";

const IndicatorScore = () => {
  const [scores, setScores] = useState([]);
  const [items, setItems] = useState({});

  const groupName = useSelector((state) => state.navbar.selectedGroup);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const period = useSelector((state) => state.navbar.period);

  const quaters = period && period.split(";");

  useEffect(() => {
    setScores([]);
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
        const values = [];
        //get the data from the api
        const data = await fetch(
          `../../analytics.json?paging=false&dimension=dx:${IndicatorScoreId[
            groupName
          ].join(";")}&dimension=pe:${period}&dimension=ou:${ouList.join(
            ";"
          )}&paging=false`
        );
        // convert the data to json
        const resScore = await data.json();
        if (resScore.metaData.items) {
          let metaData = resScore.metaData.items;
          for (let id in metaData) {
            items[id] = metaData[id].name;
          }
        }
        if (resScore.rows.length) {
          let rowsQuater = {};
          let count = -1;
          resScore.rows.forEach((ou) => {
            if (!rowsQuater[ou[1]]) rowsQuater[ou[1]] = {};
            if (!rowsQuater[ou[1]][ou[2]]) rowsQuater[ou[1]][ou[2]] = {};
            rowsQuater[ou[1]][ou[2]][ou[0]] = ou[3];
          });
          quaters.map((quater) => {
            let quaterLength = 0;
            if (rowsQuater[quater]) {
              for (let ou in rowsQuater[quater]) {
                count++;
                quaterLength++;
                values[count] = [];
                values[count].push(
                  <td>
                    {ouPath[ou] ? `${ouPath[ou]}/` : ""}
                    {items[ou]}
                  </td>
                );
                IndicatorScoreId[groupName].forEach((dx) => {
                  let val =
                    rowsQuater[quater][ou] && rowsQuater[quater][ou][dx]
                      ? Number(rowsQuater[quater][ou][dx])
                      : "";
                  values[count].push(
                    <td>{new Intl.NumberFormat("en-IN").format(val)}</td>
                  );
                });
              }
              values[count + 1 - quaterLength].unshift(
                <td rowspan={quaterLength}>{items[quater]}</td>
              );
            }
          });
        }
        // set state with the result
        setItems(items);
        setScores(values);
        setHasValue(true);
      };
      // call the function
      fetchData();
    }
  }, [period, groupName, ouGroup]);

  if (!scores.length) return <Loader />;
  return IndicatorScoreId[groupName] ? (
    <div>
      <h5 className="py-3 my-3 bg-light">
        3. {groupName} IPA Ex-Ante Assessment Indicator Scores
      </h5>
      <div className="scroll">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="header fw-normal" colSpan={2}></th>
              {IndicatorScoreId[groupName].map((item) => (
                <th className="header fw-normal">{items[item]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scores.map((items) => (
              <tr>{items.map((item) => item)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    ""
  );
};

export default IndicatorScore;
