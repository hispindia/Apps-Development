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
            <a
              className="link1"
              href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/PeiaxeKvmVd"
              target="_blank"
            >
              <div class="flip-card ">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <h6 className="text-center p-3 bold">NPCB - 1</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo.png"}
                      width="190px"
                      height="220px"
                    />
                  </div>
                  <div class="flip-card-back">
                    <h6 className="text-center p-2 bold">NPCB - 1</h6>
                    <ol className="m-1">
                      <li className="bold">Screening of children</li>
                      <li className="bold">
                        Identification of refractive errors
                      </li>
                      <li className="bold">Spectacle distribution</li>
                    </ol>
                  </div>
                </div>
              </div>
            </a>
            {/* <div className="col card1 shadow-lg  p-2 mb-5"> */}
            <a
              className="link"
              href="http://172.104.45.148/mh/api/apps/a1c43aa3-510a-49f4-9eb1-c73ba6a54efc/index.html#/dashboards/Pqtv894NZ7P"
              target="_blank"
            >
              <div class="flip-card">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <h6 className="text-center p-3 bold"> NPCB - 2</h6>
                    <img
                      src={process.env.PUBLIC_URL + "/logo.png"}
                      width="190px"
                      height="220px"
                    />
                  </div>
                  <div class="flip-card-back">
                    <h6 className="text-center p-2 bold"> NPCB - 2</h6>
                    <ol className="m-1">
                      <li className="bold">Cataract Surgeries</li>
                      <li className="bold">Eyeball collection</li>
                      <li className="bold"> Keratoplasty surgeries</li>
                    </ol>
                  </div>
                </div>
              </div>
            </a>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
          </div>
          <div className="row">
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front"></div>
                <div class="flip-card-back"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyApp;
