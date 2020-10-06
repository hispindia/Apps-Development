import React, { PureComponent } from "react";
import axios from "axios";
import DynamicComponent from "../dynamicComponent/dynamicComponent";
import { OrgUnitTree } from "@hisp-amr/org-unit-tree";
import { useDataQuery } from "@dhis2/app-runtime";
const onError = (error) => console.error(error);
class HomeComponet extends React.Component {
  constructor() {
    super();
    this.state = {
      orgUnit: "",
      programCount: {}
    };
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(selected) {
    this.setState({ orgUnit: selected });
  }

  getEvents() {
    var events = [];
    return axios
      .get(
        `../../../api/events.json?orgUnit=ANGhR1pa8I5&ouMode=DESCENDANTS&startDate=2020-01-01&endDate=2020-09-30&paging=false&order=eventDate:des`
      )
      .then(resp => {
        resp.data.events.forEach(event => {
          var eventData = {};
          var dataElement = {}
          var dataValue = {};

          eventData.eventDate = event["eventDate"].split("T")["0"];
          eventData.orgUnit = event["orgUnit"];
          eventData.program = event["program"];
          event.dataValues.forEach(dataValue => dataElement[dataValue.dataElement] = dataValue.value);

          if(dataElement["SaQe2REkGVw"]) dataValue["deCode"] = dataElement["SaQe2REkGVw"];
          if(dataElement["mp5MeJ2dFQz"] && dataElement["B7XuDaXPv10"]) dataValue["COC"] = `${dataElement["mp5MeJ2dFQz"]}, ${dataElement["B7XuDaXPv10"]}`;
          // for (const dataValEle in arrayItem["dataValues"]) {
          //   // SaQe2REkGVw, tQa6uU1t6s3, mp5MeJ2dFQz
          //   if(dataElementsValue.dataElement == "SaQe2REkGVw") dataElementsValue[]
          //   var dataElementsValue = {};
          //   var dataElement = arrayItem["dataValues"][dataValEle]["dataElement"];
          //   var dataValues = arrayItem["dataValues"][dataValEle]["value"];
          //   dataElementsValue[dataElement] = dataValues;
          //   dataValueList.push(dataElementsValue);
          // }
          eventData.dataValues = dataValue;
          events.push(eventData);
        });
        return events;
        // export default allEvents;
      });
  }

  // getPrograms() {
  //   axios
  //     .get(`../../../api/programs.json?paging=false&fielda=id,name`)
  //     .then((response) => {
  //       console.log("PROGRAMMS " + JSON.stringify(response.data));
  //     });
  // }

  async getResult() {
    var events = await this.getEvents();    
    console.log("events", events)
    var programCount = {};    
    var dECOC = {};
    // var dataElementsEvent = [];
    // result = JSON.parse(result);
    if (events.length) {
    //   result.forEach(function (arrayItem, index) {
    //     // Promise.all(arrayItem["Elements"]).then(function () {
    //     //   dataElementsEvent.push(arrayItem["Elements"]);
    //     // });

    //     for (const a in arrayItem["Elements"]) {
    //       dataElementsEvent.push(String(Object.keys(arrayItem["Elements"][a])));
    //     }
    //   });

      axios
        .get(`../../../api/29/sqlViews/GGhupAYbdg2/data.json?paging=false`)
        .then((resp) => {
          // console.log("RESPONSE FROM API " + resp);
          // var dataToBePushed = {};
          resp.data.listGrid.rows.forEach( row => {
            if(row["0"]) dECOC[row["0"]] = row["2"];
            if(row["7"]) dECOC[row["7"]] = row["6"];
            // var countOfDataElement = 0;
            // var dataElementUID = arrayItem[2];
            // var dataSetElements = arrayItem[7];
            // var keyToBeStored = dataElementUID + "-" + dataSetElements + "-" + "val";
            // if (dataToBePushed.hasOwnProperty(keyToBeStored)) {
            //   dataToBePushed[keyToBeStored] = dataToBePushed[keyToBeStored] + 1;
            // } else {
            //   dataToBePushed[keyToBeStored] = countOfDataElement + 1;
            // }

            // console.log(
            //   "DATA to be PUSHED IN DATA ENTRY " +
            //     JSON.stringify(dataToBePushed)
            // );
          });

          events.forEach(event => {
            if(dECOC[event.dataValues.deCode] && dECOC[event.dataValues.COC]) {
              if(!programCount[event.program]) programCount[event.program] = {};
              if(!programCount[event.program][`${dECOC[event.dataValues.deCode]}-${dECOC[event.dataValues.COC]}`]) programCount[event.program][`${dECOC[event.dataValues.deCode]}-${dECOC[event.dataValues.COC]}`] = 0;
              programCount[event.program][`${dECOC[event.dataValues.deCode]}-${dECOC[event.dataValues.COC]}`] += 1;
            }
          })  
          console.log("program count", programCount)
          this.setState({programCount: programCount})

        });
    }
    // return dataElementsEvent;
  }

  getTrackerData() {
    // var eventsData = this.getResult();
    // var dataValue = [];
    // console.log("Before Call");

    // axios
    //   .get(`../../../api/29/sqlViews/Iue75rEGLD9/data.json?paging=false`)
    //   .then((resp) => {
    //     console.log(resp);
    //   });

    // axios
    //   .get(
    //     `https://ln2.hispindia.org/amr/api/sqlViews/Nt5LQ2Gpvsc/data.json?paging=false`
    //   )
    //   .then((resp) => {
    //     console.log(resp);
    //   });

  }

  componentDidMount() {
    // this.getTrackerData();
    this.getResult();
    // this.getPrograms();
  }
  render() {
    return (
      <>
        <div className="row">
          <div className="col-lg-auto col-md-auto col-sm-auto col-xs-auto shadow-lg bg-white rounded">
            <OrgUnitTree onSelect={this.onSelect} onError={onError} />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
            <DynamicComponent data={this.state.orgUnit} />
          </div>
        </div>
      </>
    );
  }
}
export default HomeComponet;
