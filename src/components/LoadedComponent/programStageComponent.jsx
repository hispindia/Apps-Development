import React, { Component } from 'react';
import { Col, Input,  } from 'reactstrap';
class ProgramStage extends React.Component {
    state = {  }
    render() { 
        console.log("here is ps com", this.props.programStages)
        // const optionValue = ()=>{
        //     if(this.props.programStage === undefined){
        //         let val =['']
        //        return  val
        //      } else{
        //        let a =  [...this.props.programStage]
        //        let b  = a.map( (val) => <option> {val.name} </option>)
               
        //        console.log("ghjjk",b)
        //      return b;
        //      }
        // } 
        //  console.log("herer is data for psddddd", optionValue())
        return ( 
        <>
        <Col md="auto">  Program Stage : </Col>
         <Col>
          <Input type="select" name="select" id="exampleSelect">
            {/* {optionVal()} */}
         </Input>
         </Col>
        </>
    )
  }
}
 
export default ProgramStage;