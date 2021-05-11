import React from "react";
import logo from '../image/logo.png'
import print from '../image/print.png'
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";

const Frame = () => {
  const eventList = useSelector(state => state.data.eventList)
  const attributes = useSelector(state => state.data.attributes)
  console.log('e',eventList, attributes)
  var ev = []
  var attr = {} 
  eventList.map( element =>{
      let obj ={}
      obj["eventDate"]=element.eventDate.split("T")["0"]
      obj["orgUnitName"]=element.orgUnitName 
      element.dataValues.map(val =>{
      obj[val.dataElement]=val.value 
      })
     ev.push(obj)
  })
  console.log('eee', ev)
  attributes.forEach(atr => {
      attr[atr.attribute]= atr.value
  });
    const onPrintCertificate =(el)=>{
    }

  return (
      <div style={{textAlign: "left", marginLeft: "10px"}}>
      <img src={print} style={{height:"40px", float: "right"}} class="btn btn-primary" onClick={onPrintCertificate("printData")} />
      <br />
      <br />
    <div class="container">
    <div class="frame" id="printData">
        <div class="innerFrame">
            <div style={{textAlign: "center", padding:"10px" }}>
            Ministry of Public Health  Population
            <img src={logo} style={{height:"55px"}} />
        </div>
            <div class="grid-container">
                <div class="item3">
                    <div><strong><hr /> </strong></div>
                </div>
                <div class="item4">
                    <div style={{textAlign: "center"}}><strong>COVID-19 Vaccination Certification</strong></div>
                </div>
                <div class="item5">
                    <div><strong><hr /></strong></div> 
                </div>
            </div>
            <div class="grid-container">
                <div class="item3">
                    <div><strong>Number : </strong>{attr.Ewi7FUfcHAD}</div>
                    <div><strong>Name : </strong> {attr.TfdH5KvFmMy} {attr.aW66s2QSosT}</div>
                    <div><strong>Date of Birth : </strong>{attr.mAWcalQYYyk}</div>
                    <div><strong>Reference No. : </strong>123456</div>  
                </div>
                <div class="item4">
                    <div>
                    <QRCode 
                    value="https://li1637-34.members.linode.com/epi/" 
                    size={100}
                    /></div>
                </div>
                <div class="item5">
                    <div><strong>{attr.Ewi7FUfcHAD} <span style={{textAlign: "right"}}></span>: </strong></div>
                    <div><strong>{attr.TfdH5KvFmMy} {attr.aW66s2QSosT} :</strong></div>
                    <div><strong>{attr.mAWcalQYYyk}:</strong></div>
                    <div><strong>123456:</strong> </div> 
                </div>
            </div>
            <div class="grid-container">
                <table>
                    <thead style={{textAlign: "center"}}>
                        <th>Center</th>
                        <th>Date</th>
                        <th>Lot Number</th>
                        <th>Vaccine</th>
                        <th>Dose</th>
                    </thead>
                    <tbody style={{textAlign: "center"}}>
                        {ev.map(element =>(<tr>
                            <td>{element.orgUnitName}</td>
                            <td>{element.eventDate}</td>
                            <td>{element.Yp1F4txx8tm}</td>
                            <td>{element.bbnyNYD1wgS}</td>
                            <td>{element.LUIsbsm3okG}</td>
                        </tr>))}
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
