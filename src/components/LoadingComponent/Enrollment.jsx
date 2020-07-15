import React  from 'react';
import { withRouter } from "react-router-dom";
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { ApiService } from '../../services/apiService'
import { Table, Col, Row, Input, Label,Button } from "reactstrap";
import  Alert from '../LoadingComponent/LoadingComponent'
import SweetAlert from 'react-bootstrap-sweetalert';
import { Multiselect } from 'multiselect-react-dropdown';

import './loadingCom.css'
const onError = error => console.error(error);


class Enrollment extends React.Component {
    constructor(props) {
        super(props)
        console.log('here is props', props)
        this.state = {
            orgUnitName: '',
            orgUnitId: props.selected.id,
            programList: '',
            optionList: '',
            classOptionList: [],
            divisionOptionList: [],
            className: '',
            divisionName: '',
            trackedEntityInstances: [],
            teiAttributeHeader: [],
            trackedEntityInstanceDetails: [],
            go: false,
            check: false,
            goButtonStatus: true,
            closeEnrollmentButtonStatus: true,
            newEnrollmentButtonStatus: true,
            flag: false,
            classList: [],
            divisionList: []
        };
        //this.onSelect = this.onSelect.bind(this);
        this.programChange = this.programChange.bind(this);
        this.optionChange = this.optionChange.bind(this);
        this.classChange = this.classChange.bind(this);
        this.divisionChange = this.divisionChange.bind(this);
        this.onSelectClass =this.onSelectClass.bind(this);
        this.onRemoveClass = this.onRemoveClass.bind(this);
        this.onSelectDivision= this.onSelectDivision.bind(this);
        this.onRemoveDivision=this.onRemoveDivision.bind(this);

    }

    //onSelect(selected) {
    //    //console.log('here is tree', selected);
    //
    //    let orgUnitUid = selected.id;
    //    var displayName = selected.displayName;
    //    this.setState({
    //        orgUnitName: displayName,
    //        orgUnitId: orgUnitUid,
    //        go: false,
    //        goButtonStatus: true
    //    });
    //
    //    if (orgUnitUid != undefined) {
    //        this.getPrograms(orgUnitUid, displayName);
    //        this.getOptions(optionSetUid);
    //    }
    //
    //}
    componentDidMount(){
        let optionSetUid = 'rHGT41fjB2O';
        let classOptionSetUid = 'McLlu7elDpJ';
        let divisionOptionSetUid = 'uTXQe0NS3ra';
        this.getOptions(optionSetUid);
        this.getClassOptions(classOptionSetUid);
        this.getDivisionOptions(divisionOptionSetUid);
        this.setState({goButtonStatus: false});
        this.setState({orgUnitId: this.props.selected.orgUnitId});
    }

    getPrograms(orgUnitUid) {
        let programList = [];
        ApiService.getProgram(orgUnitUid).then(
            (programResponse) => {
                //programList = programResponse.programs;
                programResponse.programs.forEach(tempProgram => {
                    if (!tempProgram.withoutRegistration) {
                        programList.push(tempProgram);
                    }
                });
                this.setState({
                    programList: programList
                });
                if (programList.length > 0) {
                    let programId = programList[0].id;
                    this.setState({
                        programId: programId,
                        goButtonStatus: false
                    });
                }
            },
            (error) => {
                console.log("here is error", error);
            }
        )
    }

