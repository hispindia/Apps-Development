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
            orgUnitId: ''
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
            },
            (error) => {
                console.log("here is error", error);
            }
        )

    }

    render() {
        // console.log("here is state at home", this.state);
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