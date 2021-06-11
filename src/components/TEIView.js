import React, { useEffect, useState } from "react";
import Certificate from "./Certificate";
import { useDispatch } from "react-redux";
import { ApiService } from "../services";
import {
  setCOVACVaccineNames,
  setCOVACDose,
  setTEIs,
  setEvents,
  setAttribute,
} from "../redux/action/event";
import Loader from "react-loader-spinner";

const TEIView = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("");
  const [loader, setLoader] = useState(false);
  const [LoadCertificate, setLoadCertificate] = useState(false);

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
    setLoader(true);

    if (!value) {
      alert("Please enter !!!");
      setLoader(false);
      return;
    }

    ApiService.getTEI(valueType, value)
      .then((attrRes) => {
        if (!attrRes.trackedEntityInstances.length) {
          alert("Invalid Id !!!");
          setLoader(false);
          return;
        }
        dispatch(setTEIs(attrRes.trackedEntityInstances));
        hasValue = false;
        ApiService.getEvents(
          attrRes.trackedEntityInstances["0"].trackedEntityInstance
        ).then((res) => {
          dispatch(
            setAttribute(attrRes.trackedEntityInstances["0"].attributes)
          );
          dispatch(setEvents(res.events));
          setLoadCertificate(true);
          setLoader(false);
        });
      })
      .catch((err) => {
        setLoader(false);
        alert("Error while loading !");
      });
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
              onChange={(e) => {
                setValueType(e.target.value);
                setLoadCertificate(false);
              }}
            >
              <option selected hidden>
                Select ID...
              </option>
              <option value="national-id">National ID</option>
              <option value="phone-number">Phone Number</option>
              <option value="UID-EPI">UID EPI</option>
            </select>
          </div>
        </div>
        <br />
        {valueType && (
          <div className="row">
            <div className="col-5">
              <strong>Enter {valueType.split("-").join(" ")} : </strong>
            </div>

            <div className="col-7">
              <input
                className="form-control"
                onChange={(e) => {
                  setValue(e.target.value);
                  setLoadCertificate(false);
                }}
              />
            </div>
          </div>
        )}
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
      {loader && (
        <Loader type="ThreeDots" color="#00BFFF" height={50} width={"100%"} />
      )}

      {LoadCertificate && <Certificate />}
    </>
  );
};
export default TEIView;
