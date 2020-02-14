import React, { Component } from "react";
import { Col, Input, Row, form } from "reactstrap";
import ProgramStageData from "../LoadedComponent/programStageComponent";
import { ApiService } from '../../services/apiService'

class ProgramData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goStatus: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  static getDerivedStateFromProps(props) {
    return {
      orgUnit: props.programs,
      orgUnitId: props.programs.orgUnitId,
      programId: props.programs.programId,
      programStage: props.programs.programStage,
      programStageId: props.programs.programStageId,
      programSection: props.programs.programSection,
      orgUnitId: props.programs.orgUnitId
    }
  }
  handleChange(e) {
    var id = e.target.value;
    if (id !== undefined) {
      this.setState({programId: id})
      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          // console.log("here is seleted", result.programStages);
          this.setState({
            programStage: result.programStages
          });
          if(programStage.length > 0){
              var programStageId = programStage[0].id; 
              ApiService.getDataElements(programStageId).then( result => {
                console.log("ok", id)
                        let obj = {
                          programId: id,
                          programStage: programStage,
                          programStageId: programStageId,
                          programSection: result.programStageSections
                         }
                       replaceState(obj)
                      
                      //  console.log("here is DE",  result.programStageSections)
                      console.log("here is set stateddddd", this.state)
                  })
              }
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
  }
 
  render() {
     console.log("here is program Com", this.props, this.state);
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
