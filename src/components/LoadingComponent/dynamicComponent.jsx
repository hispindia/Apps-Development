import React, { PureComponent } from 'react';
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { ApiService } from '../../services/apiService'
import { withRouter, NavLink } from "react-router-dom";
import DatePicker from "react-date-picker";
import { Col, Row, Input, Button } from "reactstrap";
import { payloadService } from '../../services/dataService';
import Loader from 'react-loader-spinner';
import $ from "jquery";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './loadingCom.css'
import  Enrollment  from './Enrollment';
import { Multiselect } from 'multiselect-react-dropdown';

const onError = error => console.error(error)
class DynamicData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      orgUnitId: '',
      program: "",
      programStage: '',
      programStageId: '',
      programSection: '',
      date: new Date(),
      error: null,
      dataValues: [],
      tei: [],
      dataElementStatus: true,
      loader: true,
      Error: false,
      teiAttributeHeader: [],
      secondPage: false,
      selectedOrg: '',
      programs:[],
      classOptionList: [],
      divisionOptionList: [],
      classList: [],
      divisionList: [],
      enrollmentDate: new Date(),
      youthGroupOptionList: [],
      youthGroupList: []
      // value2:""
    }
    this.onSelect = this.onSelect.bind(this);
    this.EventPass = this.EventPass.bind(this);
    this.checkNumber =this.checkNumber.bind(this);
    this.changeRadioBtn =this.changeRadioBtn.bind(this);
    this.getPrograms = this.getPrograms.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleChangess = this.handleChangess.bind(this);
    this.checkBoxStatus =this.checkBoxStatus.bind(this);
    this.goSecondPage =this.goSecondPage.bind(this);
    this.onSelectClass =this.onSelectClass.bind(this);
    this.onRemoveClass = this.onRemoveClass.bind(this);
    this.onSelectDivision= this.onSelectDivision.bind(this);
    this.onRemoveDivision=this.onRemoveDivision.bind(this);
    this.onSelectYouthGroup= this.onSelectYouthGroup.bind(this);
    this.onRemoveYouthGroup=this.onRemoveYouthGroup.bind(this);

  }
  componentDidMount() {

    $(".row").hide();

    $(".cseSchool").hide();
    $(".youthGroup").hide();
    let classOptionSetUid = 'McLlu7elDpJ';
    let divisionOptionSetUid = 'uTXQe0NS3ra';
    let youthGroupOptionSetUid = 'WpYVPWMLVux';

    this.getClassOptions(classOptionSetUid);
    this.getDivisionOptions(divisionOptionSetUid);
    this.getYouthGroupOptions(youthGroupOptionSetUid);


  }
  onSelect(selected) {
    this.setState({selectedOrg: selected})
    $(".loaderPosition").hide();
    $(".row").show();
    let id = selected.id;
    if (id != undefined) {
      this.getPrograms(selected);
      // console.log("here is the data", selected);
      //this.props.history.push(`${selected.path}`)
    }
  }
  getPrograms(selected) {
    var id = selected.id;
    var name = selected.displayName;
    ApiService.getProgram(id).then(
      (result) => {
        //var program = result.programs
        let program = [];
        result.programs.forEach(tempProgram => {
          if (!tempProgram.withoutRegistration) {

            //let val = tempProgram.attributeValues.length;
            for (let i=0;i<tempProgram.attributeValues.length;i++) {

              if( tempProgram.attributeValues.length!==0) {
                if (tempProgram.attributeValues[i].attribute.code === 'cse_app_access'
                    && tempProgram.attributeValues[i].value === "true") {
                  program.push(tempProgram);
                }
              }
            }
          }
        });

        this.setState({programs:program})
        if (program.length > 0) {
          var programId = program[0].id;
          if (programId != undefined) {

            if(programId === 'byYVkNvOt2R'){
              $(".cseSchool").hide();
              $(".youthGroup").show();
            }
            else if(programId === 'dWPcV6EiVB1'){
              $(".cseSchool").show();
              $(".youthGroup").hide();
            }

            ApiService.getProgramDetials(programId).then(res => {
              var programStage = res.programStages;
              console.log('here is data', res)
              if (programStage.length > 0) {
                if (programStage.length > 0) {
                  var programStageId = programStage[0].id;
                  var programStageSection = programStage[0].programStageSections;
                  // console.log("here programStageSection", programStageSection, porgramStageDateElement)
                  let pram = {
                    program: programId,
                    ou: id
                  };
                  var arr = [];
                  var teiAttributes = [];
                  var displayTEIAttr = [];
                  ApiService.getTrackedEntityInstances(pram).then(
                    (response) => {
                      ApiService.getProgramTEIAttribute(pram.program).then(
                          (programAttributeResponse) => {
                            programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                              if (proTEIAttr.displayInList){
                                displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                                teiAttributes.push( proTEIAttr.trackedEntityAttribute.displayName );
                                console.log( "attribute" , teiAttributes);
                              }
                            });
                            console.log( "teiAttributeHeader" , teiAttributes);
                            this.setState({
                              teiAttributeHeader:teiAttributes
                            });

                            console.log('here is tei', response);
                            response.trackedEntityInstances.forEach(tei => {
                              let tempEnrollments = tei.enrollments;
                              let obj = [];
                              //obj["Student/Youth group ID"] = "";
                              //obj["Age (In Years)"] = "";
                              obj["tei"] = tei.trackedEntityInstance;
                              obj["enrollmentDate"] = tempEnrollments[0].enrollmentDate.substring(0, 10);
                              obj["checked"] = false;

                              //obj["Student Roll No."] = "";
                              //var neededAttr = [];
                              //neededAttr["Iuzv5U8feq2"] = true; //Student/Youth group ID
                              //neededAttr["tsBbDQe3sGo"] = true; //Name
                              //neededAttr["MaBiIrJDIWA"] = true; //Gender
                              //neededAttr["N48JExn2s73"] = true; //Gender
                              //neededAttr["aSpasplLgMf"] = true; //Age (In Years)
                              //neededAttr["mkHRXzHJuvn"] = true; //Student Roll No.
                              //neededAttr["vAxn2PGzIrA"] = true; //Class
                              //neededAttr["pbJoXwUS8b9"] = true; //Division
                              tei.attributes.forEach(attr => {
                                if (displayTEIAttr[attr.attribute]) {
                                  obj[attr.displayName] = attr.value;
                                }

                              });
                              //obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");


                              arr.push(obj);

                            });
                            this.setState({
                              name: name,
                              orgUnitId: id,
                              program: program,
                              programId: programId,
                              programStage: programStage,
                              programStageId: programStageId,
                              programSection: programStageSection,
                              tei: arr,
                              loader: false,
                              //teiAttributeHeader:teiAttributes
                            });
                            //  this.setState({ tei: arr })
                            //  console.log(response)
                          }
                      );

                    },
                    (error) => {
                      console.log("here is seleted", error);
                    })
                }
              }

            });
          }
        }
      },
      (error) => {
        console.log("here is error", error);
      }
    )
    // console.log("here is default", this.state);
  }
  handleChange(e) {
    var id = e.target.value;
     console.log("here is default",id);
    if (id !== undefined) {
      if(id === 'byYVkNvOt2R'){
        $(".cseSchool").hide();
        $(".youthGroup").show();
      }
      else if(id === 'dWPcV6EiVB1'){
        $(".cseSchool").show();
        $(".youthGroup").hide();
      }
      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          console.log("here is seleted", result.programStages);
          if (programStage.length > 0) {
            var programStageId = programStage[0].id;
            let pram = {
              program: id,
              ou: this.state.orgUnitId
            };
            var arr = [];
            var teiAttributes = [];
            var displayTEIAttr = [];
            ApiService.getTrackedEntityInstances(pram).then(
              (response) => {
                ApiService.getProgramTEIAttribute(pram.program).then(
                    (programAttributeResponse) => {
                      programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                        if (proTEIAttr.displayInList){
                          displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                          teiAttributes.push( proTEIAttr.trackedEntityAttribute.displayName );
                          //console.log( "attribute" , teiAttributes);
                        }

                      });
                      //console.log( "displayTEIAttr" , displayTEIAttr);
                      this.setState({
                        teiAttributeHeader:teiAttributes
                      });

                      //console.log('here is tei', response);
                      response.trackedEntityInstances.forEach(tei => {
                        let tempEnrollments = tei.enrollments;
                        let obj = [];
                        obj["enrollmentDate"] = tempEnrollments[0].enrollmentDate.substring(0, 10);
                        obj["tei"] = tei.trackedEntityInstance;
                        obj["checked"] = false;

                        //console.log( tei.trackedEntityInstance + " -- "  +  tei.attributes + " -- " + displayTEIAttr );
                        tei.attributes.forEach(attr => {
                          console.log( tei.trackedEntityInstance + " -- "  +  attr.attributes + " -- " + displayTEIAttr );
                          if (displayTEIAttr[attr.attribute]) {
                            obj[attr.displayName] = attr.value;

                            //console.log( tei.trackedEntityInstance + " -- "  +  attr.displayName );
                          }
                        });

                        arr.push(obj);

                      });
                      //  this.setState({ tei: arr })
                      //  console.log(response)
                    }
                );

              },
              (error) => {
                console.log("here is seleted", error);
              }
            );

            ApiService.getDataElements(programStageId).then(result => {
              // console.log("ok", result.programStageSections)
              this.setState({
                programId: id,
                programStage: programStage,
                programStageId: programStageId,
                programSection: result.programStageSections,
                tei: arr,

              })
            })
          }
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
  }
  handleChanges(e) {
    var id = e.target.value;
    if (id !== undefined) {
      ApiService.getDataElements(id).then(
        result => {
          //  console.log("here is seleted", result.programStageSections);
          this.setState({
            programStageId: id,
            programSection: result.programStageSections,
          });
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
  }
  handleChangess(index1, index2, e) {
   console.log(index1, index2, e.target.value)
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
  }
  onChange = date => this.setState({ date });

  onChangeEnrollmentDate = enrollmentDate => this.setState({ enrollmentDate });


  
  checkNumber(index1, index2, e) {
    console.log('here is option changed',index1, index2, e.target.value)
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    const re = /^[a-z\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({Error: true})
      // this.setState({value2:e.target.value})
    }
  }
  checkText(index1, index2, e){
    console.log('here is option changed',index1, index2, e.target.value)
     let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({Error: true})
    }
  }
  optionChange(index1, index2, e) {
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    console.log('here is option changed',index1, index2, e.target.value);
  }
  checkBoxStatus(index1, index2, e){
    let dataValues = this.state.programSection;
    //let checkBoxValue = "";
    //if( e.target.checked){
    //  checkBoxValue = 'true';
    //}
    dataValues[index1]["dataElements"][index2]["value"] = e.target.checked;
    this.setState({ dataValues: dataValues})
    console.log('here is option changed',index1, index2, e.target.checked)

  }
  changeRadioBtn(index1, index2, e){
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    console.log('here is option changed',index1, index2, e.target.value)
  }
  EventPass() {
    let date = JSON.stringify(this.state.date);
    let eventDate = date.substring(1, date.length - 1);
     console.log('here is date', this.state)

    //alert( this.state.enrollmentDate );
    //let enrollmentD = JSON.stringify(this.state.enrollmentDate);

    //alert( enrollmentD );
    //let enrollmentDate = enrollmentD.substring(1, enrollmentD.length - 1);
    //let enrollmentDate = enrollmentD.substring(0, 10);


    let tempConvertDate = new Date(this.state.enrollmentDate);
    //alert( tempConvertDate );
    let enrollmentDate = "";
    let selMonth = Number(tempConvertDate.getMonth() + 1);
    if( selMonth.toString().length === 1 ){
      enrollmentDate = tempConvertDate.getFullYear() +"-0" + selMonth +"-"+ tempConvertDate.getDate();
    }
    else{
      enrollmentDate = tempConvertDate.getFullYear() +"-" + selMonth +"-"+ tempConvertDate.getDate();
    }

    //alert(tempConvertDate.getFullYear() +"-" + Number(tempConvertDate.getMonth() + 1) +"-"+ tempConvertDate.getDate() );

    //alert( enrollmentDate + "--" + enrollmentDate.length);
    let filteredTEI= [];

    /*
    if(id === 'byYVkNvOt2R'){
      $(".cseSchool").hide();
      $(".youthGroup").show();
    }
    else if(this.state.programId === 'dWPcV6EiVB1'){
      $(".cseSchool").show();
      $(".youthGroup").hide();
    }
    */

    if(this.state.programId === 'dWPcV6EiVB1' ) {
      for (let tei of this.state.tei) {
        if (!this.state.divisionList.length && !this.state.classList.length) {
          filteredTEI.push(tei);
        }
        if (!this.state.divisionList.length) {
          for (let selectedClass of this.state.classList) {
            if (tei['Class'] === selectedClass.code) {
              filteredTEI.push(tei);
            }
          }
        }
        if (!this.state.classList.length) {
          for (let selectedDivision of this.state.divisionList) {
            if (tei["Division"] === selectedDivision.code) {
              filteredTEI.push(tei);
            }
          }
        }
        for (let selectedClass of this.state.classList) {
          for (let selectedDivision of this.state.divisionList) {
            if ((tei['Class'] === selectedClass.code) && (tei["Division"] === selectedDivision.code)) {
              filteredTEI.push(tei);
            }

          }
        }
      }
    }
    else if(this.state.programId === 'byYVkNvOt2R' ) {
      for (let tei of this.state.tei) {
        if (!this.state.youthGroupList.length && !this.state.enrollmentDate) {
          filteredTEI.push(tei);
        }
        if (!this.state.youthGroupList.length) {
          if (tei['enrollmentDate'] === enrollmentDate) {
            filteredTEI.push(tei);
          }
        }
        if (!this.state.enrollmentDate) {
          for (let selectedYouthGroup of this.state.youthGroupList) {
            if (tei["Youth Group"] === selectedYouthGroup.code) {
              filteredTEI.push(tei);
            }
          }
        }
        for (let selectedYouthGroup of this.state.youthGroupList) {
          if (tei["Youth Group"] === selectedYouthGroup.code && tei['enrollmentDate'] === enrollmentDate) {
            filteredTEI.push(tei);
          }
        }
      }
    }

    else{
      filteredTEI = [...this.state.tei];
    }
    let payload = {
      orgUnitId: this.state.orgUnitId,
      programStageId: this.state.programStageId,
      programId: this.state.programId,
      eventDate: eventDate,
      status: "ACTIVE",
      tei: filteredTEI,
      teiAttributeHeader: this.state.teiAttributeHeader

    }
    let dataValue = [];
    let event = this.state.dataValues
    event.forEach(element => {
      element.dataElements.forEach(val => {
        if (val.value !== undefined) {
          let id = val.id;
          let tempValue = val.value
          let dVal = { dataElement: id, value: tempValue, providedElsewhere:false };
          dataValue.push(dVal)
        }
        //  console.log('here is me', data)
      })
    })
    payload['dataValues'] = dataValue;
    payloadService.passpayload(payload);
    this.setState({payload: payload})
     console.log("payload", payload)
  }
  goSecondPage() {
    this.setState({secondPage: true})
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

  getYouthGroupOptions(optionSetUid) {
    let youthGroupOptions = '';
    ApiService.getOptionSetOptions(optionSetUid).then(
        (optionsResponse) => {
          youthGroupOptions = optionsResponse.options;
          this.setState({
            youthGroupOptionList: youthGroupOptions
          });
        },
        (error) => {
          console.log("here is error", error);
        }
    )
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

  onSelectYouthGroup(selectedList, selectedItem) {
    this.setState({youthGroupList: selectedList});

  }
  onRemoveYouthGroup(selectedList, removedItem) {
    this.setState({youthGroupList: selectedList});

  }


  render() {
    const programStageDataElement =this.state.porgramStageDateElement
     console.log("state",this.state)
    const optionVal = () => {
      if (this.state.program === undefined) {
        let val = [""];
        return val;

      } else {
        // console.log(this.props.program);
        let a = [...this.state.program];
        let b = a.map((val, index) => (
          <option key={index} value={val.id}>
            {val.name}
          </option>
        ));
        return b;
      }
    };
    const optionVals = () => {
      if (this.state.programStage === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.state.programStage]
        console.log('here is a',a)
        let b = a.map((val, index) => <option key={index} value={val.id}> {val.displayName} </option>)
        return b;
      }
    }
    const sectionHeader = () => {
      if (this.state.programSection === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.state.programSection];
        let b = a.map((val, index1) =>
          <>
          <div>
            <h6 key={index1}>{val.name}</h6>
            <br />
            <Row>
              {val.dataElements.map((ele, index2) => {
                if (ele.optionSetValue && ele.valueType === 'TEXT') {
                  return (
                    <>
                      <Col md={3}><div className="font">{ele.displayFormName}</div></Col>
                        <Col md={3}>
                          <Input type="select" name="select" id="exampleSelect" onChange={ (e) =>this.optionChange(index1, index2, e)} >
                            {ele.optionSet.options.map(opt =>
                              <>
                               <option selected hidden>Please Select Option</option>
                                <option value={opt.code}>{opt.name}</option>
                              </>
                            )}
                          </Input>
                          <br />
                        </Col>
                      <br />
                   </>)
                } else {
                  if (ele.valueType === 'BOOLEAN'){
                       return (
                        <>
                        <Col md={3}><div className="font">{ele.displayFormName}</div></Col>
                        <Col md={3}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                          <Input type="radio" value = "true" name={ele.id} onChange={(e)=>this.changeRadioBtn(index1, index2, e)} /> Yes &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                          <Input type="radio" value = "false" name={ele.id} onChange={(e)=>this.changeRadioBtn(index1, index2, e)} />  No
                         
                         <br />
                         <br />
                         </Col>
                         </>
                       )
                  }
                  if (ele.valueType === 'DATE'){
                    return (
                     <>
                     <Col md={3}><div className="font">{ele.name}</div></Col>
                     <Col md={3}>
                     <DatePicker value={this.state.date} />
                     <br />
                     </Col>
                      </>
                    )
                 }
                 if (ele.valueType === 'TRUE_ONLY'){
                  return (
                   <>
                   <Col md={3}><div className="font">{ele.name}</div></Col>
                   <Col md={3}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   <Input type="checkbox" onChange={(e)=>this.checkBoxStatus(index1, index2, e)} />
                    <br />
                    <br />
                   </Col>
                    </>
                  )
               }
                if (ele.valueType === 'INTEGER_ZERO_OR_POSITIVE'){
                  return (
                  <>
                  <Col md={3}><div className="font">{ele.name}</div></Col>
                  <Col md={3}>
                    <Input type=""  onChange={(e) => this.checkNumber(index1, index2, e)} placeholder={ele.valueType}  />
                    {this.state.Error ? <div className="help-block">Please Enter zero and Positive value Only</div>: null}
                  <br />
                  </Col>
                    </>
                  )}
                  if (ele.valueType === 'TEXT' && !ele.optionSetValue){
                    return (
                    <>
                    <Col md={3}><div className="font">{ele.name}</div></Col>
                    <Col md={3}>
                      <Input type="" onChange={(e) => this.checkText(index1, index2, e)} placeholder={ele.valueType} />
                      {this.state.Error ? <div className="help-block">Please Enter text only</div>: null}
                    <br />
                    </Col>
                      </>
                    )}
                  return(
                    <>
                     <Col md={3}><div className="font">{ele.name}</div></Col>
                    <Col md={3}> 
                    <Input type={ele.valueType} placeholder={ele.valueType} onChange={(e) => this.handleChangess(index1, index2, e)} />
                    <br />
                    </Col>
                    </>
                  )
                }
              })}
              <br />
            </Row>
            <br />
            </div>
          </>
        )
        return b;
      }
    }
    return (<>
      <div className='loaderPosition'><Loader
        type="Oval"
        color="#00BFFF"
        height={150}
        width={150}
      />
      </div>
        <br /><Button  onClick={e =>this.goSecondPage()}>Enrollment Details</Button>
      <div className="row">
        <div className="sidebar font sidebars">
          <OrgUnitTree
            onSelect={this.onSelect}
            onError={onError}
          />
        </div>
        {this.state.secondPage ? < Enrollment  selected={this.state}  /> :  <div className="main-div">

          <div>
            <div className="p-5 shadow-lg p-3 mb-3 bg-white rounded box">
              <Row form>
                <Col className ="col-md-12" align="center">Event Details</Col>
              </Row>
              <br />
              <Row form>
                <Col className ="col-md-4">Organisation Unit :</Col>
                <Col className ="col-md-8">
                  <Input type="text" value={this.state.name} />
                </Col>
              </Row>
              <br />
              <Row form>
                <Col className ="col-md-4"> Program : </Col>
                <Col className ="col-md-8">
                  <Input
                      type="select"
                      name="select"
                      id="exampleSelect"
                      onChange={this.handleChange}
                  >
                    {optionVal()}
                  </Input>
                </Col>
              </Row>
              <br />
              <Row form>
                <Col className ="col-md-4">Program Stage : </Col>
                <Col className ="col-md-8">
                  <Input type="select" name="select" id="exampleSelect" onChange={this.handleChanges}>
                    {optionVals()}
                  </Input>
                </Col>
              </Row>
              <br />
              <Row form>
                <Col className ="col-md-4">Event Date :</Col>
                <Col className ="col-md-8"><DatePicker onChange={this.onChange} value={this.state.date} /></Col>
              </Row>
              <br />
              <Row form className = "cseSchool">
                <Col className ="col-md-4">Class :</Col>
                <Col className ="col-md-3">
                  <Multiselect
                      options={this.state.classOptionList} // Options to display in the dropdown
                      onSelect={this.onSelectClass} // Function will trigger on select event
                      onRemove={this.onRemoveClass} // Function will trigger on remove event
                      selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                      displayValue="displayName" // Property name to display in the dropdown options
                  />
                </Col>
                <Col className ="col-md-2">Division: </Col>
                <Col className ="col-md-3">
                  <Multiselect
                      options={this.state.divisionOptionList} // Options to display in the dropdown
                      onSelect={this.onSelectDivision} // Function will trigger on select event
                      onRemove={this.onRemoveDivision} // Function will trigger on remove event
                      selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                      displayValue="displayName" // Property name to display in the dropdown options
                  />
                </Col>
              </Row>
              <Row form className = "youthGroup">
                <Col className ="col-md-4">Youth Group :</Col>
                <Col className ="col-md-3">
                  <Multiselect
                      options={this.state.youthGroupOptionList} // Options to display in the dropdown
                      onSelect={this.onSelectYouthGroup} // Function will trigger on select event
                      onRemove={this.onRemoveYouthGroup} // Function will trigger on remove event
                      selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                      displayValue="displayName" // Property name to display in the dropdown options
                  />
                </Col>
                <Col className ="col-md-2">Enrollment Date: </Col>
                <Col className ="col-md-3"><DatePicker onChange={this.onChangeEnrollmentDate} value={this.state.enrollmentDate} /></Col>
              </Row>
            </div>
            <Row form>
              <div className='p-5 shadow-lg p-3 mb-3 bg-white rounded box font col-md-12'>
                <br />
                <Col>{sectionHeader()}</Col>
                <br />
                <Col sm={{ size: 10, offset: 11 }}>
                  <NavLink className="nav-link" to="/eventDetailPage">
                    <Button color="primary" onClick={this.EventPass}>Go</Button>
                  </NavLink>
                </Col>
              </div>
            </Row>
          </div>
        </div> }
      </div>
    </>
    );
  }
}
export default DynamicData;