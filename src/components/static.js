import React, { useEffect, useState } from "react";
import Frame from "./Frame"
import { useDispatch, useSelector } from "react-redux";
import {ApiService} from '../services/apiService'
import {setTEIs, setEvents, setAttribute } from '../redux/action/event'
const Static = () => {
  const dispatch = useDispatch();
  const [Loader, setID] = useState(false);
  const [LoaderNationalId, setNationalID] = useState(false);
  const [LoaderSystemId, setSystemID] = useState(false);
  const [LoadCertificate, generateCertification] = useState(false);
  const [btnStatus, setBtn] = useState(true);
  const TEIList = useSelector(state => state.data.TEIList)
  const isValidID = useSelector(state => state.data.isValidID)
  const selectedId = (event) => {
    if (event.target.value == "National ID") {
      setID(true);
      setNationalID(true);
      setSystemID(false);
      setBtn(false)
    }
    if (event.target.value == "System ID") {
      setID(true);
      setSystemID(true);
      setNationalID(false);
      setBtn(false)
    }
  };
  useEffect(()=>{
    ApiService.getTEI().then( res=>{
      dispatch(setTEIs(res.trackedEntityInstances))
    })
  }, [])

  const onGenerateCertificate = ()=>{
    if(isValidID){
      alert("Invalid Id !!!")
    }else{
      generateCertification(true)
    }
  }
  const onChangeNationalId=(e)=>{
      for( let tei of TEIList){
        for( let atr of tei.attributes){
          if(atr.value == e.target.value){
            ApiService.getEvents(tei.trackedEntityInstance).then(res =>{
              dispatch(setAttribute(tei.attributes))
              dispatch(setEvents(res.events))
            })
          }
        }
      }
  }
  const onChangeSystemId=(e)=>{
    console.log('s',e.target.value)
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
                <input className="form-control" onChange={(e) => onChangeNationalId(e)} />
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
                <input className="form-control" onChange={(e) => onChangeSystemId(e)} />
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
        <button type="button" class="btn btn-primary" onClick={onGenerateCertificate} disabled={btnStatus}>
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
