import React, { Component } from 'react';
import { Col, Input, Row, form } from 'reactstrap';
import DataElement from "../dataElementFormComponent/dataElementFormComponent";
import DatePicker from "react-date-picker";
import { ApiService } from '../../services/apiService'
class ProgramStage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      programStageSections: '',
      date: new Date(),
      error: null,
      isLoaded: false,
      orgUnitId: '',
      programId: '',
      programStageId: '',
      goStatus: false,
      tei: ''
    }
    this.handleChange =this.handleChange.bind(this)
  }
  handleChange(e) {
    let id = e.target.value;
    // console.log('here is option value', id.id)
    if (id !== undefined) {
      this.setState({programStageId: id})
      ApiService.getDataElements(id).then(
        result => {
          // console.log("here is seleted", result.programStageSections);
          this.setState({
            programStageSections: result.programStageSections
          });
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
   
    // console.log("here id ps id", id)
    let datas = {
      program: this.state.programId,
      ou: this.state.orgUnitId
    }
    var arr = [];
  ApiService.getTrackedEntityInstance(datas).then(
      (response) => { 
          response.trackedEntityInstances.forEach(tei => {
              let obj = {
                  tei: "",
                  Name: "",
                  Gender: "",
                  checked: false
              };
              obj["Project Donor"] = ""
              obj["tei"] = tei.trackedEntityInstance
              var neededAttr = [];
              neededAttr["N48JExn2s73"] = true; //Gender
              neededAttr["KLSVjftH2xS"] = true; //Project Donor
              neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
              neededAttr["gJ7mFiFa0dU"] = true; //first Name
              neededAttr["t67rLuGIQmZ"] = true; //Last Name
              tei.attributes.forEach(attr => {
                  if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;

              })
              obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
              arr.push(obj);

          })
           this.setState({ tei: arr })
          //  console.log(this.state)
      },
      (error) => {
          console.log("here is seleted", error);
      }
  )
  console.log("here is state at ps com", this.state)
  }
  static getDerivedStateFromProps(props) {
    return {
      orgUnit: props.allData,
      orgUnitId: props.allData.orgUnitId,
      programId: props.allData.programId,
    }
  }
  render() {
    // console.log("here is ps com", this.props)
    const optionVal = () => {
      if (this.props.allData.programStage === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.props.allData.programStage]
        let b = a.map((val, index) => <option key={index} value={val.id}> {val.name} </option>)
        return b;
      }
    }
    // console.log("herer is data for psddddd", optionVal())
    return (
      <>
        <Row form>
          <Col md="auto">Program Stage : </Col>
          <Col>
            <Input type="select" name="select" id="exampleSelect"  onChange={this.handleChange}>
              {optionVal()}
            </Input>
          </Col>
        </Row>
        <br />
        <Row form>
            <Col md="auto">Event Date :</Col>
            <Col><DatePicker onChange={this.onChange} value={this.state.date} /></Col>
          </Row>
        <br />
        <DataElement allTreeData={this.state} />
      </>
    )
  }
}

export default ProgramStage;