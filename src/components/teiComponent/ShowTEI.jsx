import React, { PureComponent } from 'react';
import { Table , Input, Label, Button} from 'reactstrap';
import { ApiService } from '../../services/apiService';
import { NavLink, withRouter } from "react-router-dom";
import {Col,Row} from "reactstrap";
import  Alert from '../LoadingComponent/LoadingComponent'

class ShowTEI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check: false,
            payload: '',
            tei: '',
            statusAlert: false,
            flag: false
        }
    }
    markCheck(index) {
        let changedTei = this.state.tei;
        changedTei[index].checked = !changedTei[index].checked
        
        document.querySelector("#checkbox-head").checked = false;

        this.setState({ tei: changedTei, check:false })
        console.log("helo", changedTei)
    }
     markCheckll() {
        var headCheckBox = document.querySelector("#checkbox-head").checked;
        let changedTei = this.state.tei.map(teis => {
            teis.checked = headCheckBox;
            return teis;
        })
        var checkBox = document.querySelectorAll("input[type='checkbox']");
        checkBox.forEach(box => {
            box.checked = headCheckBox;
        })
        this.setState({ tei: changedTei, check: headCheckBox })
    }
    sendEvents() {
        let selectedTEI = this.state.tei.filter(tei => tei.checked);
        selectedTEI.forEach( ele => {
            let tei = ele.tei;
            let payload = this.state.payload
            var event = {
                trackedEntityInstance: tei,
                orgUnit: payload.orgUnitId,
                programStage : payload.programStageId,
                program : payload.programId,
                eventDate: payload.eventDate,
                status : "ACTIVE",
                dataValues:payload.dataValues
                };
               console.log("here is pay load", event)
            ApiService.postEvent(event).then(result => {
                if(result.httpStatus == 'OK'){
                    this.setState({ statusAlert: true });
                }
               console.log("res", result)
            }, error => {
                // this.setState({ statusAlert: true, flag: true });
               console.log(error)
            });
        })
       
    }

    static getDerivedStateFromProps(props) {
        // console.log('here is me!!')
        return { 
            tei: props.teis.payload.tei,
            payload: props.teis.payload
        };
    }

    render() {
        // console.log('here is props at  showTEI', this.props.teis.payload.tei, this.state, this.state.payload.tei);
        let checkBoxHead = this.state.check ? "Unselect All" : "Select All";
        const tei =  () => {
             if (this.state.tei.length > 0 )
             {
                return (        
                <div className="float-center m-5" >
                <div className="tei-element shadow-lg p-3 mb-3 bg-white rounded box">
                    <Table >
                        <thead>
                            <tr>
                                <th>Sr. NO.</th>
                                <th>Beneficiary Id</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Project Donor</th>                           
                                <th><Label> <Input type="checkbox" id="checkbox-head" onClick={() => this.markCheckll()} />  {checkBoxHead}</Label></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tei.map((tei, index) => (
                                <tr>
                                    <td>{index+1}</td>
                                    <td> {tei["Beneficiary ID"]} </td>
                                    <td> {tei.Name} </td>
                                    <td> {tei.Gender} </td>
                                    <td> {tei["Project Donor"]} </td>
                                    <td> <Input type="checkbox" onClick={() => this.markCheck(index)} /> </td>
                                </tr>
                            ))}
                        </tbody>
    
                    </Table>
                    <Row>
                    <Col md="auto"  sm={{ size: 10, offset: 1}}><Button color="primary" onClick={() => this.sendEvents()}> Submit
                    { this.state.statusAlert ? <Alert  flag={this.state.flag}/> :null }
                    </Button></Col>
                   </Row>
                </div>
              </div>)
              } 
              if(this.state.tei.length === 0){
                return ( <div className="float-center m-5 text-center" >
                <div className="tei-element shadow-lg p-3 mb-3 bg-white rounded box">
                <h1>Tracked Entity Instance not available</h1>
              </div>
             </div>)
            }
        } 
        // console.log("here is data for event push", tei());
        return (<>
         <Col> <NavLink className="nav-link" to="/"><Button color="danger">Back</Button></NavLink></Col>
         <div>{tei()}</div>
        </>
        );
    }
}
export default withRouter(ShowTEI);