import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Alert, Row } from '../utils';
import { Section, CenterItem } from '../Styles';
import { ApiService } from '../../services/apiService';
import TransferInOutList from './TransferInOutList';

export class TransferInOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      programId: '',
      referralList: ["Transferred In", "Transferred Out"],
      referralId: '',
      displayFrame: false,
      errors: [],
    }
  }

  componentDidMount() {
    ApiService.getPrograms().then(response => {
      this.displayReportList(response)
      this.displayreferralList(this.state.referralList)
      this.props.hideLoader();
    }).catch(err => {
      this.setState({ errors: [`Error: Failed to Load Program!`] });
      this.props.hideLoader();
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.organisationUnit.id != this.props.organisationUnit.id) this.setState({ displayFrame: false });
  }

  displayReportList = data => {
    let programs = "<option selected hidden>Select Program</option>"
    data.programs.forEach(program => {
      programs += `<option value="${program.id}">${program.displayName}</option>`;
    })
    document.getElementById("programId").innerHTML = programs;
  }

  displayreferralList = options => {
    let referral = "<option selected hidden>Select List</option>"
    options.forEach( (option, index) => {
      referral += `<option value="${index}">${option}</option>`;
    })
    document.getElementById("referralId").innerHTML = referral;
  }


  handleClick = (e) => {
    this.setState({ [e.target.id]: e.target.value, displayFrame: false })  
  }

  handleErrors = () => {
    this.setState({ errors: [] })
  }

  displayData = () => {
    let err = [];
    if (!this.state.programId) err.push("Please select a program!");
    if (!this.state.referralId) err.push("Please select a referral!");
    err.length ? this.setState({ errors: err }) : this.setState({ displayFrame: true, errors: [] });
  }

  render() {
    const { organisationUnit } = this.props;
    const { programId, referralList, referralId, displayFrame } = this.state;
    const errors = this.state.errors.map((err, index) => <Alert key={index} message={err} critical={true} handleErrors={this.handleErrors} />);

    return (
      <Section>
        <Row
          type={"text"}
          name={"Organisation Unit"}
          value={organisationUnit.displayName}
          disabled={"true"}
        />

        <Row
          type={"select"}
          name={"program"}
          value={programId}
          onChange={this.handleClick}
          id={"programId"}
        />

        <Row
          type={"select"}
          name={"Referral List"}
          value={referralId}
          onChange={this.handleClick}
          id={"referralId"}
        />

        <CenterItem>
          <Button
            color="primary"
            onClick={this.displayData}
          >
            Generate List
          </Button>
        </CenterItem>

        <br />
        <br />
        {errors}

        {displayFrame && (
          <TransferInOutList
            organisationUnit = {organisationUnit}
            programId = {programId} 
            referralId = {referralId}
            referralList = {referralList} />
        )}
      </Section>
    )
  }
}
