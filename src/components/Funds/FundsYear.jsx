import React, { useState, useEffect } from "react";

import { fundsIdYear } from "../../constants/Ids";
import { useSelector } from "react-redux";
import { getYears } from "../../functions/period";
import { Loader } from "../Loader";

export const FundsYear = () => {
  const [funds, setFunds] = useState([]);
  const groupName = useSelector((state) => state.navbar.selectedGroup);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const periods = getYears(new Date().getFullYear())

  useEffect(() => {
    setFunds([]);
    if (groupName && ouGroup) {
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
        var color = '';
        const items = {};
        const values = [];
        const plotFields = {
          series: [],
        };
        // get the data from the api
        const data = await fetch(
          `../../analytics.json?paging=false&dimension=dx:${fundsIdYear.join(
            ";"
          )}&dimension=ou:${ouList.join(";")}&dimension=pe:${periods.join(
            ";"
          )}&skipRounding=false&outputIdScheme=UID`
        );
        // convert the data to json
        const resFunds = await data.json();


        if (resFunds.metaData.items) {
          let metaData = resFunds.metaData.items;
          for (let id in metaData) {
            items[id] = metaData[id].name;
          }
        }
        if (resFunds.rows.length) {
          let rowsYear = {};
          let count = -1;
          let hasPassed = false;
          resFunds.rows.forEach((row) => {
            if (!rowsYear[row[1]]) rowsYear[row[1]] = {};
            if (!rowsYear[row[1]][row[2]]) rowsYear[row[1]][row[2]] = {};
            rowsYear[row[1]][row[2]][row[0]] = row[3];
          });
          for (let row in rowsYear) {
            const totalValues = [0, 0, 0];
            count++;
            hasPassed = false;
            values[count] = [];
            var ouName = ouPath[row]
              ? `${ouPath[row]}/${items[row]}`
              : items[row];

            values[count].push(<td rowSpan={periods.length}>{ouName}</td>);

            periods.map((period) => {
              color = "";
              if (hasPassed) {
                values[++count] = [];
              }
              hasPassed = true;
              values[count].push(<td>{items[period]}</td>);
              fundsIdYear.forEach((dx, indexDX) => {
                let val =
                  rowsYear[row][period] && rowsYear[row][period][dx]
                    ? Number(rowsYear[row][period][dx])
                    : "";
                if (dx.includes(";")) {
                  let ids = dx.split(";");
                  val =
                    rowsYear[row][period] && rowsYear[row][period][ids[0]]
                      ? Number(rowsYear[row][period][ids[0]])
                      : "";
                  val =
                    rowsYear[row][period] && rowsYear[row][period][ids[1]]
                      ? Number(rowsYear[row][period][ids[1]]) + Number(val)
                      : val;
                }
                values[count].push(
                  <td>{new Intl.NumberFormat("en-IN").format(val)}</td>
                );
                totalValues[indexDX] += Number(val);
              });
            });
            values[++count] = [];
            values[count].push(
              <td className={"bg-light"} colSpan={2}>
                {" "}
                {ouName} total
              </td>
            );
            totalValues.forEach((totals) =>
              values[count].push(
                <td className={"bg-light"}>
                  {new Intl.NumberFormat("en-IN").format(totals)}
                </td>
              )
            );
          }
        }
        // set state with the result
        setFunds(values);
      };
      // call the function
      fetchData();
    }
  }, [groupName, ouGroup]);

  if(!funds.length) return <Loader />
  return (
    <div className="my-4">
      <h5 className="py-2 mb-3 bg-light">
        {''}{groupName} Yearly Funds and Disbursement Status
      </h5>
      <div className="scroll">
        {new Boolean(funds.length) && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="header fw-normal" colSpan={2}>
                  IPA Unit / Quarter
                </th>
                <th className="header fw-normal">
                  One Time Grant (OTG) received
                </th>
                <th className="header fw-normal">
                  Total funds received (OTG + RBF)
                </th>
                <th className="header fw-normal">RBF Funds Utilised</th>
              </tr>
            </thead>
            <tbody>
              {funds.map((items) => (
                <tr>{items.map((item) => item)}</tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
