import React, { useState, useEffect } from "react";
import ExportList from "./ExportList";
import { ApiService } from "../../services/api";
import { downloadCSV } from "../../shared/csv";
import { filterAttrEvents } from "../../shared/utils";

import "./style.css";

export default function Export() {
  const [userOU, setuserOU] = useState("");
  const [vlList, setvlList] = useState([]);
  const [teiList, setTEIList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sample, setSample] = useState("YRSdePjzzfs-fVVUM6blNja");
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    ApiService.getUserOU().then((data) => {
      if (data.organisationUnits) setuserOU(data.organisationUnits[0].id);
    });
  }, []);

  useEffect(() => {
    debugger;
    (async () => {
      var totalTEI = [];
      for (let teiId of vlList) {
        let teiResponse = await ApiService.getTEI(teiId);
        let teiEventArr = filterAttrEvents(
          teiResponse,
          startDate,
          endDate,
          sample
        );
        totalTEI = [...teiEventArr, ...totalTEI];
        setCount((count) => count + 1);
      }
      debugger;
      setTEIList(totalTEI);
      setLoader(false);
    })();
  }, [vlList]);

  const getViralLoad = () => {
    setLoader(true);
    setTEIList([]);
    setCount(0);
    debugger;
    let sampleId = sample.split("-")[1];
    let stageId = sample.split("-")[0];
    var details = {
      orgUnitId: userOU,
      deId: sampleId,
      stageId: stageId,
      startDate: startDate,
      endDate: endDate,
    };

    ApiService.getViralLoadList(details).then((data) => {
      debugger;
      var hasTei = {};
      var teis = [];

      data.listGrid.rows.forEach((tei) => {
        if (!hasTei[tei[0]]) {
          hasTei[tei[0]] = true;
          teis.push(tei[0]);
        }
      });
      setvlList(teis);
    });
  };

  return (
    <div className="container">
      <h1>Sample Collection </h1>
      <div className="row my-4">
        <div className="form-group col">
          <label className="control-label" for="start-date">
            Start Date
          </label>
          <input
            className="form-control"
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group col">
          <label className="control-label" for="end-date">
            End Date
          </label>
          <input
            className="form-control"
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="row my-4">
        <div className="form-group col">
          <label className="control-label" for="sample-collection">
            Sample Space
          </label>
          <select
            class="form-control"
            id="sample-collection"
            value={sample}
            onChange={(e) => {
              setSample(e.target.value);
              setTEIList([]);
              setCount(0);
            }}
          >
            <option value="YRSdePjzzfs-fVVUM6blNja">
              Case assessment-Lab tests
            </option>
            <option value="YRSdePjzzfs-URSqGzzlYoM">
              HIV/HCV Treatment Card
            </option>
            <option value="DgAKrnlkpHc-h7UjZ5YiX0D">
              EID and Treatment Details
            </option>
          </select>
        </div>
      </div>
      <button
        className="btn btn-lg btn-primary"
        disabled={loader ? true : false}
        onClick={getViralLoad}
      >
        {loader ? (
          <>
            <span class="spinner-border spinner-border-sm" role="status"></span>{" "}
            Loading...
          </>
        ) : (
          <>Submit</>
        )}
      </button>

      {Boolean(count) && (
        <p className="text-center text-info">
          {count} out of {vlList.length} Clients Loaded
        </p>
      )}
      {Boolean(teiList.length) && (
        <>
          {sample == "YRSdePjzzfs-fVVUM6blNja" && (
            <h5 className="text-left text-info">
              Note: <br/>
              1) Date Format should be "YYYY-MM-DD"<br/>
              2) VL Suppression status value should be "UnsuppressedViralLoad" / "SuppressedViralLoad" <br/>
              3) Suppressed VL result (undetectable vs detectable) value should be "DetectableViralLoadResult" / "UndetectableViralLoadResult"
            </h5>
          )}
          {sample == "YRSdePjzzfs-URSqGzzlYoM" && (
            <h5 className="text-left text-info">
              Note:<br/>
              1) Date Format should be "YYYY-MM-DD"<br/>
              2) HCV RNA test result Detectable Undetectable value should be "DetectableViralLoadResult" / "UndetectableViralLoadResult" <br/>
              3) Suppressed VL result (undetectable vs detectable) value should be "DetectableViralLoadResult" / "UndetectableViralLoadResult" 
            </h5>
          )}
          <div id="output">
            <div className="my-4 offset-10">
              <button
                className="btn btn-outline-success"
                onClick={() => downloadCSV("viral-load", sample, teiList)}
              >
                <i className="bi bi-filetype-csv"></i> Download
              </button>
            </div>
            <ExportList teiList={teiList} sample={sample} />
          </div>
        </>
      )}
    </div>
  );
}
