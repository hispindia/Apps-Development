import React, {useEffect, useState  } from 'react';
import './App.css';

import print from "./image/print.png";
import logo from "./image/logo.png";
import QRCode from "react-qr-code";
import Loader from "react-loader-spinner";
import { ApiService } from "./services/apiService";

const onPrintCertificate = (el) => {
  var restorepage = document.body.innerHTML;
  var printcontent = document.getElementById(el).innerHTML;
  document.body.innerHTML = printcontent;
  window.print();
  document.body.innerHTML = restorepage;
}

function App() {
  const [istrue, setIsTrue] = useState(true)
  const [attr, setAttr] = useState({});
  const [optionSetValues, setOptionSetValues] = useState({});
  const [events, setEvents] = useState([]);
  const [teiExist, setTeiExist] = useState(false);
  const [loader, setLoader] = useState(true);
  const nationalId = window.location.href.split('?')[1];

  useEffect( async () =>{    
    if(istrue && nationalId) {
      let teiId = '';
        setIsTrue(false);
        await ApiService.getCovacVaccineNames().then(res => {
          var covacVaccineNames = {}
          res.options.forEach(option => covacVaccineNames[option.code] = option.name);
          setOptionSetValues(covacVaccineNames);
        })
        await ApiService.getCovacDose().then(res => {
          var covacDose = {}
          res.options.forEach(option => covacDose[option.code] = option.name);
          setOptionSetValues(prevState=> ({...prevState,...covacDose}));
        })
          await ApiService.getTEI().then((TEIList) => {
            for (let tei of TEIList.trackedEntityInstances) {
              for (let attr of tei.attributes) {
                if ((attr.attribute == "KSr2yTdu1AI" || attr.attribute == "Ewi7FUfcHAD")  && attr.value == nationalId) {
                let attr = {};
                teiId = tei.trackedEntityInstance
                tei.attributes.forEach((atr) => {
                  attr[atr.attribute] = atr.value;
                });
                setAttr(attr);
                break;
                }
              }
            }
          });
          if(teiId) {
            setLoader(false)
            setTeiExist(true)
            await ApiService.getEvents(teiId).then((res) => {
              var events = [];
              res.events.reverse().map((element) => {
                let obj = {};
                if(element.eventDate) obj["eventDate"] = element.eventDate.split("T")["0"];
                if(element.orgUnitName) obj["orgUnitName"] = element.orgUnitName;
                element.dataValues.map((val) => {
                  obj[val.dataElement] = val.value;
                });
                events.push(obj);
              });
              setEvents(events);
              setLoader(false);
            });
          } else {
            setTeiExist(false);
            setLoader(false); 
          }
    }  
  }) 
  if(loader) return <Loader
                      type="ThreeDots"
                      color="#00BFFF"
                      height={50}
                      width={"100%"}
                    />
  return <>
    { !teiExist ? 
    <h2>No Certificate Found</h2>
    :
    <div style={{ textAlign: "left", marginLeft: "10px" }}>
      <img
        src={print}
        style={{ height: "40px", float: "right" }}
        className="btn btn-primary"
        onClick={() => onPrintCertificate("printData")}
      />
      <br />
      <br />
      <div className="container" id="printData">
        <div className="frame">
          <div className="innerFrame">
          <div style={{padding: "10px"}}>
             <div style={{width:"50%",float:"left",textAlign:"right"}}>وزارة الصحة العامة والسكان<br/>Ministry of Public Health Population</div>
            <div style={{width:"50%",float:"left",textAlign:"left"}}><img src={logo} style={{height: "55px"}}/></div>
         </div>    
         <div style={{clear:"both"}}></div>
            <div className="grid-container">
              <div className="item3">
                <div>
                  <strong>
                    <hr />{" "}
                  </strong>
                </div>
              </div>
              <div className="item4">
                <div style={{ textAlign: "center" }}>
                  <strong>
                    شهادة تطعيم كوفيد١٩
                    <br />
                    COVID-19 Vaccination Certification
                  </strong>
                </div>
              </div>
              <div className="item5">
                <div>
                  <strong>
                    <hr />
                  </strong>
                </div>
              </div>
            </div>
            <div className="grid-container">
              <div>
                <table style={{ width: "90%" }}>
                  <tbody>
                  <tr>
                    <td>
                      <strong>National Number : </strong>
                    </td>
                    <td>{attr.Ewi7FUfcHAD}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Name : </strong>
                    </td>
                    <td>{attr.TfdH5KvFmMy} {attr.aW66s2QSosT}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Date of Birth : </strong>
                    </td>
                    <td>{attr.mAWcalQYYyk}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Reference No. :</strong>
                    </td>
                    <td></td>
                  </tr>
                  </tbody>                  
                </table>
              </div>
              <div style={{ textAlign: "center" }}>
                <div>
                  <QRCode
                    value={`http://172.104.57.34:3000?${attr.Ewi7FUfcHAD}`}
                    size={120}
                  />
                </div>
              </div>
              <div>
                <table
                  style={{ width: "90%", textAlign: "right", float: "right" }}
                >
                  <tbody>
                  <tr>
                    <td>{attr.Ewi7FUfcHAD}</td>
                    <td>
                      <strong>:الرقم الوطني</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{attr.TfdH5KvFmMy} {attr.aW66s2QSosT}</td>
                    <td>
                      <strong>:الاسم</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{attr.mAWcalQYYyk}</td>
                    <td>
                      <strong>:تاريخ الميلاد</strong>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <strong>: الرمز المرجعي</strong>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <table
                className="event-table"
                style={{ width: "95%", margin: "5px auto" }}
              >
                <thead>
                  <tr>
                    <td>
                    المركز
                    <br />
                    Center</td>
                    <td>التاريخ
                    <br />
                    Date</td>
                    
                    <td>
                    رقم التشغيلة
                    <br />
                    Lot Number</td>
                    <td>
                    المطعم
                    <br />
                    Vaccine
                    </td>
                    <td>
                    الجرعة
                    <br />
                    Dose
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {events.map((element, index) => (
                    <tr key={index}>
                      <td>{element.orgUnitName}</td>
                      <td>{element.eventDate}</td>
                      <td>{element.Yp1F4txx8tm}</td>
                      <td>{(optionSetValues[element.bbnyNYD1wgS] ? optionSetValues[element.bbnyNYD1wgS] : "")}</td>
                      <td>{(optionSetValues[element.LUIsbsm3okG] ? optionSetValues[element.LUIsbsm3okG] : "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
                  };
    </>
}

export default App;