    getOptions(optionSetUid) {
        let optionList = '';
        ApiService.getOptionSetOptions(optionSetUid).then(
            (optionsResponse) => {
                optionList = optionsResponse.options;
                this.setState({
                    optionList: optionList
                });
                if (optionList.length > 0) {
                    let optionCode = optionList[0].code;
                    this.setState({
                        optionCode: optionCode
                    });
                }
            },
            (error) => {
                console.log("here is error", error);
            }
        )
    }
    getClassOptions(optionSetUid) {
        let classOptions = '';
        ApiService.getOptionSetOptions(optionSetUid).then(
            (optionsResponse) => {
                classOptions = optionsResponse.options;
                this.setState({
                    classOptionList: classOptions
                });
            },
            (error) => {
                console.log("here is error", error);
            }
        )
    }
    getDivisionOptions(optionSetUid) {
        let divisionOptions= '';
        ApiService.getOptionSetOptions(optionSetUid).then(
            (optionsResponse) => {
                divisionOptions = optionsResponse.options;
                this.setState({
                    divisionOptionList: divisionOptions
                });
            },
            (error) => {
                console.log("here is error", error);
            }
        )
    }
    getTrackedEntityInstanceList() {
        this.setState({
            go: true,
            trackedEntityInstanceDetails: []
        });

        let selectedValues = {
            orgUnitId: this.state.orgUnitId,
            programId: this.state.programId,
            optionCode: this.state.optionCode,
            className: this.state.className,
            divisionName: this.state.divisionName
        };
        console.log("selectedValues -- ", selectedValues);
        let pram = {
            programId: this.state.programId,
            orgUnitId: this.state.orgUnitId
        };
        var trackedEntityInstances = [];
        var teiDetails = [];
        //var selectedClassTeIs = [];
        //var finalSelectedTeIs = [];
        //var finalUniqueSelectedTeIs;
        //var teiAttributes = [];
        var displayTEIAttr = [];
        ApiService.getEvents(pram).then(
            (eventsResponse) => {
                eventsResponse.events.forEach(tempEvent => {
                    var teiAttributes = [];
                    ApiService.getProgramTEIAttribute(pram.programId).then(
                        (programAttributeResponse) => {
                            programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                                if (proTEIAttr.displayInList) {
                                    displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                                    teiAttributes.push(proTEIAttr.trackedEntityAttribute.displayName);
                                    //console.log( "attribute" , teiAttributes);
                                }
                            });
                            this.setState({
                                teiAttributeHeader: teiAttributes
                            });
                        }
                    );
                    if (tempEvent.dataValues !== undefined && tempEvent.dataValues.length > 0) {
                        tempEvent.dataValues.forEach(eventDataValue => {

                            if (eventDataValue.dataElement !== undefined && eventDataValue.value === selectedValues.optionCode) {
                                //trackedEntityInstances.push(tempEvent.trackedEntityInstance);
                                let tempTeiAttrObj = [];
                                ApiService.getTrackedEntityInstanceDetails(tempEvent.trackedEntityInstance).then(
                                    (teiResponse) => {
                                        teiResponse.enrollments.forEach(teiEnrollment => {
                                            if (teiEnrollment.program === pram.programId && teiEnrollment.status === 'ACTIVE') {
                                                tempTeiAttrObj["tei"] = teiEnrollment.trackedEntityInstance;
                                                tempTeiAttrObj["enrollment"] = teiEnrollment.enrollment;
                                                tempTeiAttrObj["orgUnit"] = teiEnrollment.orgUnit;
                                                tempTeiAttrObj["programStage"] = tempEvent.programStage;
                                                tempTeiAttrObj["trackedEntityType"] = teiEnrollment.trackedEntityType;
                                                tempTeiAttrObj["status"] = teiEnrollment.status;
                                                tempTeiAttrObj["checked"] = false;
                                                tempTeiAttrObj["programOwners"] = [...teiResponse.programOwners];
                                                tempTeiAttrObj["relationships"] = [...teiResponse.relationships];

                                                tempTeiAttrObj["attributes"] = [...teiResponse.attributes];


                                                //ApiService.getTrackedEntityInstance(teiEnrollment.trackedEntityInstance).then(
                                                //(enrollmentTeiResponse) => {
                                                teiResponse.attributes.forEach(attrb => {
                                                    if (displayTEIAttr[attrb.attribute]) {
                                                        tempTeiAttrObj[attrb.displayName] = attrb.value;
                                                    }
                                                });
                                                teiDetails.push(tempTeiAttrObj);
                                                //selectedClassTeIs = teiDetails.filter(tei => tei["Class"] === this.state.className );
                                                //finalSelectedTeIs = selectedClassTeIs.filter(tei => tei["Division"] === this.state.divisionName );



                                                //}
                                                //);
                                            }

                                        });

                                        //tempTeiAttrObj["attributes"] = [...teiResponse.attributes];
                                        //let selectedClassTeIs = teiDetails.filter(tei => tei["Class"] === this.state.className );
                                        //let finalSelectedTeIs = selectedClassTeIs.filter(tei => tei["Division"] === this.state.divisionName );

                                        //console.log('here is finalSelectedTeIs ', this.uniq(finalSelectedTeIs) );

                                        //let finalUniqueSelectedTeIs = [...new Set(finalSelectedTeIs)];
                                        let finalTeIs = [];
                                        for( let tei of teiDetails){

                                            if(!this.state.divisionList.length){
                                                for( let selectedClass of this.state.classList){
                                                    if(tei['Class'] === selectedClass.code){
                                                        finalTeIs.push(tei);
                                                    }
                                                }
                                            }
                                            if(!this.state.classList.length){
                                                for(let selectedDivision of this.state.divisionList){
                                                    if(tei["Division"]== selectedDivision.code){
                                                        finalTeIs.push(tei);
                                                    }
                                                }
                                            }
                                            //if(this.state.divisionList.length && this.state.classList.length){
                                                for( let selectedClass of this.state.classList){
                                                    for(let selectedDivision of this.state.divisionList){
                                                        if( (tei['Class'] === selectedClass.code) && (tei["Division"] === selectedDivision.code)){
                                                            finalTeIs.push(tei);
                                                        }
                                                    }
                                                }
                                            //}
                                        }
                                        let checkValue = [];
                                        let finalUniqueSelectedTeIs = [];
                                        finalTeIs.forEach((item, index) => {
                                            if(!checkValue[item.tei]){
                                                checkValue[item.tei]= true;
                                                finalUniqueSelectedTeIs.push(item);
                                            }
                                        });

                                        console.log('here is finalUniqueSelectedTeIs ', finalUniqueSelectedTeIs );

                                        this.setState({
                                            trackedEntityInstanceDetails: finalUniqueSelectedTeIs
                                        });
                                        console.log('here is trackedEntityInstanceDetails ',this.state.trackedEntityInstanceDetails );
                                    }

                                );

                            }

                        });
                        
                        //console.log( "trackedEntityInstances" , trackedEntityInstances);
                        //this.setState({
                        //    trackedEntityInstances:trackedEntityInstances
                        //});

                    }
                });
                /*
                 ApiService.getProgramTEIAttribute(pram.programId).then(
                 (programAttributeResponse) => {
                 programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                 if (proTEIAttr.displayInList){
                 displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                 teiAttributes.push( proTEIAttr.trackedEntityAttribute.displayName );
                 //console.log( "attribute" , teiAttributes);
                 }
                 });
                 //console.log( "teiAttributeHeader" , teiAttributes);
                 this.setState({
                 teiAttributeHeader:teiAttributes
                 });

                 this.state.trackedEntityInstances.forEach(tei => {
                 let tempTeiAttrObj = [];
                 ApiService.getTrackedEntityInstanceDetails(tei).then(
                 (teiResponse) => {
                 teiResponse.enrollments.forEach(teiEnrollment => {
                 if (teiEnrollment.program === pram.programId && teiEnrollment.status === 'ACTIVE'){
                 tempTeiAttrObj["tei"] = teiEnrollment.trackedEntityInstance;
                 tempTeiAttrObj["enrollment"] = teiEnrollment.enrollment;
                 tempTeiAttrObj["orgUnit"] = teiEnrollment.orgUnit;
                 tempTeiAttrObj["status"] = teiEnrollment.status;
                 tempTeiAttrObj["checked"] = false;
                 }
                 });
                 //tempTeiAttrObj["attributes"] = [...teiResponse.attributes];

                 teiResponse.attributes.forEach(attrb => {
                 if (displayTEIAttr[attrb.attribute]) {
                 tempTeiAttrObj[attrb.displayName] = attrb.value;
                 }

                 });

                 teiDetails.push(tempTeiAttrObj);
                 }
                 );
                 this.setState({
                 trackedEntityInstanceDetails: teiDetails
                 });
                 });

                 }
                 );
                 */


            },
            (error) => {
                console.log("here is seleted", error);
            });
        //alert("tei list");

    };

    uniq (array) {
    let filtered = []
    for (let i = 0; i < array.length; i++) {
        if (filtered.indexOf(array[i]) === -1) filtered.push(array[i])
    }
        return filtered
    }

    programChange(e) {
        let selPrgId = e.target.value;
        //alert( selPrgId );
        if (selPrgId !== undefined) {
            this.setState({
                programId: selPrgId,
                go: false,
                goButtonStatus: false,
                orgUnitId: this.props.selected.orgUnitId
            });

        }
    } ;

    optionChange(e) {
        let selOptionCode = e.target.value;
        if (selOptionCode !== undefined) {
            this.setState({
                optionCode: selOptionCode,
                go: false,
            });

        }
    } ;

    classChange(e) {
        let selClass = e.target.value;
        if (selClass !== undefined) {
            this.setState({
                className: selClass,
                go: false,
                goButtonStatus: false
            });
        }
    } ;

    divisionChange(e) {
        let selDivision = e.target.value;
        if (selDivision !== undefined) {
            this.setState({
                divisionName: selDivision,
                go: false
            });

        }
    } ;

    teiCheck(index) {
        //this.setState({buttonStatus : false});
        let changedTei = this.state.trackedEntityInstanceDetails;
        changedTei[index].checked = !changedTei[index].checked;
        document.querySelector("#checkbox-head").checked = false;
        this.setState({trackedEntityInstanceDetails: changedTei, check: false});

        if (changedTei[index].checked) {
            this.setState({closeEnrollmentButtonStatus: false});
            this.setState({newEnrollmentButtonStatus: false});
        }
        else {
            this.setState({closeEnrollmentButtonStatus: true});
            this.setState({newEnrollmentButtonStatus: true});
        }
        console.log("changedTei", changedTei)
    }

    checkedAllTei() {
        //this.setState({buttonStatus : false});
        var headCheckBox = document.querySelector("#checkbox-head").checked;
        let changedTei = this.state.trackedEntityInstanceDetails.map(teis => {
            teis.checked = headCheckBox;
            return teis;
        })
        var checkBox = document.querySelectorAll("input[type='checkbox']");
        checkBox.forEach(box => {
            box.checked = headCheckBox;
        })
        this.setState({trackedEntityInstanceDetails: changedTei, check: headCheckBox})

        if (headCheckBox) {
            this.setState({closeEnrollmentButtonStatus: false});
            this.setState({newEnrollmentButtonStatus: false});
        }
        else {
            this.setState({closeEnrollmentButtonStatus: true});
            this.setState({newEnrollmentButtonStatus: true});
        }
    }

    closeEnrollment() {
        let selectedTEI = this.state.trackedEntityInstanceDetails.filter(tei => tei.checked);
        selectedTEI.forEach(ele => {

            var nweAttributes = [];

            ele.attributes.forEach(attrb => {
                var nweAttributeValue = {};
                if(attrb.displayName === 'Class'){
                    nweAttributeValue.attribute = attrb.attribute;
                    nweAttributeValue.value = ele.Class;
                    nweAttributes.push(nweAttributeValue);
                }
                else if( attrb.displayName === 'Division' ){
                    nweAttributeValue.attribute = attrb.attribute;
                    nweAttributeValue.value = ele.Division;
                    nweAttributes.push(nweAttributeValue);
                }
                else{
                    nweAttributeValue.attribute = attrb.attribute;
                    nweAttributeValue.value = attrb.value;
                    nweAttributes.push(nweAttributeValue);
                }
            });

            //nweAttributes.push(nweAttributeValue);

            console.log('here is nweAttributes ',this.state.trackedEntityInstanceDetails,  nweAttributes );

            let enrollmentClose = {
                enrollment: ele.enrollment,
                orgUnit: ele.orgUnit,
                status: "COMPLETED",
                trackedEntityInstance: ele.tei,
                trackedEntityType: ele.trackedEntityType,
                program: this.state.programId

            };
            console.log("here is enrollment complete pay load", enrollmentClose);
            ApiService.updateEnrollmentStatus(enrollmentClose).then(result => {
                if (result.httpStatus === 'OK') {
                    //this.setState({ flag: true });
                    //this.setState({ go: false });
                    // for new enrollment
                    //   trackedEntityInstance update
                    let updateTrackedEntityInstance = {
                        trackedEntityInstance: ele.tei,
                        trackedEntityType: ele.trackedEntityType,
                        attributes: nweAttributes,
                        programOwners: [...ele.programOwners],
                        //enrollment: ele.enrollment,
                        inactive: false,
                        deleted: false,
                        orgUnit: ele.orgUnit,
                        program: this.state.programId
                    };

                    ApiService.newEnrollmentTEI(updateTrackedEntityInstance).then(teiResponse => {
                            if (teiResponse.httpStatus === 'OK') {

                                let newEnrollment = {
                                    orgUnit: ele.orgUnit,
                                    status: "ACTIVE",
                                    trackedEntityInstance: ele.tei,
                                    trackedEntityType: ele.trackedEntityType,
                                    program: this.state.programId
                                };
                                ApiService.createNewEnrollment(newEnrollment).then(enrollmentResponse => {
                                        if (enrollmentResponse.httpStatus === 'OK') {
                                            let newEvent = {
                                                trackedEntityInstance: ele.tei,
                                                orgUnit: ele.orgUnit,
                                                status: "SCHEDULE",
                                                enrollment: enrollmentResponse.response.importSummaries[0].reference,
                                                program: this.state.programId,
                                                programStage: ele.programStage
                                            };
                                            ApiService.postEvent(newEvent).then(postEventResponse => {
                                                if (postEventResponse.httpStatus == 'OK') {
                                                    this.setState({flag: true});
                                                }
                                            }, error => {
                                                // this.setState({ statusAlert: true, flag: true });
                                                console.log(error)
                                            });
                                        }
                                    },
                                    error => {
                                        // this.setState({ statusAlert: true, flag: true });
                                        console.log(error)
                                    });
                            }
                        },

                        error => {
                            // this.setState({ statusAlert: true, flag: true });
                            console.log(error)
                        });

                }
                //console.log("res", result)
            }, error => {
                // this.setState({ statusAlert: true, flag: true });
                console.log(error)
            });
        })

    }

    /*
     newEnrollment() {
     let selectedTEI = this.state.trackedEntityInstanceDetails.filter(tei => tei.checked);
     selectedTEI.forEach( ele => {

     var enrollmentClose = {
     enrollment: ele.enrollment,
     orgUnit: ele.orgUnit,
     status: "COMPLETED",
     trackedEntityInstance: ele.tei,
     trackedEntityType: ele.trackedEntityType,
     program: this.state.programId

     };
     console.log("here is enrollment complete pay load", enrollmentClose);
     ApiService.updateEnrollmentStatus(enrollmentClose).then(result => {
     if(result.httpStatus == 'OK'){
     this.setState({ flag: true });

     }
     console.log("res", result)
     }, error => {
     console.log(error)
     });
     })

     }
     */
    hideAlert() {
        //this.props.history.goBack();
        window.location.reload(false);
    }
    cencel() {
        this.setState({
            go: false,
            trackedEntityInstanceDetails: []
        });
    }

    reSetSelection() {
        //this.props.history.goBack();
        window.location.reload(false);
    }


    /*
    CahngedValue(e, tie, val) {
        //this.setState({
        //    trackedEntityInstanceDetails["Class"]
        //})
        console.log('here is before',this.state, e.target.value, tie, val)
        for (let teiID of this.state.trackedEntityInstanceDetails) {
            console.log(teiID)
            if (teiID["tei"] == tie && val == "Class") {
                teiID["Class"] = e.target.value;

            }
            if (teiID["tei"] == tie && val == "Division") {
                teiID["Division"] = e.target.value;
            }
        }
        console.log('here is after',this.state)

    }
    */
    newClassChange( e,teiUid, teiIndex){
        console.log('here is before',this.state, e.target.value, teiUid, teiIndex);
        let changedTei = this.state.trackedEntityInstanceDetails;
        changedTei[teiIndex].Class = e.target.value;

        console.log('here is after class ',this.state.trackedEntityInstanceDetails);
    }

    newDivisionChange( e,teiUid, teiIndex){
        console.log('here is before',this.state, e.target.value, teiUid, teiIndex);
        let changedTei = this.state.trackedEntityInstanceDetails;
        changedTei[teiIndex].Division = (e.target.value).toUpperCase();

        this.setState({trackedEntityInstanceDetails: changedTei});
        console.log('here is after Division ',this.state.trackedEntityInstanceDetails);
    }

    onSelectClass(selectedList, selectedItem) {
        this.setState({classList: selectedList});

    }
    onRemoveClass(selectedList, removedItem) {
        this.setState({classList: selectedList});

    }
    onSelectDivision(selectedList, selectedItem) {
        this.setState({divisionList: selectedList});

    }
    onRemoveDivision(selectedList, removedItem) {
        this.setState({divisionList: selectedList});

    }
    render() {
        //console.log('here is render',this.props);

        const getProgramList = () => {

            if (this.props.selected.programs === undefined) {
                let val = [""];
                return val;
            } else {
                // console.log(this.props.program);

                let tempList = [...this.props.selected.programs];
                let finalList = tempList.map((val, index) => (
                    <option key={index} value={val.id}>
                        {val.name}
                    </option>
                ));
                return finalList;
            }
        };
        const getOptionList = () => {
            if (this.state.optionList === undefined) {
                let val = [""];
                return val;
            } else {
                // console.log(this.props.program);
                let tempList = [...this.state.optionList];
                let finalList = tempList.map((val, index) => (
                    <option key={index} value={val.code}>
                        {val.displayName}
                    </option>
                ));
                return finalList;
            }
        };

        const getTEIList = () => {
            let checkBoxHead = this.state.check ? "UnSelect All" : "Select All";
            if (this.state.trackedEntityInstanceDetails.length > 0 )
            {
                return (
                        <Table>
                            <thead>

                            <tr>
                                <th>Sr. NO.</th>
                                {this.state.teiAttributeHeader.map((teiAttrName, index) => (
                                <th>{teiAttrName}</th>
                                    ))}

                                <th>New Class</th>
                                <th>New Division</th>
                                <th><input type="checkbox" id="checkbox-head" onClick={() => this.checkedAllTei()} />  {checkBoxHead}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.trackedEntityInstanceDetails.map((tei, teiIndex) => (
                            <tr>
                                <td>{teiIndex+1}</td>
                                {this.state.teiAttributeHeader.map((teiAttributeName, attrIndex) =>
                                  (<td>{tei[teiAttributeName]}</td>)
                                    )}

                                <td><Input type="text" value={this.state.newClassName} onBlur={(e)=>this.newClassChange(e,tei.tei,teiIndex )}/></td>
                                <td><Input type="text"  value={this.state.newDivisionName} onBlur={(e)=>this.newDivisionChange(e,tei.tei,teiIndex)}/></td>
                                <td> <input type="checkbox" onClick={() => this.teiCheck(teiIndex)} /> </td>
                            </tr>
                                ))}
                            <tr>
                                <td>
                                    <Button color="primary" disabled={this.state.closeEnrollmentButtonStatus} onClick={() =>this.closeEnrollment()}>Close/New Enrollment</Button>
                                </td>
                                {/*
                                <td>
                                    <Button color="primary" disabled={this.state.newEnrollmentButtonStatus} onClick={() =>this.newEnrollment()}>New Enrollment</Button>
                                </td>
                                */}
                                { this.state.flag ?
                                <SweetAlert
                                    success
                                    title="OK"
                                    onConfirm={this.hideAlert}
                                >
                                    Enrollment Push Success!
                                </SweetAlert> :null }
                            </tr>
                            </tbody>

                        </Table>)
            }
            if(this.state.trackedEntityInstanceDetails.length === 0){
                return ( <Table>
                    <thead>
                        <tr>
                            <td className ="col-md-4"><h2>Tracked Entity Instance not available</h2></td>
                        </tr>
                    </thead>
                </Table>)
            }
        };

