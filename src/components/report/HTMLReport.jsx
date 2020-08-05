import React, { Component } from 'react';
import { ApiService } from "../../services/apiService";
import { Loader, Alerts } from "../utils";

const SCRIPTS = [
  '/dhis-web-commons/javascripts/jQuery/jquery.min.js',
  '/dhis-web-commons/javascripts/dhis2/dhis2.util.js',
]

const wrapHtmlInTemplate = html => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            ${SCRIPTS.map(createScriptTag).join('\n')}
        </head>
        <body>
            ${html}
        </body>
    </html>
`
const createScriptTag = script => {
  const src = process.env.REACT_APP_DHIS2_BASE_URL + script
  return `<script src="${src}" type="text/javascript"></script>`
}

class HTMLReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      report: "",
      status: false,
      errors: []
    }
  }

  componentDidMount() {
    ApiService.getAReports(this.props.reportId, this.props.organisationUnit.id, this.props.period).then(response => {
      this.setState({ report: response, status: true })
    }).catch((err) => this.setState({ errors: [err], status: true }))
  }

  render() {
    const { report, status } = this.state;
    const errors = this.state.errors.map((err, index) => <Alerts key={index} message={err} critical={true} handleErrors={this.handleErrors} />);

    if (!status) return <Loader />;
    if (errors.length) return errors;

    return (
      <iframe
        id="html-report-id"
        srcDoc={wrapHtmlInTemplate(report)}
        title="html-report-content"
        width="100%"
        height="500"
        seamless={true}
        sandbox="allow-same-origin allow-scripts allow-modals allow-downloads"
      >
      </iframe>
    )
  }

}

export default HTMLReport;