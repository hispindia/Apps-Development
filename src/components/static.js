import React, { useEffect, useState } from "react";
import Frame from "./Frame";
import { useDispatch, useSelector } from "react-redux";
import { ApiService } from "../services/apiService";
import { setCOVACVaccineNames, setCOVACDose, setTEIs, setEvents, setAttribute } from "../redux/action/event";
const Static = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [LoadCertificate, setLoadCertificate] = useState(false);
  const TEIList = useSelector((state) => state.data.TEIList);

  useEffect(() => {
    ApiService.getTEI().then((res) => {
      dispatch(setTEIs(res.trackedEntityInstances));
    });
    ApiService.getCovacVaccineNames().then(res => {
      var covacVaccineNames = {}
      res.options.forEach(option => covacVaccineNames[option.code] = option.name);
      dispatch(setCOVACVaccineNames(covacVaccineNames));
    })
    ApiService.getCovacDose().then(res => {
      var covacDose = {}
      res.options.forEach(option => covacDose[option.code] = option.name);
      dispatch(setCOVACDose(covacDose));
    })
  }, []);

  const onGenerateCertificate = () => {
    var hasValue = true;
    if (!id) {
      alert("Please select an Id!!!");
      return;
    }
    for (let tei of TEIList) {
      for (let attr of tei.attributes) {
        if ((attr.attribute == "KSr2yTdu1AI" || attr.attribute == "Ewi7FUfcHAD")  && attr.value == id) {
          hasValue = false;
          ApiService.getEvents(tei.trackedEntityInstance).then((res) => {
            dispatch(setAttribute(tei.attributes));
            dispatch(setEvents(res.events.reverse()));
          });
        }
      }
    }
    if(hasValue)  {
      alert("Invalid Id !!!");
      return;
    }
    setLoadCertificate(true);        
  };
  return (
    <>
      <div className="box">
        <div className="row">
            <div className="col-5">
              <strong>Enter System Id / National Id:</strong>
            </div>
            <div className="col-7">
              <input
                className="form-control"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>
        <br/>
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            class="btn btn-primary"
            onClick={onGenerateCertificate}
          >
            Generate Certificate
          </button>
        </div>
      </div>
      <br />
      {LoadCertificate ? <Frame /> : ""}
    </>
  );
};
export default Static;
