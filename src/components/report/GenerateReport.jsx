import React, { Component } from 'react';
import { Col, Row, Input, Button } from 'reactstrap';
import { ApiService } from '../../services/apiService';
import HTMLReport from './HTMLReport';
import { Alerts } from '../utils';

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
    ApiService.getReports().then(response => {
      this.getReports(response)
      this.getyears("10");
      this.props.hideLoader();
    }).catch( err=> {
      this.setState({errors:[`Error: Failed to Load report!`]});
      this.props.hideLoader();
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.organisationUnit.id != this.props.organisationUnit.id) this.setState({ displayFrame: false });
  }

  getReports = data => {
    let reportParams = {};
    let reports = "<option selected hidden>Select Report</option>"
    data.reports.forEach(report => {
      reports += `<option value="${report.id}">${report.name}</option>`;
      reportParams[report.id] = report.reportParams;
    })
    this.setState({ reportParams: reportParams })
    document.getElementById("reports").innerHTML = reports;
  }

  getyears = totalYears => {
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

  displayData() {
    let err = [];
    if(!this.state.reportId) err.push("Please select a report!");
    if(this.state.periodSelection && !this.state.period) err.push("Please select a year!");
    err.length ? this.setState({ errors: err }) : this.setState({ displayFrame: true, errors: [] });
  }

  saveData(){
    
  }

  render() {
    const { organisationUnit } = this.props;
    const { reportId, period, periodSelection, displayFrame } = this.state;
    const errors = this.state.errors.map( (err, index) => <Alerts key={index} message={err} critical={true} handleErrors = {this.handleErrors} />);

    return (
      <div className="pt-4 pb-5 mh-100 shadow-lg p-3 mt-4 bg-white rounded">
        <Row form>
          <Col className="col-md-4">Organisation Unit :</Col>
          <Col className="col-md-8">
            <Input
              className="form-control"
              type="text"
              defaultValue={organisationUnit.displayName}
              disabled
            />
          </Col>
        </Row>
        <br />

        <Row form>
          <Col className="col-md-4"> Report : </Col>
          <Col className="col-md-8">
            <Input
              type="select"
              value={reportId}
              onChange={(e) => this.handleClick(e, "reportId")}
              name="select"
              className="form-control"
              id="reports"
            >
            </Input>
          </Col>
        </Row>
        <br />

        <Row form style={{ display: periodSelection ? "flex" : "none" }}>
          <Col className="col-md-4"> Year : </Col>
          <Col className="col-md-8">
            <Input
              type="select"
              value={period}
              onChange={(e) => this.handleClick(e, "period")}
              name="select"
              className="form-control"
              id="report-period"
            >
            </Input>
          </Col>
        </Row>
        <br />
        
        <Button
          color="primary"
          onClick={this.displayData.bind(this)}
        >
          Generate Report
        </Button>
        <br />
        <br/>
        {errors}

        {displayFrame && (
          <HTMLReport
            organisationUnit={organisationUnit}
            reportId={reportId}
            period={period} />
        )}
      </div>
    )
  }
}
