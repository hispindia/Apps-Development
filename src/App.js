import React from "react";
import "./App.css";
import i18n from "@dhis2/d2-i18n";
import "bootstrap/dist/css/bootstrap.css";
import { Grid } from "@material-ui/core";

const MyApp = () => {
  return (
    <>
      <div>
        <Grid item xs={12} className="text-center m-2">
          <h3>
            <u>Integrated Public Health Dashboard: Maharashtra</u>
          </h3>
        </Grid>
        <br />

        <div className="container">
          <div className="row">
          
              <div class="flip-card ">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <h6 className="text-center p-3 bold">NPCB1</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo.png"}
                      width="190px"
                      height="220px"
                    />
                  </div>
                  <div class="flip-card-back">
                    <h6 className="text-center p-2 bold">NPCB1</h6>
                    <ol className="m-1">
                      <a
                        className="link1"
                        href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/PeiaxeKvmVd"
                        target="_blank"
                      >
                      <li className="bold">Screening of children</li>
                      </a>
                      <a
                        className="link1"
                        href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/jltq3ohosJ1"
                        target="_blank"
                      >
                      <li className="bold">
                        Identification of refractive errors
                      </li>
                    </a>

                      <a
                        className="link1"
                        href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/NC4l3hcTd3I"
                        target="_blank"
                      >
                      <li className="bold">Spectacle distribution</li>
                    </a>

                    </ol>
                  </div>
                </div>
              </div>
            {/* <div className="col card1 shadow-lg  p-2 mb-5"> */}
          
              <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <h6 className="text-center p-3 bold"> NPCB2</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo.png"}
                      width="190px"
                      height="220px"
                    />
                  </div>
                  <div class="flip-card-back">
                    <h6 className="text-center p-2 bold"> NPCB2</h6>
                    <ol className="m-1">
                    <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Pqtv894NZ7P"
                      target="_blank"
                    >
                      <li className="bold">Cataract Surgeries</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/zly6E8JBW3M"
                      target="_blank"
                    >
                      <li className="bold">Eyeball collection</li>
                   </a>
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/VIpf21mKYq2"
                      target="_blank"
                    >

                      <li className="bold"> Keratoplasty surgeries</li>
                   </a>

                    </ol>

                  </div>
                </div>
              </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">HWC</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo1.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">HWC</h6>
                    <ol className="m-1">
                    <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/ItbF6kQLUJN"
                      target="_blank"
                    >
                      <li className="bold">HWC PHC operationalization</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/szhXujlm9Ck"
                      target="_blank"
                    >
                      <li className="bold">HWC SC operationalization</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/gQu0R5Rilmt"
                      target="_blank"
                    >
                      <li className="bold">HWC UPHC operationalization</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/SW8v2w0BDcb"
                      target="_blank"
                    >
                      <li className="bold">HWC Financial expenditure</li>
                   </a> 
                   </ol>


                </div>
              </div>
            </div>

            {/* 1 */}
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NTEP1</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo2.png"}
                      width="190px"
                      height="220px"
                    />

                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NTEP1</h6>
                  <ol>
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/ihvjHAPA5KQ"
                      target="_blank"
                    >
                      <li className="bold">Case notification </li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/xByIoIZgSg9"
                      target="_blank"
                    >
                      <li className="bold">UDST and HIV testing </li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/uSsw7pbNKYp"
                      target="_blank"
                    >
                      <li className="bold">MDR TB treatment </li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NTEP2</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo2.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NTEP2</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/mFGgGkSxX4G"
                      target="_blank"
                    >
                      <li className="bold">DBT payment (NPY) </li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/sHeTOahSwq3"
                      target="_blank"
                    >
                      <li className="bold">Diabetes and chemoprophylaxis (&lt;6yo)</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/f6MVvtW1kY7"
                      target="_blank"
                    >
                      <li className="bold">Treatment success rate</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NLEP</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo3.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NLEP</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/u0F1AxsCz6M"
                      target="_blank"
                    >
                      <li className="bold">Annual new case detection rate</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/lK2IpMTL0ai"
                      target="_blank"
                    >
                      <li className="bold">MB case incidence</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/MUbySo2UUZm"
                      target="_blank"
                    >
                      <li className="bold">Grade 2 disability incidence</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/SRrrh4OXvI8"
                      target="_blank"
                    >
                      <li className="bold">Childhood leprosy</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">RCH</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo5.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold"></h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/i44KN9He5fI"
                      target="_blank"
                    >
                      <li className="bold">First referral units</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/hgcPxOHQpBq"
                      target="_blank"
                    >
                      <li className="bold">ANC severe anaemia</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/rXXadVyX4Vu"
                      target="_blank"
                    >
                      <li className="bold">Maternal death audits</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/ot2wMZYzoTI"
                      target="_blank"
                    >
                      <li className="bold">Child death reviews</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/I3iJmFClSbm"
                      target="_blank"
                    >
                      <li className="bold">Antenatal care services</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">RBSK</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo6.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">RBSK</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/hkClVbTDt78"
                      target="_blank"
                    >
                      <li className="bold">Child screening</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/eH2vsr9MXPC"
                      target="_blank"
                    >
                      <li className="bold">Surgeries conducted</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/EZOljmK4DJt"
                      target="_blank"
                    >
                      <li className="bold">Newborn screening</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">PMMVY</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo7.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">PMMVY</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/WiBdKnU2KBp"
                      target="_blank"
                    >
                      <li className="bold">Beneficiary enrolment achievement</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/nWKMxipBFuQ"
                      target="_blank"
                    >
                      <li className="bold">Due instalments</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/xndHcc4C3dL"
                      target="_blank"
                    >
                      <li className="bold">Less performing field functionaries</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">LAQSHYA</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo8.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">LAQSHYA</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/sYQVqG6aCeC"
                      target="_blank"
                    >
                      <li className="bold">National-level Certification</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/DQx8jtGZ6cf"
                      target="_blank"
                    >
                      <li className="bold">State-level Certification</li>
                   </a> 
                   
                  </ol>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
        {/* new row */}
        <div className="row">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NQAS</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo9.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NQAS</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/rx8rxAAfOTh"
                      target="_blank"
                    >
                      <li className="bold">Internal assessment</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/OPNMf2Cmvxg"
                      target="_blank"
                    >
                      <li className="bold">State certification</li>
                   </a>  
                     <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/oRVbh95lTCq"
                      target="_blank"
                    >
                      <li className="bold">National certification</li>
                   </a>  
                    
                  </ol>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NCD1</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/NCD1.jpg"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NCD1</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/ZoSvJP4v3YU"
                      target="_blank"
                    >
                      <li className="bold">Hypertension & Diabetes screening</li>
                   </a>  
                     <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/hPvWogrjBmU"
                      target="_blank"
                    >
                      <li className="bold">Hypertension diagnosis and treatment</li>
                   </a> 
                      <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/zARSgvlP327"
                      target="_blank"
                    >
                      <li className="bold">Diabetes diagnosis and treatment</li>
                   </a>   
                    <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Ub0TfWB1syL"
                      target="_blank"
                    >
                      <li className="bold">Tablet entry status</li>
                   </a>  
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">NCD2</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/NCD1.jpg"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">NCD2</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/BReZoPPZI7O"
                      target="_blank"
                    >
                      <li className="bold">Oral Cancer screening</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/PeI4Udmvuip"
                      target="_blank"
                    >
                      <li className="bold">Oral Cancer diagnosis and treatment</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/LkbG4KnNxuE"
                      target="_blank"
                    >
                      <li className="bold">Cervical & Breast cancer screening</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/XCq6fxRlKQ8"
                      target="_blank"
                    >
                      <li className="bold">Cervical & Breast cancer treatment</li>
                   </a>  

                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">DMHP</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo11.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">DMHP</h6>
                  <ol>
                    <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/WuuUvrvYSmq"
                      target="_blank"
                    >
                      <li className="bold">Medical staff training</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/cwfFeKGe7mZ"
                      target="_blank"
                    >
                      <li className="bold">Mental health clinics at PHC</li>
                   </a>  

                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/CI2PQv3VyqZ"
                      target="_blank"
                    >
                      <li className="bold">Mental health clinics at SDH/RH</li>
                   </a>  
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">Specialist services</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo12.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">Specialist services</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/PjceEGfHDbr"
                      target="_blank"
                    >
                      <li className="bold">Anaesthetics</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Djay17kGQdR"
                      target="_blank"
                    >
                      <li className="bold">Gynaecology</li>
                   </a>  

                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/T6Lpe0g9OU9"
                      target="_blank"
                    >
                      <li className="bold">Ophthalmology</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/qW8EeTLlOfk"
                      target="_blank"
                    >
                      <li className="bold">Paediatrics</li>
                   </a>  
                  </ol>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
        {/* new row2 */}
        <div className="row">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">Finance</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo13.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">Finance</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/tIytrSjoz9C"
                      target="_blank"
                    >
                      <li className="bold">Funds available</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/c4X0mMtMfuD"
                      target="_blank"
                    >
                      <li className="bold">Expenditure against funds</li>
                   </a>  
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/yac04gMrNr8"
                      target="_blank"
                    >
                      <li className="bold">Expenditure against PIP</li>
                   </a>  
                  </ol>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">E-Hospital</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/E-Hospital1.jpg"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">E-Hospital</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/pWOj25k7T3D"
                      target="_blank"
                    >
                      <li className="bold">OPD consultation</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/HLBG2WuncDA"
                      target="_blank"
                    >
                      <li className="bold">Lab diagnostic services</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/BkgAU3BSbYO"
                      target="_blank"
                    >
                      <li className="bold">IPD registration</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/TusptuqJdS6"
                      target="_blank"
                    >
                      <li className="bold">Patient Satisfaction</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">ASHA1</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo15.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">ASHA1</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Po3I9q6L8H4"
                      target="_blank"
                    >
                      <li className="bold">Incentive payment</li>
                   </a>
                    <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/zbcULKWNGFm"
                      target="_blank"
                    >
                      <li className="bold">Training</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/g9DGTb2IQIY"
                      target="_blank"
                    >
                      <li className="bold">HBNC kit distribution</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/xz9zWsymROU"
                      target="_blank"
                    >
                      <li className="bold">Performing staff</li>
                   </a> 

                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/d5qVgf3ndx5"
                      target="_blank"
                    >
                      <li className="bold">AADHAR card linking</li>
                   </a> 

                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">ASHA2</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo15.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">ASHA2</h6>
                  <ol>
                  <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/laFNN3O6qaH"
                      target="_blank"
                    >
                      <li className="bold">Performance – ANC and HBNC</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/fh5aGnoHu6Z"
                      target="_blank"
                    >
                      <li className="bold">Performance – IFA supplementation</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/u7wi57LhnBH"
                      target="_blank"
                    >
                      <li className="bold">Performance – Screening of newborns</li>
                   </a> 
                  </ol>
                </div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                <h6 className="text-center p-3 bold">ASHA3</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo15.png"}
                      width="190px"
                      height="220px"
                    />
                </div>
                <div class="flip-card-back">
                <h6 className="text-center p-2 bold">ASHA3</h6>
                  <ol>
                 <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/dNmUGIL2tBt"
                      target="_blank"
                    >
                      <li className="bold">Case identification – Leprosy and TB</li>
                   </a> 
                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Kayya7F2bZJ"
                      target="_blank"
                    >
                      <li className="bold">Case identification – Newborn (&lt;42 days)</li>
                   </a> 

                   <a
                      className="link"
                      href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/iP9JjBfsfaN"
                      target="_blank"
                    >
                      <li className="bold">Referral of SAM cases</li>
                   </a> 
                 
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyApp;
