import React, { useState, useEffect } from "react";
import ImportedList from "./ImportedList";
import { ApiService } from "../../services/api";
import { setDataElements, setSortedDE } from "../../shared/utils";

export default function Import() {
  const [file, setFile] = useState("");
  const [sample, setSample] = useState("YRSdePjzzfs-fVVUM6blNja");
  const [loader, setLoader] = useState(false);
  const [array, setArray] = useState([]);
  const [passedList, setPassedList] = useState([]);

  const fileReader = new FileReader();

  const handleChange = (ev) => {
    setFile(ev.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i) => {
      const values = i.split(",");
      return values;
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    setPassedList([]);

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };

  useEffect(() => {
    (async () => {
      var list = [];
      for (let tei of array) {
        if (tei[2]) {
          let rawData = setDataElements(tei, sample);
          let teiEventVal = await ApiService.getEventValues(rawData);
          let sortedEvents = setSortedDE(teiEventVal, rawData);
          let teiResponse = await ApiService.pushTEIEvent(sortedEvents);
          if (teiResponse.httpStatus == "OK") {
            tei["status"] = "table-success";
            list.push(tei);
          } else {
            tei["status"] = "table-danger";
            list.push(tei);
          }
          setPassedList(list);
        }
      }
      setLoader(false);
    })();
  }, [array]);

  return (
    <div className="container">
      <form>
        <div class="form-row">
          <div className="form-group col">
            <label className="control-label" for="sample-collection">
              Sample Space
            </label>
            <select
              class="form-control"
              id="sample-collection"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
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
        <div class="form-row">
          <div class="col">
            <input
              type="file"
              accept=".csv"
              className="btn btn-lg px-0 py-3"
              onChange={handleChange}
            />
          </div>
        </div>
        <div class="form-row">
          <div class="col">
            <button
              className="btn btn-primary"
              disabled={file ? false : true}
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              {" "}
              {loader ? (
                <>
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                  ></span>{" "}
                  Loading...
                </>
              ) : (
                <>Import CSV</>
              )}
            </button>
          </div>
        </div>
      </form>
      <div className="container m-0 pt-5">
        {Boolean(passedList.length) && (
          <div id="output">
            <ImportedList passedList={passedList} sample={sample} />
          </div>
        )}
      </div>
    </div>
  );
}
