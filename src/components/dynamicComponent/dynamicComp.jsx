import React, { Component } from "react";
import "./dynamicComp.css";
import {
  Col,
  Row,
  Input,
} from "reactstrap";
import ProgramData from "../LoadedComponent/programComponent";
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
    return {
      orgUnit: props.data, 
      orgUnitId: props.data.orgUnitId
    }
  } 
  render() {
    //  console.log('here is dynamic com', this.props)
    //  const optionVal = () => {
    //   if (this.props.programs.program === undefined) {
    //     let val = [""];
    //     return val;
    //   } else {
    //     // console.log(this.props.program);
    //     let a = [...this.props.programs.program];
    //     let b = a.map((val, index) => (
    //       <option key={index} value={val.id}>
    //         {val.name}
    //       </option>
    //     ));
    //     return b;
    //   }
    // };
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
          {/* <Row form>
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
        </Row> */}
          <br />
          <ProgramData programs={this.props.data} />
        </form>
      </div>
      </>
    );
  }
}
export default Dynamic;
