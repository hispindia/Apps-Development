import React from "react";
import logo from '../image/logo.png'
import print from '../image/print.png'
import QRCode from "react-qr-code";
const Frame = () => {
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
                    <div><strong>Number </strong><span>: 9348833</span></div>
                    <div><strong>Name </strong><span>: ABC</span></div>
                    <div><strong>Date of Birth </strong><span>: 05/11/1990</span></div>
                    <div><strong>Reference No.</strong><span>: 07JW</span></div>  
                </div>
                <div class="item4">
                    <div>
                    <QRCode 
                    value="https://li1637-34.members.linode.com/epi/" 
                    size={100}
                    /></div>
                </div>
                <div class="item5">
                    <div><strong>59484484 <span style={{textAlign: "right"}}></span>: </strong></div>
                    <div><strong>ABC :</strong></div>
                    <div><strong>05/11/1990 :</strong></div>
                    <div><strong>07JW :</strong> </div> 
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
                        <tr>
                            <td>ABC</td>
                            <td>01/11/2020</td>
                            <td>EL00012</td>
                            <td>Pfizer-BionTech</td>
                            <td>1</td>
                        </tr>
                        <tr>
                            <td>XYZ</td>
                            <td>03/10/2020</td>
                            <td>EL00045</td>
                            <td>Pfizer-BionTech</td>
                            <td>2</td>
                        </tr>
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
