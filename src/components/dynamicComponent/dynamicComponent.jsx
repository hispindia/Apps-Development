import React, { Component } from "react";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";

class DynamicComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      dECOC: {},
      deAnti: {},
      programCount: {},
      dataJson: {},
      loading: true,
      pushed: false,
      show: false,
      buttonVisible: false,
      imported: 0,
      updated: 0,
      deleted: 0,
      ignored: 0,
      conflicts: 0,
      deCOC_anti:{}
    };
    this.getdECOC = this.getdECOC.bind(this);
    this.postDataValues = this.postDataValues.bind(this);
  }

  getEvents = (orgUnit, startDate, endDate) => {
    var events = [];
    var programCount = {};
    try {
      var dECOC = this.state.dECOC;
      var deAnti = this.state.deAnti;

      var url = `../../../api/events.json?paging=false&orgUnit=${orgUnit}&ouMode=DESCENDANTS`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      return axios.get(url).then((resp) => {
        resp.data.events.forEach((event) => {
          var eventData = {};
          var dataElement = {};
          var dataValue = {};
          if (event["eventDate"]) {
            eventData.eventDate = event["eventDate"].split("T")["0"];
            eventData.orgUnit = event["orgUnit"];
            eventData.program = event["program"];
            event.dataValues.forEach(
              (dataValue) =>
                (dataElement[dataValue.dataElement] = dataValue.value)
            );

            if (dataElement["SaQe2REkGVw"])
              dataValue["deCode"] = dataElement["SaQe2REkGVw"];
            if (dataElement["mp5MeJ2dFQz"] && dataElement["B7XuDaXPv10"])
              dataValue[
                "COC"
              ] = `${dataElement["mp5MeJ2dFQz"]}, ${dataElement["B7XuDaXPv10"]}`;

            for (const antiKeys in dataElement) {
              let antiPresent = antiKeys in deAnti;
              if (antiPresent) {
                var antiValue = deAnti[antiKeys];
                if (antiValue.indexOf(' ') >= 0) {
                    antiValue = antiValue.split(" ")[0]; // Ampicillin_Results
                }
                else {
                    antiValue = antiValue.split("_")[0]; // Ampicillin_Results
                }
                antiValue = antiValue + "-" + dataElement[antiKeys]; // Ampicillin-Resistant
                if (dataElement["SaQe2REkGVw"])
                  dataValue["deCode"] = dataElement["SaQe2REkGVw"]+"_AW";
                if (dataElement["mp5MeJ2dFQz"] && dataElement["B7XuDaXPv10"])
                  dataValue[
                    "COC"
                  ] = `${antiValue}, ${dataElement["mp5MeJ2dFQz"]}, ${dataElement["B7XuDaXPv10"]}`;
                console.log("ANTIBIOTIC DEC COCS: ",dataValue["deCode"], ":", dataValue["COC"]);
              }
            }

            eventData.dataValues = dataValue;
            events.push(eventData);
          }
        });

        if (!events.length) return;
        events.forEach((event) => {
          let eventDate = `${event.eventDate.split("-")["0"]}-${
            event.eventDate.split("-")["1"]
          }`;
          let eventOrgUnit = event.orgUnit;
          let eventDeCode = event.dataValues.deCode;
          let eventCOC = event.dataValues.COC;

          if (
            dECOC[eventDeCode] &&
            dECOC[eventCOC] &&
            eventDate &&
            eventOrgUnit
          ) {
            if (
              !programCount[
                `${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`
              ]
            )
              programCount[
                `${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`
              ] = 0;
            programCount[
              `${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`
            ] += 1;
          }
        });
        console.log(programCount);
        return programCount;
      });
    } catch (e) {
      console.log("Error in getEvents");
    }
  };

  async getAntibio() {
    var deAnti = {};
    try {
      axios
        .get(`../../../api/sqlViews/Td7tyBlEqrT/data.json?paging=false`)
        .then((respanti) => {
          respanti.data.listGrid.rows.forEach((row) => {
            if (row["2"]) deAnti[row["1"]] = row["2"];
          });
          console.log("ANTIBIOTICS: ",deAnti)
          this.setState({ deAnti: deAnti });
        });
    } catch (e) {
      console.log("Error");
      this.setState({ loading: false });
    }
  }

  async getdECOC() {
    var dECOC = {};
    let api_one = "../../../api/29/sqlViews/nExolJ6VsR5/data.json?paging=false"
    let api_two = "../../../api/29/sqlViews/X0cT1wQvk9M/data.json?paging=false"
    let api_three = "../../../api/29/sqlViews/nWUC12EYfQj/data.json?paging=false"
    let api_four = "../../../api/29/sqlViews/rwE9Q42RHfg/data.json?paging=false"
    let requestOne = axios.get(api_one);
    let requestTwo = axios.get(api_two);
    let requestThree = axios.get(api_three);
    let requestFour = axios.get(api_four);
    try {
      axios
        .all([requestOne, requestTwo, requestThree, requestFour])
        .then(axios.spread((...responses) => {
          const responseOne = responses[0]
          const responseTwo = responses[1]
          const responesThree = responses[2]
          const responseFour = responses[3]
          responses.forEach((resp) => {
            resp.data.listGrid.rows.forEach((row) => {
              if (row["0"]) dECOC[row["0"]] = row["2"];
              if (row["7"]) dECOC[row["7"]] = row["6"];
            });
          });
          this.setState({ dECOC: dECOC });
          this.setState({ loading: false });
        })).catch(errors => {
          console.log("Errors", errors)
  // react on errors.
})
    } catch (e) {
      console.log("Error", e);
      this.setState({ loading: false });
    }
  }

  async postDataValues(orgUnit, startDate = "", endDate = "") {
    this.setState({ loading: true });
    try {
      var programCount = await this.getEvents(orgUnit, startDate, endDate);
      var dataValues = [];

      for (let item in programCount) {
        var dataValue = {};
        var itemKey = item.split(":");
        dataValue.orgUnit = itemKey["0"];
        dataValue.period = itemKey["1"].split("-").join("");
        dataValue.dataElement = itemKey["2"].split("-")["0"];
        dataValue.categoryOptionCombo = itemKey["2"].split("-")["1"];
        dataValue.value = programCount[item];
        dataValues.push(dataValue);
      }
      console.log(dataValues);

      // PUSHING DATA IN DATA ENTRY
      var dataValueSet = {};
      dataValueSet.dataValues = dataValues;
      var dataJSON = JSON.stringify(dataValueSet);
      console.log(dataValueSet);
      const headers = {
        "Content-Type": "application/json",
        dataType: "json",
      };
      axios
        .post("../../../api/dataValueSets", dataJSON, { headers: headers })
        .then((response) => {
          console.log(response);
          var impCount = response.data.importCount.imported;
          var upCount = response.data.importCount.updated;
          var igCount = response.data.importCount.ignored;
          var delCount = response.data.importCount.deleted;
          // var conflictsDetails = response.data.conflicts;
          this.setState({
            imported: impCount,
            deleted: delCount,
            updated: upCount,
            ignored: igCount,
            loading: false,
            // conflicts: conflictsDetails,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }

    this.setState({ loading: false });
    this.setState({ pushed: true });
    this.setState({ show: false });
  }

  importData() {
    this.setState({ show: true });
    this.setState({ pushed: false });
    this.setState({ buttonVisible: true });
  }

  componentDidMount() {
    this.getdECOC();
    this.getAntibio();
  }
  handleChange(e, id) {
    this.setState({ [id]: e.target.value });
  }
  render() {
    const { startDate, endDate } = this.state;
    const { imported, updated, deleted, ignored } = this.state;
    if (this.state.loading) {
      return (
        <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
          <h2 className="ml-5">Tracker Aggregation </h2>
          <ReactBootstrap.Spinner animation="border" />
          <br></br>
          <br></br>
          <span class="ml-8">Loading Data ...</span>
        </div>
      );
    } else {
      if (this.state.pushed) {
        return (
          <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
            <h2 className="ml-5">Tracker Aggregation </h2>
            <br></br>
            <br></br>
            <ReactBootstrap.Table striped bordered hover>
              <thead></thead>
              <tbody>
                <tr>
                  <td>Imported</td>
                  <td>Updated</td>
                  <td>Deleted</td>
                  <td>Ignored</td>
                  <td>Conflicts</td>
                </tr>
                <tr>
                  <td>{imported}</td>
                  <td>{updated}</td>
                  <td>{deleted}</td>
                  <td>{ignored}</td>
                  <td>{this.state.conflicts}</td>
                </tr>
              </tbody>
            </ReactBootstrap.Table>
            <br></br>
            <br></br>
            <ReactBootstrap.Alert variant="success">
              Data Pushed Successfully!!
            </ReactBootstrap.Alert>
            <br></br>
            <ReactBootstrap.Button onClick={() => this.importData()}>
              Back
            </ReactBootstrap.Button>
          </div>
        );
      } else {
        if (this.state.show) {
          return (
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
              <h2 className="ml-5">Tracker Aggregation </h2>
              <div className="row">
                <div className="col-sm-2 m-1 ml-5"> Org Unit:</div>
                <div className="col-sm-4 m-1">
                  {" "}
                  <input
                    className="form-control"
                    value={this.props.data.displayName}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2 m-1 ml-5 ">Start Date:</div>
                <div className="col-sm-4 m-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => this.handleChange(e, "startDate")}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2 m-1 ml-5 ">End Date</div>
                <div className="col-sm-4 m-1">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => this.handleChange(e, "endDate")}
                    className="form-control"
                  />
                </div>
              </div>
              <button
                className="btn btn-primary ml-5"
                onClick={() =>
                  this.postDataValues(this.props.data.id, startDate, endDate)
                }
              >
                Submit
              </button>
            </div>
          );
        } else {
          return (
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
              <h2 className="ml-5">Tracker Aggregation </h2>
              <br></br>
              <br></br>
              <div className="row ml-5">
                <ReactBootstrap.Button onClick={() => this.importData()}>
                  Import Data
                </ReactBootstrap.Button>
              </div>
            </div>
          );
        }
      }
    }
  }
}
export default DynamicComponent;
