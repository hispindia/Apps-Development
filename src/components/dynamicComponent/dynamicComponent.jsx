import React, { Component } from "react";
import onSelect from "../homeComponent/homeComponent";
import "./dynamicComponent.css";
import {
  Button,
  Col,
  Row,
  form,
  formGroup,
  Label,
  Input,
  formText
} from "reactstrap";
import ProgramData from "../LoadedComponent/programComponent";
import { ApiService } from '../../services/apiService'
class Dynamic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgUnit: '',
      program: '',
      programId: '',
      programStages: ''
    };
    this.onChange =this.onChange.bind(this);
  }
  onChange = date => this.setState({ date });
  static getDerivedStateFromProps(props) {
    // let program = props.data.program[0]
    // if(program !== undefined) {
    //   // console.log("ok", program.id)
    //  this.runApi(program.id);
    // }
    return {
      orgUnit: props.data, 
      orgUnitId: props.data.orgUnitId
    }
  }
  // runApi (id) {
  //   ApiService.getProgramStage(id).then(
  //     result => {
  //       console.log("here is seleted progrgamstagess", result.programStages);
  //       // this.setState({
  //       //   programStages: result.programStages
  //       // });
  //       console.log("here is seleted progrgamstagess state", this.state);
  //     },
  //     error => {
  //       console.log("here is seleted", error);
  //     }
  //   );
  // }



    // ApiService.getDataElements(id).then(
    //   result => {
    //     console.log("here is seleted", result.programStageSections);
    //     this.setState({
    //       programStageSections: result.programStageSections
    //     });
    //   },
    //   error => {
    //     console.log("here is seleted", error);
    //   }
    // );
   // return 
    //  console.log("sate", this.state.dataValues)
componentDidMount(){
    // console.log("here is com did mount", this.state)
  }
  render() {
    const programs = {...this.props.data.program[0]};
    // console.log('here is dynamic com', programs.id)
    // if(programs.id !== undefined){
    //   ApiService.getProgramStage(programs.id).then(
    //   result => {
    //     console.log("here is seleted progrgamstagess", result.programStages);
    //     // this.setState({
    //     //   programStages: result.programStages
    //     // });
    //     console.log("here is seleted progrgamstagess state", this.state);
    //   },
    //   error => {
    //     console.log("here is seleted", error);
    //   }
    // );
    // }
    
    return (
      <>
      <div className="shadow-lg p-3 mb-3 bg-white rounded box">
        <form>
          <Row form>
            <Col md="auto">Selected Organisation Unit :</Col>
            <Col>
              <Input type="text" defaultValue={this.props.data.orgUnit.displayName} />
            </Col>
          </Row>
          <br />
          <ProgramData programs={this.props.data} />
        </form>
      </div>
      </>
    );
  }
}
export default Dynamic;
