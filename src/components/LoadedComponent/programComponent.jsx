import React, { Component } from 'react';
import { Col, Input,  } from 'reactstrap';
import ProgramStageData from '../LoadedComponent/programStageComponent'
import  { BaseUrl } from '../../services/EventService'
class ProgramData extends React.Component {
    constructor( props) {
        super(props) 
        this.state = {
            programStage : ''
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e) {
      let id = e.target.value
      this.componentDidMount(id);
    }
    componentDidMount(id) {
        console.log("here is seleted", id);
      fetch(BaseUrl +'/api/programs/'+id+'.json?fields=id,name,programStages[id,name,code]&paging=false')
       .then(res => res.json())
       .then(
         (result) => {
        console.log("here is seleted", result.programStages);
        this.setState({
            programStage: result.programStages
        })
         },
         (error) => {
             console.log("here is seleted", error);
         }
       )
        }
    render() { 
            console.log("here is program Com", this.props.program)
            const optionVal = ()=>{
                if(this.props.program === undefined){
                   let val =['']
                  return  val
                } else{
                    console.log(this.props.program)
                  let a =  [...this.props.program]
                  let b  = a.map( (val, index) => <option key={index} value={val.id}> {val.name} </option>)
                return b;
                }
            }
            console.log("here is program Com", optionVal())

        return (
            <>
            <Col>
             <Input type="select" name="select" id="exampleSelect" onChange={this.handleChange}>
             {optionVal()}
            </Input>
            </Col>
            <ProgramStageData programStages={this.state} />
            </>
         );
    }
}
 
export default ProgramData;