import React, { PureComponent } from 'react';
import Dynamic from '../dynamicComponent/dynamicComponent'
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { Col, Row, } from 'reactstrap';
import { BaseUrl } from '../../services/EventService'
import { ApiService } from '../../services/apiService'
import { Link, NavLink } from "react-router-dom";

import './homeComponent.css'
const onError = error => console.error(error)
class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            orgUnit: {
                id: '',
                displayName: '',
                path: ''
            },
            program: "",
            orgUnitId: '',
            programStage: '',
            programSection: ''
        }
        this.onSelect = this.onSelect.bind(this)
        this.getPrograms = this.getPrograms.bind(this)
    }
    onSelect(selected) {
        let id = selected.id;
        if (id != undefined) {
            this.getPrograms(id);
            // console.log("here is the data",selected.id);
            this.setState({ 
                orgUnit: selected,
                orgUnitId: selected.id
             })
        }
    }
    getPrograms(id) {
        ApiService.getProgram(id).then(
            (result) => {
                //    console.log("here is seleted", result);
                this.setState({
                    program: result.programs
                })
                console.log("here is result at pId com", this.state.program)
                 if(this.state.program > 0){
                let programId = this.state.program[0].id;
                    ApiService.getProgramStage(programId).then( result => {
                        this.setState({
                            programStage: result.programStages 
                            })
                        //  console.log("here is reuslt of ps", result.programStages)
                        console.log("here is result at pdId com", this.state.programStage[0].id)
                        if(this.state.programStage > 0){
                            let programStageId = this.state.programStage[0].id; 
                                ApiService.getDataElements(programStageId).then( result => {
                                    this.setState({programSection: result.programStageSections})
                                    // console.log("here is DE",  result.programStageSections)
                                    console.log("here is set state", this.state)
                                })
                            }
                    })
                }
            },
            (error) => {
                console.log("here is error", error);
            }
        )
    }

    render() {
         console.log("here is state at home", this.state);
        return (<>
            <div className="row">
                <div className="sidebar font">
                    {/* <Link to={`/plan${this.state.orgUnit.path}`}> */}
                    <NavLink className="nav-link" to={`/plan${this.state.orgUnit.path}`}>
                        <OrgUnitTree
                            onSelect={this.onSelect}
                            onError={onError}
                        />
                    </NavLink>
                </div>
                <div className="main-div p-5">
                    <Dynamic data={this.state} />
                </div>
            </div>
        </>
        );
    }
}
export default Home;