import React from "react";
import logo from "../image/logo.png";
import print from "../image/print.png";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

const onPrintCertificate = (el) => {
  var printcontent = document.getElementById(el).innerHTML;
  document.body.innerHTML = printcontent;
  window.print();
  window.location.reload();
};

const Frame = () => {
  const eventList = useSelector((state) => state.data.eventList);
  const attributes = useSelector((state) => state.data.attributes);
  console.log("e", eventList, attributes);
  var ev = [];
  var attr = {};
  eventList.map((element) => {
    let obj = {};
    if(element.eventDate) obj["eventDate"] = element.eventDate.split("T")["0"];
    if(element.orgUnitName) obj["orgUnitName"] = element.orgUnitName;
    element.dataValues.map((val) => {
      obj[val.dataElement] = val.value;
    });
    ev.push(obj);
  });
  attributes.forEach((atr) => {
    attr[atr.attribute] = atr.value;
  });

  return (
    <div style={{ textAlign: "left", marginLeft: "10px" }}>
      <img
        src={print}
        style={{ height: "40px", float: "right" }}
        class="btn btn-primary"
        onClick={() => onPrintCertificate("printData")}
      />
      <br />
      <br />
      <div class="container" id="printData">
        <div class="frame">
          <div class="innerFrame">
          <div style={{padding: "10px"}}>
             <div style={{width:"50%",float:"left",textAlign:"right"}}>وزارة الصحة العامة والسكان<br/>Ministry of Public Health Population</div>
            <div style={{width:"50%",float:"left",textAlign:"left"}}><img src="./static/media/logo.cdb36493.png" style={{height: "55px"}}/></div>
         </div>   
         <div stylel={{clear:"both"}}></div> 
            <div class="grid-container">
              <div class="item3">
                <div>
                  <strong>
                    <hr />{" "}
                  </strong>
                </div>
              </div>
              <div class="item4">
                <div style={{ textAlign: "center" }}>
                  <strong>
                    شهادة تطعيم كوفيد١٩
                    <br />
                    COVID-19 Vaccination Certification
                  </strong>
                </div>
              </div>
              <div class="item5">
                <div>
                  <strong>
                    <hr />
                  </strong>
                </div>
              </div>
            </div>
            <div class="grid-container">
              <div>
                <table style={{ width: "90%" }}>
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
                </table>
              </div>
            </div>
            <div>
              <table
                className="event-table"
                style={{ width: "95%", margin: "5px auto" }}
              >
                <thead>
                  <th>
                    المركز
                    <br />
                    Center
                  </th>
                  <th>
                    التاريخ
                    <br />
                    Date
                  </th>
                  <th>
                    رقم التشغيلة
                    <br />
                    Lot Number
                  </th>
                  <th>
                    المطعم
                    <br />
                    Vaccine
                  </th>
                  <th>
                    الجرعة
                    <br />
                    Dose
                  </th>
                </thead>
                <tbody>
                  {ev.map((element) => (
                    <tr>
                      <td>{element.orgUnitName}</td>
                      <td>{element.eventDate}</td>
                      <td>{element.Yp1F4txx8tm}</td>
                      <td>{element.bbnyNYD1wgS}</td>
                      <td>{element.LUIsbsm3okG}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame;
