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
      class: [{id: 6, class: '6'},{id: 7, class: '7'},{id: 8, class: '8'},{id: 9, class: '9'},{id: 10, class: '10'}, {id: 11, class: '11'},{id: 12, class: '12'}],
      division: [{id: 1, division: "A"},{id: 2, division: "B"},{id: 3, division: "C"},{id: 4, division: "D"},{id: 5, division: "E"}],    // value2:""
      classList: [],
      classSection: []
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
    this.onSelectClass =this.onSelectClass.bind(this);
    this.onRemoveClass = this.onRemoveClass.bind(this);
    this.onSelectSection= this.onSelectSection.bind(this);
    this.onRemoveSection=this.onRemoveSection.bind(this);
  }
  componentDidMount() {

    $(".row").hide();
  }
  onSelect(selected) {
    $(".loaderPosition").hide();
    $(".row").show();
    let id = selected.id;
    if (id != undefined) {
      this.getPrograms(selected);
      
    }
  }
  getPrograms(selected) {
    var id = selected.id;
    var name = selected.displayName;
    ApiService.getProgram(id).then(
      (result) => {
        var program = result.programs
        if (program.length > 0) {
          var programId = program[0].id;
          if (programId != undefined) {
            ApiService.getProgramDetials(programId).then(res => {
              var programStage = res.programStages;
              if (programStage.length > 0) {
                if (programStage.length > 0) {
                  var programStageId = programStage[0].id;
                  var programStageSection = programStage[0].programStageSections;
                  let pram = {
                    program: programId,
                    ou: id
                  }
                  var arr = [];
                  var teiAttributes = [];
                  var displayTEIAttr = [];
                  ApiService.getTrackedEntityInstance(pram).then(
                    (response) => {
                      ApiService.getProgramTEIAttribute(pram.program).then(
                          (programAttributeResponse) => {
                            programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                              if (proTEIAttr.displayInList){
                                displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                                teiAttributes.push( proTEIAttr.trackedEntityAttribute.displayName );
                              }
                            });
                            this.setState({
                              teiAttributeHeader:teiAttributes
                            })

                            response.trackedEntityInstances.forEach(tei => {
                              let obj = []
                              obj["tei"] = tei.trackedEntityInstance;
                              obj["checked"] = false;
                              tei.attributes.forEach(attr => {
                                if (displayTEIAttr[attr.attribute]) {
                                  obj[attr.displayName] = attr.value;
                                }

                              });
                              arr.push(obj);

                            })
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
                            });
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
  }
  handleChange(e) {
    var id = e.target.value;
    if (id !== undefined) {
      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          if (programStage.length > 0) {
            var programStageId = programStage[0].id;
            let pram = {
              program: id,
              ou: this.state.orgUnitId
            };
            var arr = [];
            var teiAttributes = [];
            var displayTEIAttr = [];
            ApiService.getTrackedEntityInstance(pram).then(
              (response) => {
                ApiService.getProgramTEIAttribute(pram.program).then(
                    (programAttributeResponse) => {
                      programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
                        if (proTEIAttr.displayInList){
                          displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
                          teiAttributes.push( proTEIAttr.trackedEntityAttribute.displayName );
                        }

                      });
                      this.setState({
                        teiAttributeHeader:teiAttributes
                      });

                      response.trackedEntityInstances.forEach(tei => {
                        let obj = [];

                        obj["tei"] = tei.trackedEntityInstance;
                        obj["checked"] = false;

                        tei.attributes.forEach(attr => {
                          if (displayTEIAttr[attr.attribute]) {
                            obj[attr.displayName] = attr.value;
                          }
                        });

                        arr.push(obj);

                      });
                    }
                );

              },
              (error) => {
                console.log("here is seleted", error);
              }
            );

            ApiService.getDataElements(programStageId).then(result => {
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
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
  }
  onChange = date => this.setState({ date })
  
  checkNumber(index1, index2, e) {
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
  }
  checkBoxStatus(index1, index2, e){
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.checked;
    this.setState({ dataValues: dataValues})

  }
  changeRadioBtn(index1, index2, e){
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
  }
  EventPass() {
    let date = JSON.stringify(this.state.date);
    let fdate = date.substring(1, date.length - 1);
     let TeiVal= [];
     for( let tei of this.state.tei){
      if(!this.state.classSection.length && !this.state.classList.length){
        TeiVal.push(tei);   
      }
      if(!this.state.classSection.length){
       for( let selectedClass of this.state.classList){
          if(tei['Class'] == selectedClass.class){
            TeiVal.push(tei);
          }
        }
       }
       if(!this.state.classList.length){
        for(let selectedDivision of this.state.classSection){
          if(tei["Division"]== selectedDivision.division){
            TeiVal.push(tei);
          }
        }
       }
       for( let selectedClass of this.state.classList){
         for(let selectedDivision of this.state.classSection){
           if( (tei['Class'] == selectedClass.class) && (tei["Division"]== selectedDivision.division)){
             TeiVal.push(tei);
           }
          
         }
       }
     }
    let payload = {
      orgUnitId: this.state.orgUnitId,
      programStageId: this.state.programStageId,
      programId: this.state.programId,
      eventDate: fdate,
      status: "ACTIVE",
      tei: TeiVal,
      teiAttributeHeader: this.state.teiAttributeHeader

    }
    let data = [];
    let event = this.state.dataValues
    event.forEach(element => {
      element.dataElements.forEach(val => {
        if (val.value !== undefined) {
          let id = val.id;
          let valu = val.value
          let dVal = { dataElement: id, value: valu,providedElsewhere:false };
          data.push(dVal)
        }
      })
    })
    payload['dataValues'] = data;
    payloadService.passpayload(payload);
    // localStorage.setItem("payload", JSON.stringify(payload));
    this.setState({payload: payload})
  }

onSelectClass(selectedList, selectedItem) {
  this.setState({classList: selectedList});

}

onRemoveClass(selectedList, removedItem) {
  this.setState({classList: selectedList});

}
onSelectSection(selectedList, selectedItem) {
  this.setState({classSection: selectedList});

}

onRemoveSection(selectedList, removedItem) {
  this.setState({classSection: selectedList});

}
  render() {
    const programStageDataElement =this.state.porgramStageDateElement
    const optionVal = () => {
      if (this.state.program === undefined) {
        let val = [""];
        return val;
      } else {
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
      <div className="row">
        <div className="sidebar font sidebars">
          <OrgUnitTree
            onSelect={this.onSelect}
            onError={onError}
          />
        </div>
        <div className="main-div">
          <div className="p-5 shadow-lg p-3 mb-3 bg-white rounded box">
            <Row form>
              <Col className ="col-md-4">Organisation Unit :</Col>
              <Col className ="col-md-8">
                <Input type="text" defaultValue={this.state.name} />
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
          </div>
          <Row form>
            <div className='p-5 shadow-lg p-3 mb-3 bg-white rounded box font col-md-12'>
             <Row form>
              <Col className ="col-md-3">Class :</Col>
              <Col className ="col-md-3"> 
               <Multiselect
                options={this.state.class} // Options to display in the dropdown
                onSelect={this.onSelectClass} // Function will trigger on select event
                onRemove={this.onRemoveClass} 
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                displayValue="class" // Property name to display in the dropdown options
                />
                </Col>
              <Col className ="col-md-3">Division: </Col>
              <Col className ="col-md-3">
              <Multiselect
                options={this.state.division} // Options to display in the dropdown
                onSelect={this.onSelectSection} // Function will trigger on select event
                onRemove={this.onRemoveSection} 
                selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                displayValue="division" // Property name to display in the dropdown options
                />
              </Col>
             </Row>
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
      </div>
    </>
    );
  }
}
export default withRouter(DynamicData);