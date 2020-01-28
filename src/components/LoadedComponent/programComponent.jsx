import React, { Component } from "react";
import { Col, Input, Row, form } from "reactstrap";
import ProgramStageData from "../LoadedComponent/programStageComponent";
import { BaseUrl } from "../../services/EventService";
import { ApiService } from '../../services/apiService'

class ProgramData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgUnit: '',
      orgUnitId: '',
      programId: '',
      goStatus: false,
      programStage: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    let id = e.target.value;
    if (id !== undefined) {
      this.setState({programId: id})
      ApiService.getProgramStage(id).then(
        result => {
          // console.log("here is seleted", result.programStages);
          this.setState({
            programStage: result.programStages
          });
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
  }
  static getDerivedStateFromProps(props) {
    return {
      orgUnit: props.programs,
      orgUnitId: props.programs.orgUnitId,
    }
  }
  render() {
     console.log("here is program Com", this.props);
    const optionVal = () => {
      if (this.props.programs.program === undefined) {
        let val = [""];
        return val;
      } else {
        // console.log(this.props.program);
        let a = [...this.props.programs.program];
        let b = a.map((val, index) => (
          <option key={index} value={val.id}>
            {val.name}
          </option>
        ));
        return b;
      }
    };
    // console.log("here is program Com pro", optionVal());
    return (
      <>
        <Row form>
          <Col md="auto">Program : </Col>
          <Col>
            <Input
              type="select"
              name="select"
              id="exampleSelect"
              onChange={this.handleChange}
            >
              {optionVal()}
            </Input>
          </Col>
        </Row>
        <br />
        <ProgramStageData allData={this.state} />
      </>
    );
  }
}

export default ProgramData;
