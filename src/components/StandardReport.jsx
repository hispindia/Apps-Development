import React, { Component } from 'react';
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { GenerateReport } from './report'
import { Loader } from "./utils";

const onError = error => console.error(error)

class StandardReport extends Component {
    constructor() {
        super();
        this.state = {
            organisationUnit: [],
            hideLoader: true
        }
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(selected) {
        this.setState({ organisationUnit: selected })
    }

    hideLoader = () => {
        this.setState({ hideLoader: false })
    }

    render() {
        const {organisationUnit, hideLoader} = this.state;
        
        return (
            <div className="row">
                <div className="col-lg-auto col-md-4 col-sm-12 col-xs-12 shadow-lg bg-white rounded">
                    <OrgUnitTree
                        onSelect={this.onSelect}
                        onError={onError}
                    />
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12 col-xs-12">
                    <GenerateReport
                        organisationUnit={organisationUnit}
                        hideLoader={this.hideLoader}
                    />
                </div>
                {hideLoader && <Loader />}               
            </div>
        );
    }
}
export default StandardReport;