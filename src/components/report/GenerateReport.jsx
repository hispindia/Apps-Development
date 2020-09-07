import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Alert, Row } from '../utils';
import HTMLReport from './HTMLReport';
import { Section, CenterItem } from '../Styles';
import { ApiService } from '../../services/apiService';

export class GenerateReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportParams: {},
      reportId: "",
      period: "",
      periodSelection: false,
      displayFrame: false,
      errors: []
    }
  }

  componentDidMount() {
    ApiService.getReportList().then(response => {
      this.displayReportList(response)
      this.displayYears("10");
      this.props.hideLoader();
    }).catch(err => {
      this.setState({ errors: [`Error: Failed to Load report!`] });
      this.props.hideLoader();
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.organisationUnit.id != this.props.organisationUnit.id) this.setState({ displayFrame: false });
  }

  displayReportList = data => {
    let reportParams = {};
    let reports = "<option selected hidden>Select Report</option>"
    data.reports.forEach(report => {
      reports += `<option value="${report.id}">${report.name}</option>`;
      reportParams[report.id] = report.reportParams;
    })
    this.setState({ reportParams: reportParams })
    document.getElementById("reports").innerHTML = reports;
  }

  displayYears = totalYears => {
    var date = new Date();
    var year = date.getFullYear();
    var period = "<option selected hidden>Select Year</option>"
    for (let i = year; i >= (year - totalYears); i--) period += `<option value="${i}">${i}</option>`;
    document.getElementById("report-period").innerHTML = period;
  }

  handleClick(e, id) {
    this.setState({ [id]: e.target.value, displayFrame: false })
    if (id == "reportId") {
      (this.state.reportParams[e.target.value].paramReportingPeriod) ?
        this.setState({ periodSelection: true }) : this.setState({ periodSelection: false });
    }
  }

  handleErrors = () => {
    this.setState({ errors: [] })
  }

  displayData = () => {
    let err = [];
    if (!this.state.reportId) err.push("Please select a report!");
    if (this.state.periodSelection && !this.state.period) err.push("Please select a year!");
    err.length ? this.setState({ errors: err }) : this.setState({ displayFrame: true, errors: [] });
  }

  render() {
    const { organisationUnit } = this.props;
    const { reportId, period, periodSelection, displayFrame } = this.state;
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
          name={"Report"}
          value={reportId}
          onChange={(e) => this.handleClick(e, "reportId")}
          id={"reports"}
        />

        <Row
          type={"select"}
          name={"Year"}
          value={period}
          onChange={(e) => this.handleClick(e, "period")}
          id={"report-period"}
          display={periodSelection ? "flex" : "none"}
        />

        <CenterItem>
          <Button
            color="primary"
            onClick={this.displayData}
          >
            Generate Report
          </Button>
        </CenterItem>

        <br />
        <br />
        {errors}

        {displayFrame && (
          <HTMLReport
            organisationUnit={organisationUnit}
            reportId={reportId}
            period={period} />
        )}
      </Section>
    )
  }
}
