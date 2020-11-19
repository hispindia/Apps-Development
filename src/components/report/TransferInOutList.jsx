import React, { Component } from 'react';
import { headers } from '../../constants';
import { Loader, Alert, Table } from '../utils';
import { ApiService } from '../../services/apiService';
import { Container } from '../Styles';

class TransferInOutList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackedEntityInstances: [],
      status: false,
      errors: [],
    }
  }

  componentDidMount() {
    ApiService.getTEIList(this.props.organisationUnit.id, this.props.programId, this.props.referralId).then(response => {
      this.setState({ trackedEntityInstances: response, status: true })
    }).catch((err) => this.setState({ errors: [err], status: true }))
  }

  handleTransfer = (value) => {
    this.setState({ transferredStatus: value })
  }

  onTEIClick = (e) => {
    let teiList = this.state.trackedEntityInstances.filter(tei => tei["Client Code"]==e["0"]);
    if(teiList.length) {  
      window.open(`../../../dhis-web-tracker-capture/index.html#/dashboard?tei=${teiList["0"]["teiId"]}&program=${teiList["0"]["programId"]}&ou=${teiList["0"]["orgUnitId"]}`, '_blank');
    }
  }

  render() {
    const { status, trackedEntityInstances  } = this.state;
    const errors = this.state.errors.map((err, index) => <Alert key={index} message={err} critical={true} handleErrors={this.handleErrors} />);

    if (!status) return <Loader />;
    if (errors.length) return errors;

    return (
      <Container>      
        {trackedEntityInstances.length ?        
        <Table
        rows={trackedEntityInstances}
        headers={headers}
        onTEIClick={this.onTEIClick}
        title={this.props.referralList[this.props.referralId]}
        /> : 
        <h4 style={{color:"#808080",fontStyle:"italic",textAlign:"center", margin:"20% auto"}}> No Record Exist! </h4>
        }
      </Container>
     
    )
  }

}

export default TransferInOutList;