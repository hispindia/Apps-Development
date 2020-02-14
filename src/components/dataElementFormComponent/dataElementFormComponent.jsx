import React, { Component } from 'react';
import {
  Button,
  Col,
  Row,
  Input,
} from "reactstrap";
import { NavLink } from 'react-router-dom';
import { payloadService } from '../../services/dataService'
class DataElement extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orgUnitId: '',
      programStageId: '',
      programId: '',
      eventDate: '',
      status: "ACTIVE",
      dataValues: [],
      goStatus: true,
      payload: '',
      tei: ''
    }
    this.EventPass = this.EventPass.bind(this);
  }
  handleChange(index1, index2, e) {
    //  console.log(index1, index2, e.target.value)
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    //  console.log("here is state", this.state)
  }
  static getDerivedStateFromProps(props) {
      // console.log("ok")
    return {
      dataValues: props.allTreeData.programStageSections,
      orgUnitId: props.allTreeData.orgUnitId,
      programStageId: props.allTreeData.programStageId,
      programId: props.allTreeData.programId,
      eventDate: props.allTreeData.date,
      tei: props.allTreeData.tei,
    }
  }
  EventPass() {
     let date = JSON.stringify(this.state.eventDate);
     let fdate =date.substring(1, date.length-1);
    //  console.log('here is date', fdate)
    let payload = {
      orgUnitId: this.state.orgUnitId,
      programStageId: this.state.programStageId,
      programId: this.state.programId,
      eventDate: fdate,
      status: "ACTIVE",
      tei: this.state.tei
    }
    let data = [];
    let event = this.state.dataValues
    event.forEach(element => {
      element.dataElements.forEach(val => {
        if (val.value !== undefined) {
          let id = val.id;
          let valu = val.value
          let dVal = { id: id, value: valu }
          data.push(dVal)
        }
        // console.log('here is me', data)
      })
    })
    payload['dataValues'] = data;
  payloadService.passpayload(payload);
  }

  render() {
    // var programStageSections  = this.props.programStageSections.programStageSections
  //  console.log("here props for ps sec", this.props.allTreeData, )
    const sectionHeader = () => {
      if (this.props.allTreeData.loadingData.programSection === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.props.allTreeData.loadingData.programSection]
        let b = a.map((val, index1) =>
          <>
            <h6 key={index1}>{val.name}</h6>
            <br />
            <Row>
              {val.dataElements.map((ele, index2) =>
                <>
                  <Col md="auto" key={ele.id}>
                    {ele.name}
                  </Col>
                  <br />
                  <Col md={12}> <Input type={ele.valueType} placeholder={ele.valueType} onChange={(e) => this.handleChange(index1, index2, e)} /></Col>
                </>
              )}
            </Row>
            <br />
          </>
        )
        return b;
      }
    }
    return (
      <>
        <Row form>
          <Col>{sectionHeader()}</Col>
        </Row>
         <Col sm={{ size: 10, offset: 11 }}>
          <NavLink className="nav-link" to="/eventDetailPage">
            {this.state.goStatus ? <Button color="primary" onClick={this.EventPass}>Go</Button> : null }
            
          </NavLink>
        </Col>
      </>);
  }
}
export default DataElement;