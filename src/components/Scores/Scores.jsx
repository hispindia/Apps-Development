import React, { useState, useEffect, useContext } from "react";

import { scoresId } from "../../constants/Ids";
import { useSelector } from "react-redux";
import { DownArrow, UpArrow } from "../../constants/SVG";
import { Loader } from "../Loader";

export const Scores = () => {
  const [scores, setScores] = useState([]);
  const [items, setItems] = useState({});
  const [hasValue, setHasValue] = useState(false);

  const groupName = useSelector((state) => state.navbar.selectedGroup);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const period = useSelector((state) => state.navbar.period);
  const quaters = period && period.split(";");

  useEffect(() => {
    setScores([]);
    if (period && groupName && ouGroup) {
      const colors = {
        safe: "#81c981",
        medium: "#ebeb1c",
        danger: "#f64c4c",
      };
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
      if (groupName != "ALL IPA Units") {
        const fetchData = async () => {
          const items = {};
          const values = [];
          //get the data from the api
          const data = await fetch(
            `../../analytics.json?paging=false&dimension=dx:${scoresId[
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
              if (!rowsQuater[ou[2]]) rowsQuater[ou[2]] = {};
              if (!rowsQuater[ou[2]][ou[0]]) rowsQuater[ou[2]][ou[0]] = {};
              rowsQuater[ou[2]][ou[0]][ou[1]] = ou[3];
            });
            for (let ou in rowsQuater) {
              let prevValue = 'noVal';
              count++;
              values[count] = [];
              values[count].push(
                <td>
                  {ouPath[ou] ? `${ouPath[ou]}/` : ""}
                  {items[ou]}
                </td>
              );
              scoresId[groupName].forEach((dx, index) => {
                quaters.map((quater) => {
                  let val =
                    rowsQuater[ou][dx] && rowsQuater[ou][dx][quater]
                      ? Number(rowsQuater[ou][dx][quater])
                      : "";
                  if (index == 1) {
                    let color = "";
                    let calVal = '';
                    if(prevValue == 'noVal') calVal = prevValue;
                    else calVal = val - prevValue;
                    prevValue = val;
                    
                    if (val > 0 && val <= 40) color = colors["danger"];
                    if (val > 40 && val <= 70) color = colors["medium"];
                    if (val > 70 && val <= 100) color = colors["safe"];
                    values[count].push(
                      <td style={{ backgroundColor: color }}>
                        {calVal >= 5 ? <UpArrow color="black"/> : ""}
                        {calVal <= -5 ? <DownArrow color="black"/>: ""}{" "}
                        {new Intl.NumberFormat("en-IN").format(val)}
                      </td>
                    );
                  } else
                    values[count].push(
                      <td>{new Intl.NumberFormat("en-IN").format(val)}</td>
                    );
                });
              });
            }
          }
          debugger;
          // set state with the result
          setItems(items);
          setScores(values);
          setHasValue(true);
        };
        // call the function
        fetchData();
      }
    }
  }, [period, groupName, ouGroup]);

  if(!scores.length) return <Loader />
  return hasValue && scoresId[groupName] ? (
    <div>
      <h5 className="py-3 mb-3 bg-light">2. {groupName} Scorecard</h5>
      <div className="scroll">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="header fw-normal"></th>
              {scoresId[groupName].map((item) => (
                <th className="header fw-normal" colSpan={quaters.length}>
                  {items[item]}
                </th>
              ))}
            </tr>
            <tr>
              <th className="header fw-normal"></th>
              {quaters.map((quater) => (
                <th className="header fw-normal">{quater}</th>
              ))}
              {quaters.map((quater) => (
                <th className="header fw-normal">{quater}</th>
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
