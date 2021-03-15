import React, { Component } from 'react'
// import Select from 'react-select';
// import './Navbar.css';
import './ReportConfiguartion.css';

import Select from 'react-select';

import { ApiService } from '../../services/apiService';
import { Col, Row, Input, Button } from 'reactstrap';
import { Dropdown } from 'semantic-ui-react';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Redirect } from 'react-router';

const configurationParameters = {
  "parameters": [
      {
          "key" : "user_group_for_report",
          "valueType" : "userGroup",
          "value" : ""
      },
      {
          "key" : "report_logo",
          "valueType" : "reportLogo",
          "value" : ""
      },
      {
          "key" : "ds_status_report",
          "valueType" : "dataSetStatusReport",
          "value" : ""
      }
  ]
};

export class ReportConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: [],
      documentData : [],
      reportsData : [],
      selectedUser: null,
      Selecteddatastatus: null,
      selectedLogo: null,
      errors: [],
      teams: [],
      selectedItems: "",
      selectedTeam: "",
      validationError: "",
      redirect: false
    }
  }


  getSelectedUser = selectedUser => {
    this.setState({ selectedUser });
    configurationParameters.parameters[0]["value"] = selectedUser.value;
  };
  
  getReportLogo = selectedLogo => {
    this.setState({ selectedLogo });
    configurationParameters.parameters[1]["value"] = selectedLogo.value;
  };

  getDataStatus = Selecteddatastatus => {
    this.setState({ Selecteddatastatus });
    configurationParameters.parameters[2]["value"] = Selecteddatastatus.value;
   
  };
    


  componentDidMount() {
    ApiService.getUserData().then(response => {
      this.getUserData(response)
    }).catch( err=> {
      this.setState({errors:[`Error: Failed to Load report!`]});
    })

    ApiService.getDocumentsData().then(response =>{
      this.getDocumentsData(response)
    }).catch(err =>{
      this.setState({errors:[`Error: Failed to Load report!`]});
    })

    ApiService.getReportData().then(response =>{
      this.getReportData(response)
    }).catch(err =>{
      this.setState({errors:[`Error: Failed to Load report!`]});
    })

  }

  getReportData = data => {
    let item = [];
    data.reports.forEach(data => {
      let items = {'value':data.id,'label':data.name}
      item.push(items);
    })
    this.setState({reportsData: item })
  }

  getDocumentsData = data => {
    let item = [];
    data.documents.forEach(data => {
      let items = {'value':data.id,'label':data.name}
      item.push(items);
    })
    this.setState({documentData: item })
  }


  getUserData = data => {
    let item = [];
    data.userGroups.forEach(datas => {
      let items = {'value':datas.id,'label':datas.name}
      item.push(items);
    })

    this.setState({userdata: item })
    console.log("section data",this.state.userdata)
    
  }

  
  /* This function is called to save configurataion 
     call the method from API services 
  */
  saveConfiguartion(){
    ApiService.saveReportConfiguration(configurationParameters).then(response => {
      // alert(response)
      Swal.fire(response)
      
      if(response){
        this.setState({redirect:true})
      }
    }).catch( err=> {
      console.log(err)
    })
  }

  render() {

    const customStyles = {
      container: provided => ({
        ...provided,
        width: 600
      })
    };

    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to='/'/>;
    }

    return (
      <div id='mainPage'>
          <h2>Set configuration </h2>
          <form>
          <div >
              <table>
                  <tbody>
                      <tr>
                          <td>
                          Please select user group for report administration : 
                          </td>
                          <td>
                         <Select 
                         styles={customStyles}
                         value={this.state.selectedUser}
                         onChange={this.getSelectedUser}
                         options={this.state.userdata}/>
                          </td>
                      </tr><br/>
                      <tr>
                          <td>
                          Please select resource for report logo : 
                          </td>
                          <td>
                          <Select 
                          value={this.state.selectedLogo}
                          onChange={this.getReportLogo}
                          options={this.state.documentData}/>
                          </td>
                      </tr> <br/>
                      <tr>
                          <td>
                          Please select data set Status Report : 
                          </td>
                          <td>
                          <Select 
                          value={this.state.Selecteddatastatus}
                          onChange={this.getDataStatus}
                          options={this.state.reportsData}/>
                          </td>
                      </tr>
                  </tbody>
              </table>
                  
          </div>
          </form>  
          <div style={{color: 'red', marginTop: '5px'}}>
            {this.state.validationError}
          </div>
          <br/>

          <Button
          color="primary"
          // onClick={this.displayData.bind(this)}
          onClick={this.saveConfiguartion.bind(this)}
        >
          Save
        </Button>
        </div>
    )
  }
}

export default ReportConfiguration


