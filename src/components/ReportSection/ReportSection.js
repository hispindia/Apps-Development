import React, { Component } from 'react'
import { Col, Row, Input, Button } from 'reactstrap';
import { Table } from 'reactstrap';
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
        this.setState({userdata: data })
    }  

    getReportSectionData = data => {
        this.setState({reportSectionData:data})

        console.log("reports",this.state.reportSectionData)
    }

    render() {
        return (
            <div id ='mainPage'>
                <h4> Section Management </h4>
                <div>
                    <div className="col-sm-12" align="right">
                    <Button
                color="primary"
                // onClick={this.displayData.bind(this)}
                //   onClick={this.saveConfiguartion.bind(this)}
                >
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
                            <tr>
                            {/* this.state.userdata.map(data,index) {
                                
                            }); */}
                            </tr>
                        </Table>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default ReportSection



