import React, { useEffect, useState } from "react";
import Frame from "./Frame";
import { useDispatch, useSelector } from "react-redux";
import { ApiService } from "../services/apiService";
import { setTEIs, setEvents, setAttribute } from "../redux/action/event";
const Static = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [idType, setIdType] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [LoadCertificate, setLoadCertificate] = useState(false);
  const TEIList = useSelector((state) => state.data.TEIList);
  const isValidID = useSelector((state) => state.data.isValidID);
  const handleIdType = (e) => {
    setIsSelected(true);
    setIdType(e.target.value);
  };
  useEffect(() => {
    ApiService.getTEI().then((res) => {
      dispatch(setTEIs(res.trackedEntityInstances));
    });
  }, []);

  const onGenerateCertificate = () => {
    var hasValue = true;
    if (!id) {
      alert("Please select an Id!!!");
      return;
    }
    for (let tei of TEIList) {
      for (let atr of tei.attributes) {
        if (atr.value == id) {
          hasValue = false;
          ApiService.getEvents(tei.trackedEntityInstance).then((res) => {
            dispatch(setAttribute(tei.attributes));
            dispatch(setEvents(res.events));
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
        <div class="row">
          <div class="col-4">
            <strong>ID Type :</strong>
          </div>
          <div class="col-8">
            <select className="form-control" onChange={(e) => handleIdType(e)}>
              <option selected hidden>Please Select</option>
              <option>National ID</option>
              <option>System ID</option>
            </select>
          </div>
        </div>
        <br />
        {isSelected ? (
          <div className="row">
            <div className="col-4">
              <strong>{idType} :</strong>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <br/>
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            class="btn btn-primary"
            onClick={onGenerateCertificate}
            disabled={!isSelected}
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
