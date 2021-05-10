import React, { useEffect, useState } from "react";
import Frame from "./Frame"
const Static = () => {
  const [Loader, setID] = useState(false);
  const [LoaderNationalId, setNationalID] = useState(false);
  const [LoaderSystemId, setSystemID] = useState(false);
  const [LoadCertificate, generateCertification] = useState(false);

  const selectedId = (event) => {
    if (event.target.value == "National ID") {
      setID(true);
      setNationalID(true);
      setSystemID(false);
    }
    if (event.target.value == "System ID") {
      setID(true);
      setSystemID(true);
      setNationalID(false);
    }
  };
  const onGenerateCertificate = ()=>{
    generateCertification(true)
  }
  return (
    <div>
    <div className="box">
      <div class="row">
        <div class="col-4">
          <strong>Select ID Type :</strong>{" "}
        </div>
        <div class="col-8">
          <select className="form-control" onChange={(e) => selectedId(e)}>
            <option selected hidden>
              Select ID...
            </option>
            <option>National ID</option>
            <option>System ID</option>
          </select>
        </div>
      </div>
      <br />
      {Loader ? (
        LoaderNationalId ? (
          <div>
            <div className="row">
              <div className="col-4">
                <strong>National ID :</strong>
              </div>
              <div className="col-8">
                <input className="form-control" />
              </div>
            </div>
            <br />
          </div>
        ) : "" || LoaderSystemId ? (
          <div>
            <div className="row">
              <div className="col-4">
                <strong>System ID :</strong>
              </div>
              <div className="col-8">
                {" "}
                <input className="form-control" />
              </div>
            </div>
            <br />
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <div style={{ textAlign: "center" }}>
        <button type="button" class="btn btn-primary" onClick={onGenerateCertificate}>
          Generate Certificate
        </button>
      </div>
    </div>
    <br />
    {LoadCertificate ? <Frame /> : ""}
    </div>
  );
};
export default Static;
