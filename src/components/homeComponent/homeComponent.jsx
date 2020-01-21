import React, { PureComponent } from 'react';
import Dynamic from '../dynamicComponent/dynamicComponent'
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { useDataQuery } from '@dhis2/app-runtime';
import { Col, Row, } from 'reactstrap';
import  { BaseUrl } from '../../services/EventService'
import './homeComponent.css'
const onError = error => console.error(error)

class Home extends React.Component {
    constructor() {
        super();
        this.state={
            orgUnit:"",
            program: ""
        }
         this.onSelect = this.onSelect.bind(this)
    }
    onSelect(selected) {
        let id =selected.id;
        this.componentDidMount(id);
        // console.log("here is the data",selected.id);
        this.setState({orgUnit: selected})
    }
    componentDidMount(id) {
    //    console.log("here is seleted", id);
     fetch(BaseUrl +'/api/organisationUnits/'+id+'.json?fields=id,name,programs[id,name,code]&paging=false')
      .then(res => res.json())
      .then(
        (result) => {
    //    console.log("here is seleted", result);
       this.setState({
           program: result.programs
       })
        },
        (error) => {
             console.log("here is seleted", error);
        }
      )

    }
    render() {
        return ( <> 
            <div className="row">
                <div className="sidebar font">  
                    <OrgUnitTree
                    onSelect={this.onSelect}
                    onError={onError}   
                    /> 
                </div>
              <div className="main-div p-5"> 
                 <Dynamic  data = {this.state}/>
              </div>
          </div>
          </>   
         );
    }
}
export default Home;