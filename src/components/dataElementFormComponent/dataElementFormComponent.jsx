import React, { Component } from 'react';
import {
  Button,
  Col,
  Row,
  Input,
} from "reactstrap";
import { BrowserRouter as Router, Link, history, withRouter, NavLink } from 'react-router-dom';
import { ApiService } from '../../services/apiService';
import { PlayloadService } from '../../services/dataService'
import { useHistory } from 'react-router-dom';
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
      goStatus: false
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
    //  console.log("ok")
    return {
      dataValues: props.allTreeData.programStageSections,
      orgUnitId: props.allTreeData.orgUnitId,
      programStageId: props.allTreeData.programStageId,
      programId: props.allTreeData.programId,
      eventDate: props.allTreeData.date,
    }
  }
  EventPass() {
    // let date = JSON.stringify(this.state.eventDate);
    // console.log('here is date', date)
    let playload = {
      orgUnitId: this.state.orgUnitId,
      programStageId: this.state.programStageId,
      programId: this.state.programId,
      eventDate: JSON.stringify(this.state.eventDate),
      status: "ACTIVE",
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
    playload['dataValues'] = data;
   
    PlayloadService.passPlayload(playload);

  }
 
  render() {
    // var programStageSections  = this.props.programStageSections.programStageSections

    console.log("here props for ps sec", this.props)
    const sectionHeader = () => {
      if (this.props.allTreeData.programStageSections === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.props.allTreeData.programStageSections]
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
            <Button color="primary" onClick={this.EventPass}>Go</Button>
          </NavLink>
        </Col>
      </>);
  }
}
export default DataElement;