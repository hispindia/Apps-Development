import React, { PureComponent } from 'react';
import Dynamic from '../dynamicComponent/dynamicComp'
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { Col, Row, } from 'reactstrap';
import { ApiService } from '../../services/apiService'
import { NavLink, withRouter } from "react-router-dom";

import './homeComponent.css'
const onError = error => console.error(error)
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orgUnit: {
                id: '',
                displayName: '',
                path: ''
            },
            program: "",
            orgUnitId: '',
            programStage: '',
            programStageId: '',
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
             this.props.history.push(`/plan${selected.path}`)
        }
        // console.log('here is props at home', this.props)

        ApiService.getMetaData().then( res => {
            console.log("here is metadata", res)
        })

    }
    getPrograms(id) {
        var id =id;
        ApiService.getProgram(id).then(
            (result) => {
                //    console.log("here is seleted", result);
                // this.setState({
                //     program: result.programs
                // })
                var program =result.programs
                // console.log("here is result at pId com", program)
                 if(program.length > 0){
                var programId = program[0].id;
                    ApiService.getProgramStage(programId).then( result => {
                        // this.setState({
                        //     programStage: result.programStages 
                        //     })
                    var programStage =result.programStages
                        //  console.log("here is reuslt of ps", result.programStages)
                        if(programStage.length > 0){
                            var programStageId = programStage[0].id; 
                                ApiService.getDataElements(programStageId).then( result => {
                                     this.setState({
                                         orgUnitId: id,
                                         program: program,
                                         programId: programId,
                                         programStage: programStage,
                                         programStageId: programStageId,
                                         programSection: result.programStageSections
                                        })
                                    // console.log("here is DE",  result.programStageSections)
                                    // console.log("here is set state", this.state)
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
        //  console.log("here is state at home", this.state);
        return (<>
            <div className="row">
                <div className="sidebar font">
                    {/* <Link to={`/plan${this.state.orgUnit.path}`}> */}
                    {/* <NavLink className="nav-link" to={`/plan${this.state.orgUnit.path}`}> */}
                        <OrgUnitTree
                            onSelect={this.onSelect}
                            onError={onError}
                        />
                    {/* </NavLink> */}
                </div>
                <div className="main-div p-5">
                    <Dynamic data={this.state} />
                </div>
            </div>
        </>
        );
    }
}
export default withRouter(Home);