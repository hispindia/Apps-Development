import React, { Component } from 'react';
import axios from "axios";

class DynamicComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            dECOC: {},
            programCount: {},
            dataJSON = {},
        }
        this.getdECOC = this.getdECOC.bind(this)
        this.postDataValues = this.postDataValues.bind(this)
    }
        
    getEvents = (orgUnit, startDate, endDate) => {
        var events = [];    
        var programCount = {}; 
        var dECOC = this.state.dECOC;
        
        var url =  `../../../api/events.json?paging=false&orgUnit=${orgUnit}&ouMode=DESCENDANTS`;      
        if(startDate) url += `&startDate={startDate}`
        if(endDate) url += `&endDate={endDate}`   
        return axios
        .get(url)
        .then(resp => {
            resp.data.events.forEach(event => {
            var eventData = {};
            var dataElement = {}
            var dataValue = {};
            if(event["eventDate"]) {
                eventData.eventDate = event["eventDate"].split("T")["0"];
                eventData.orgUnit = event["orgUnit"];
                eventData.program = event["program"];                
                event.dataValues.forEach(dataValue => dataElement[dataValue.dataElement] = dataValue.value);
    
                if(dataElement["SaQe2REkGVw"]) dataValue["deCode"] = dataElement["SaQe2REkGVw"];
                if(dataElement["mp5MeJ2dFQz"] && dataElement["B7XuDaXPv10"]) dataValue["COC"] = `${dataElement["mp5MeJ2dFQz"]}, ${dataElement["B7XuDaXPv10"]}`;
                eventData.dataValues = dataValue;
                events.push(eventData);
            }
            });

            if(!events.length) return;
            events.forEach(event => {
                let eventDate = `${event.eventDate.split("-")["0"]}-${event.eventDate.split("-")["1"]}`;
                let eventOrgUnit = event.orgUnit;
                let eventDeCode = event.dataValues.deCode;
                let eventCOC = event.dataValues.COC;

                if(dECOC[eventDeCode] && dECOC[eventCOC] && eventDate && eventOrgUnit) {
                    if(!programCount[`${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`]) programCount[`${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`] = 0;
                    programCount[`${eventOrgUnit}:${eventDate}:${dECOC[eventDeCode]}-${dECOC[eventCOC]}`] += 1;
                }
            })
            return programCount;
        });
    }

    async getdECOC() {  
        var dECOC = {};
        axios.get(`../../../api/29/sqlViews/GGhupAYbdg2/data.json?paging=false`)
        .then((resp) => {
            resp.data.listGrid.rows.forEach( row => {
                if(row["0"]) dECOC[row["0"]] = row["2"];
                if(row["7"]) dECOC[row["7"]] = row["6"];
            });
            this.setState({dECOC: dECOC})
        });
    }

    async postDataValues(orgUnit, startDate = "", endDate = "") {
        var programCount = await this.getEvents(orgUnit, startDate, endDate);  
        var dataValues = [];
        
        for(let item in programCount) {
            let dataValue = item.split(":");
            dataValues.push({
                orgUnit: dataValue["0"],
                period: dataValue["1"],
                dataElement: dataValue["2"].split("-")["0"],
                categoryOptionCombo: dataValue["2"].split("-")["1"],
                value: programCount[item]
            })
        }
        console.log(dataValues);   

        // PUSHING DATA IN DATA ENTRY
        // this.setState({ dataJSON: JSON.stringify(dataValues) })
        // axios.post('../api/dataValueSets/',JSON.stringify(dataValues))
        // .then(function (response) {
        //     console.log(response);
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });

    }

    componentDidMount() {
        this.getdECOC();
    }
    handleChange(e, id) {
        this.setState({[id]: e.target.value})
    }
    render() {
        const { startDate, endDate } = this.state;

        return (
            <div className="pt-4 m-5 pb-5 mh-100 shadow-lg p-3 mb-4 bg-white rounded">
                <h2 className="ml-5">Tracker Aggregation </h2>
                <div className="row">
                     <div className="col-sm-2 m-1 ml-5"> Org Unit:</div>
                     <div className="col-sm-4 m-1"> <input className="form-control" value={this.props.data.displayName} /></div>
                </div>
                <div className="row">
                    <div className="col-sm-2 m-1 ml-5 ">
                        Start Date:
                      </div>
                    <div className="col-sm-4 m-1">
                       <input type="date" value={startDate} onChange={(e) => this.handleChange(e, "startDate")} className="form-control" />
                   </div>
                </div>
                <div className="row">
                    <div className="col-sm-2 m-1 ml-5 ">
                        End Date
                   </div>
                    <div className="col-sm-4 m-1">
                      <input type="date" value={endDate} onChange={(e) => this.handleChange(e, "endDate")} className="form-control" />
                   </div>
                </div>
                <button className="btn btn-primary ml-5" onClick={() => this.postDataValues(this.props.data.id, startDate, endDate)}>Submit</button>
            </div>
        );
    }
}
export default DynamicComponent;