return (

    <div className="main-div">
        <div className="p-5 shadow-lg p-3 mb-3 bg-white rounded box">

            <Row form>
                <Col className ="col-md-12" align="center">Enrollment Details</Col>
            </Row>
            <br />
            <Row form>
                <Col className ="col-md-4">Organisation Unit :</Col>
                <Col className ="col-md-4">
                    <Input type="text" value={this.props.selected.selectedOrg.displayName} />
                </Col>
            </Row>
            <br />
            <Row form>
                <Col className ="col-md-4">Program :</Col>
                <Col className ="col-md-4">
                    <Input
                        type="select"
                        name="select"
                        id="programSelect"
                        onChange={this.programChange}>
                        {getProgramList()}
                    </Input>
                </Col>
            </Row>
            <br />
            <Row form>
                <Col className ="col-md-4">School Name :</Col>
                <Col className ="col-md-4">
                    <Input
                        type="select"
                        name="select"
                        id="schoolSelect"
                        onChange={this.optionChange}>
                        {getOptionList()}
                    </Input>
                </Col>
            </Row>
            <br />
            <Row form>
                <Col className ="col-md-2">Class :</Col>
                <Col className ="col-md-3">
                    <Multiselect
                        options={this.state.classOptionList} // Options to display in the dropdown
                        onSelect={this.onSelectClass} // Function will trigger on select event
                        onRemove={this.onRemoveClass} // Function will trigger on remove event
                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                        displayValue="displayName" // Property name to display in the dropdown options
                    />
                </Col>
                <Col className ="col-md-2" >Division :</Col>
                <Col className ="col-md-3" >
                    <Multiselect
                        options={this.state.divisionOptionList} // Options to display in the dropdown
                        onSelect={this.onSelectDivision} // Function will trigger on select event
                        onRemove={this.onRemoveDivision} // Function will trigger on remove event
                        selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                        displayValue="displayName" // Property name to display in the dropdown options
                    />

                </Col>
                <Col className ="col-md-1">
                    <Button color="primary" disabled={this.state.goButtonStatus} onClick={() =>this.getTrackedEntityInstanceList()}>Go</Button>
                </Col>

                <Col className ="col-md-1">
                    <Button color="primary"  onClick={() =>this.reSetSelection()}>Cencel</Button>
                </Col>

            </Row>
            <br />
            <Row form>
                <div >{
                    this.state.go ?
                    <div>
                        <div>{getTEIList()}</div>
                    </div> : ""
                    }
                </div>
            </Row>

        {/*
         style={{display: 'none'}}
 <tr>
 <td>{index+1}</td>
 {this.state.teiAttributeHeader.map((teiAttributeName, index) =>{
 if(teiAttributeName =="Class" ) return ( <td><input
 type="text"  onChange={(e)=>this.CahngedValue(e,tei.tei, teiAttributeName)}
 value={tei[teiAttributeName]}/></td>)
 else if( teiAttributeName == "Division") return ( <td><input
 type="text" onChange={(e)=>this.CahngedValue(e,tei.tei, teiAttributeName)}
 value={tei[teiAttributeName]} /></td>)
 else
 return  (<td>{tei[teiAttributeName]}</td>)
 })}

 <td><Input type="text" id="newClass" value={this.state.newClassName} onChange={(e)=>this.newClassChange(e,tei.tei, teiAttributeName)}/></td>
 <td><Input type="text" id = "newDivision" value={this.state.newDivisionName} onChange={(e)=>this.neDivisionChange(e,tei,teiAttributeName)}/></td>
 <td> <input type="checkbox" onClick={() => this.teiCheck(index)} /> </td>
 </tr>
*/}

</div>
</div>)
}
}
export  default Enrollment