import React, { Component } from 'react';
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { GenerateReport } from './report'
import { Loader } from "./utils";
import { MainContainer, Aside } from "./Styles";

const onError = error => console.error(error)

class CustomReport extends Component {
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
        const { organisationUnit, hideLoader } = this.state;

        return (
            <MainContainer>
                <Aside>
                    <OrgUnitTree
                        onSelect={this.onSelect}
                        onError={onError}
                    />
                </Aside>

                <GenerateReport
                    organisationUnit={organisationUnit}
                    hideLoader={this.hideLoader}
                />

                {hideLoader && <Loader />}
            </MainContainer>
        );
    }
}
export default CustomReport;