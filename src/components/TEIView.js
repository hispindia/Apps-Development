import React, { useEffect, useState } from "react";
import Certificate from "./Certificate";
import { useDispatch, useSelector } from "react-redux";
import { ApiService } from "../services";
import {
  setCOVACVaccineNames,
  setCOVACDose,
  setTEIs,
  setEvents,
  setAttribute,
} from "../redux/action/event";
const TEIView = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("");
  const [LoadCertificate, setLoadCertificate] = useState(false);
  const TEIList = useSelector((state) => state.data.TEIList);

  useEffect(() => {
    ApiService.getCovacVaccineNames().then((res) => {
      var covacVaccineNames = {};
      res.options.forEach(
        (option) => (covacVaccineNames[option.code] = option.name)
      );
      dispatch(setCOVACVaccineNames(covacVaccineNames));
    });
    ApiService.getCovacDose().then((res) => {
      var covacDose = {};
      res.options.forEach((option) => (covacDose[option.code] = option.name));
      dispatch(setCOVACDose(covacDose));
    });
  }, []);

  const onGenerateCertificate = () => {
    var hasValue = true;
    if (!value) {
      alert("Please enter !!!");
      return;
    }
    ApiService.getTEI(valueType, value).then((res) => {
      dispatch(setTEIs(res.trackedEntityInstances));
      hasValue = false;
      ApiService.getEvents(res.trackedEntityInstance).then((res) => {
        dispatch(setAttribute(tei.attributes));
        dispatch(setEvents(res.events.reverse()));
      });
    });
    if (hasValue) {
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
            <strong> Select :</strong>
          </div>
          <div className="col-7">
            <select
              className="form-control"
              onChange={(e) => setValueType(e.target.value)}
            >
              <option selected hidden>
                Select ID...
              </option>
              <option value="national-identity">National Identity</option>
              <option value="system-identity">System Identity</option>
              <option value="phone-number">Phone Number</option>
            </select>
          </div>
        </div>
        { valueType && <div className="row">
          <div className="col-5">
            <strong>Enter {valueType.split("-").join(" ")}</strong>
          </div>
          <div className="col-7">
            <input
              className="form-control"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>}
        <br />
        {value && (
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={onGenerateCertificate}
            >
              Generate Certificate
            </button>
          </div>
        )}
      </div>
      <br />
      {LoadCertificate ? <Certificate /> : ""}
    </>
  );
};
export default TEIView;
