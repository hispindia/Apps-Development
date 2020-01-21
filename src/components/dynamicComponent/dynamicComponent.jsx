import React, { Component } from 'react';
import onSelect from '../homeComponent/homeComponent'
import './dynamicComponent.css'
import { Button,Col, Row, form, formGroup, Label, Input, formText } from 'reactstrap';
import DatePicker from 'react-date-picker';
import ProgramData from '../LoadedComponent/programComponent'
// function  RenderProgram(params) {
//      console.log("here is program", params)
//   return (<> 
//          <ul>
//              here is me 
//             </ul>
//     </>)
// }

class Dynamic extends React.Component {
    constructor(props) {
        super(props);
        this.state={
         date: new Date(),
         error: null,
         isLoaded: false,
         items: [],
         data : props
        }
    }
    onChange = date => this.setState({ date })
  //   componentDidMount() {
  //     console.log("here is me id",this.state);
  //     var url = 'http://localhost:8090/plan/api/organisationUnits/wnDm6jbp27v?fields=id,name,programs[id,name,code]&paging=false'
  //     fetch(url).then(response => {
  //         console.log("here is me asdfasdfas",response)
  //     })
  //     .catch(error =>{
  //         console.log(error)
  //     })
      
  // }
  
 
  render() { 
      const programs  = this.props.data.program
      console.log("here is props", this.props , programs)
        return ( 
              <div className="shadow-lg p-3 mb-3 bg-white rounded box">
                  <form>
                     <Row form>
                     <Col md="auto">Selected Organisation Unit :</Col>
                     <Col><Input type="text"   value ={this.props.data.orgUnit.displayName}  /></Col>
                     <Col><Input type="text"   value ={this.props.data.orgUnit.id} /></Col>
                      </Row>
                      <br />
                      <Row form>
                          <Col md="auto">Program : </Col>
                          <ProgramData program={this.props.data.program} />
                           </Row>
                           <br/>
                           <Row form>
                            <Col md="auto">  Program Stage : </Col>
                            <Col>
                          <Input type="select" name="select" id="exampleSelect">
                            <option>1</option>
                         </Input>
                         </Col>
                      </Row>
                      <br/>
                      <Row form> 
                        <Col md="auto">
                          Event Date : 
                          </Col>
                          <Col>
                          <DatePicker
                            onChange={this.onChange}
                            value={this.state.date} />
                            </Col>
                      </Row>
                  </form>   
               </div>
         );
    }
}
export default Dynamic;