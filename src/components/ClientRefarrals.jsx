import React, { Component } from 'react';
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { TransferInOut } from './report'
import { Loader } from "./utils";
import { MainContainer, Aside } from "./Styles";

const onError = error => console.error(error)

class ClientRefarrals extends Component {
    constructor() {
        super();
        this.state = {
            organisationUnit: {},
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
                {
                (Object.keys(organisationUnit).length === 0 && organisationUnit.constructor === Object) ?
                "" : <TransferInOut
                    organisationUnit={organisationUnit}
                    hideLoader={this.hideLoader}
                />  
                }

                {hideLoader && <Loader />}
            </MainContainer>
        );
    }
}
export default ClientRefarrals;