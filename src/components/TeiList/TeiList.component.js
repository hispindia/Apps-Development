import React from "react";
import { ATTR_DE } from "../constants";
import { useSelector } from "react-redux";
import { CircularLoader } from "@dhis2/ui";

const TeiList = () => {
  const teiList = useSelector((state) => state.tei.list);
  const teiPresent = useSelector((state) => state.tei.teiPresent);

  if (!teiPresent && !teiList.length)
    return (
      <div className="d-flex justify-content-center">
        <CircularLoader />
      </div>
    );
  if (teiPresent && !teiList.length) return <h4 className="text-center">No Record Exist!</h4>;
  return (
    <div id='download'>
      <div className="scroll">
        <table className="table table-bordered">
          <thead>
            <tr>
              {<th className="header fw-normal">S.No.</th>}
              {ATTR_DE.map((val) => (
                <th className="header fw-normal">{val.name}</th>
              ))}
            </tr> 
          </thead>
          <tbody>
            {teiList.map((tei, index) => (
              <tr>
                <td>{index + 1}</td>
                {tei.map((val) => (
                  <td>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeiList;
