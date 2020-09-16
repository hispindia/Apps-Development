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
    };
    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(selected) {
    this.setState({ orgUnit: selected });
  }

  getEvents() {
    var dataValue = [];
    axios
      .get(
        `../../../api/events.json?orgUnit=ANGhR1pa8I5&ouMode=DESCENDANTS&startDate=2020-01-01&endDate=2020-04-30&paging=false&order=eventDate:des`
      )
      .then((resp) => {
        resp.data.events.forEach(function (arrayItem, index) {
          var dataSetElements = {};
          var dataValueList = [];
          dataSetElements.eventDate = arrayItem["eventDate"];
          dataSetElements.orgUnit = arrayItem["orgUnit"];
          dataSetElements.program = arrayItem["program"];
          for (const dataValEle in arrayItem["dataValues"]) {
            var dataElementsValue = {};
            var dataElement =
              arrayItem["dataValues"][dataValEle]["dataElement"];
            var dataValues = arrayItem["dataValues"][dataValEle]["value"];
            dataElementsValue[dataElement] = dataValues;
            dataValueList.push(dataElementsValue);
          }
          dataSetElements.Elements = dataValueList;
          dataValue.push(dataSetElements);
        });
        console.log(JSON.stringify(dataValue));
      });
  }

  getPrograms() {
    axios
      .get(`../../../api/programs.json?paging=false&fielda=id,name`)
      .then((response) => {
        console.log("PROGRAMMS " + JSON.stringify(response.data));
      });
  }

  componentDidMount() {
    this.getEvents();
    this.getPrograms();
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
