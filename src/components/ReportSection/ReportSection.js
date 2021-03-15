import React, { Component } from 'react'
import { Col, Row, Input, Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { Item } from 'semantic-ui-react';
import '../../App.css';
import { ApiService } from '../../services/apiService';


export class ReportSection extends Component {

    constructor(props) {
       super(props);
       this.state = {
          userdata: [],
          reportSectionData : [],
          redirect: false
        }
      }

    componentDidMount() {
        ApiService.getUserData().then(response => {
            this.getUserGroupData(response)
        }).catch( err=> {
            this.setState({errors:[`Error: Failed to Load report!`]});
        })

        ApiService.getAllReportSection().then(response =>{
            this.getReportSectionData(response)
        }).catch(err =>{
            this.setState({errors:[`Error: Failed to Load report!`]});
        })

    }

    getUserGroupData = data => {
        let items = [];


        data.userGroups.forEach(ele =>{
            let item = {'name':ele.name,'id':ele.id}
            items.push(item)
        })
        this.setState({userdata: items})
    }  

    getReportSectionData = data => {

        let items = [];

        data.sections.forEach(ele => {
            let item = {'name':ele.name,'uid':ele.uid,'userGroup':ele.userGroupUid}
            items.push(item)
            
        });
        
        this.setState({reportSectionData:items})

        // console.log("section data",this.state.reportSectionData)

    }

    getName(value){

        let name;
        for(let i =0;i<this.state.userdata.length;i++){
            if(this.state.userdata[i].id==value){
                name = this.state.userdata[i].name
                
            }
        }
        return name
    }

    renderTableData() {
        return this.state.reportSectionData.map((data) => {
              
           return (
              <tr>
                 <td>{data.uid}</td>
                 <td>{data.name}</td>
                 <td>
                 {this.getName(data.userGroup)}
                 </td>
              </tr>
           )
        })
     }


    render() {
        return (
            <div id ='mainPage'>
                <h4> Section Management </h4>
                <div>
                    <div className="col-sm-12" align="right">
                    <Button
                color="primary">
                Add New Section 
                </Button>
                 </div>
                    <hr/>
                    <div>
                        <Table>
                            <thead>
                            <tr>
                            <th>UID</th>
                            <th>Name</th>
                            <th>UserGroup</th>
                            <th>Operation</th>
                            </tr>
                            </thead>

                            {this.renderTableData()}
                            {/* <tr>
                    
                            {this.state.reportSectionData.map(data =>
                                {data.name})}
                            </tr> */}
                        </Table>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportSection



