import React, { useState, useEffect } from "react";

import { fundsId } from "../../constants/Ids";
import { useSelector } from "react-redux";
import { FundsYear } from "./FundsYear";
import { Loader } from "../Loader";

export const Funds = () => {
  const [funds, setFunds] = useState([]);
  const groupName = useSelector((state) => state.navbar.selectedGroup);
  const ouGroup = useSelector((state) => state.navbar.ouGroup);
  const period = useSelector((state) => state.navbar.period);
  const quaters = period && period.split(";");

  useEffect(() => {
    setFunds([])
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
        const plotFields = {
          series: [],
        };
        // get the data from the api
        const data = await fetch(
          `../../analytics.json?paging=false&dimension=dx:${fundsId.join(
            ";"
          )}&dimension=ou:${ouList.join(
            ";"
          )}&dimension=pe:${period}&skipRounding=false&outputIdScheme=UID`
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
          let color = "";
          let rowsQuater = {};
          let count = -1;
          let hasPassed = false;
          resFunds.rows.forEach((row) => {
            if (!rowsQuater[row[1]]) rowsQuater[row[1]] = {};
            if (!rowsQuater[row[1]][row[2]]) rowsQuater[row[1]][row[2]] = {};
            rowsQuater[row[1]][row[2]][row[0]] = row[3];
          });
          for (let row in rowsQuater) {
            const totalValues = [0, 0, 0, 0, 0];
            let budgetRemain = 0;
            count++;
            hasPassed = false;
            values[count] = [];
            var ouName = ouPath[row]
              ? `${ouPath[row]}/${items[row]}`
              : items[row];

            values[count].push(<td rowSpan={quaters.length}>{ouName}</td>);

            quaters.map((quater) => {
              color = "";
              if (hasPassed) {
                values[++count] = [];
              }
              hasPassed = true;
              values[count].push(<td>{items[quater]}</td>);
              fundsId.forEach((dx, indexDX) => {
                let val =
                  rowsQuater[row][quater] && rowsQuater[row][quater][dx]
                    ? Number(rowsQuater[row][quater][dx])
                    : "";
                if (dx.includes(";")) {
                  let ids = dx.split(";");
                  val =
                    rowsQuater[row][quater] && rowsQuater[row][quater][ids[0]]
                      ? Number(rowsQuater[row][quater][ids[0]])
                      : "";
                  val =
                    rowsQuater[row][quater] && rowsQuater[row][quater][ids[1]]
                      ? Number(rowsQuater[row][quater][ids[1]]) + Number(val)
                      : val;
                }
                if (indexDX == 1) {
                  budgetRemain += val;
                } else if (indexDX == 2) {
                  budgetRemain -= Number(val);
                } else if (indexDX == 3) {
                  if (val && val * 2 >= budgetRemain) color = "#43a047";
                  else if (val && val * 2 <= budgetRemain) color = "#d32f2f";
                }
                values[count].push(
                  <td>{new Intl.NumberFormat("en-IN").format(val)}</td>
                );
                totalValues[indexDX] += Number(val);
              });
              values[count].push(
                <td
                  style={
                    color
                      ? {
                          backgroundColor: `${color}`,
                          color: "white",
                        }
                      : {}
                  }
                >
                  {new Intl.NumberFormat("en-IN").format(budgetRemain)}
                </td>
              );
              totalValues[4] = budgetRemain;
            });
            values[++count] = [];
            plotFields["series"].push({
              name: items[row],
              fundsReceived: totalValues[1],
              fundsUtilized: totalValues[2],
            });
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
  }, [period, groupName, ouGroup]);
  return (
    <div>
      <h5 className="py-2 mb-3 bg-light">
        1. {groupName} IPA Overall Funds and Disbursement Status
      </h5>
      <div className="scroll">
        {!funds.length  ? <Loader /> : (
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
                <th className="header fw-normal">
                  Quarterly RBF Budget (in INR)
                </th>
                <th className="header fw-normal">RBF Funds Remaining</th>
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
      <div>
        <FundsYear />
      </div>
    </div>
  );
};
