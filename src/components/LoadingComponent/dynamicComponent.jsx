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
      // console.log("here is the data", selected);
      //this.props.history.push(`${selected.path}`)
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
              console.log('here is data', res)
              if (programStage.length > 0) {
                if (programStage.length > 0) {
                  var programStageId = programStage[0].id;
                  var programStageSection = programStage[0].programStageSections;
                  // console.log("here programStageSection", programStageSection, porgramStageDateElement)
                  let datas = {
                    program: programId,
                    ou: id
                  }
                  var arr = [];
                  ApiService.getTrackedEntityInstance(datas).then(
                    (response) => {
                      console.log('here is tei', response);
                      response.trackedEntityInstances.forEach(tei => {
                        let obj = {
                          tei: "",
                          Name: "",
                          Gender: "",
                          checked: false
                        };
                        obj["Project Donor"] = ""
                        obj["tei"] = tei.trackedEntityInstance
                        var neededAttr = [];
                        neededAttr["N48JExn2s73"] = true; //Gender
                        neededAttr["KLSVjftH2xS"] = true; //Project Donor
                        neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
                        neededAttr["gJ7mFiFa0dU"] = true; //first Name
                        neededAttr["t67rLuGIQmZ"] = true; //Last Name
                        tei.attributes.forEach(attr => {
                          if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;

                        })
                        obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
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
                        loader: false
                      })
                      //  this.setState({ tei: arr })
                      //  console.log(response)
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
      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          console.log("here is seleted", result.programStages);
          if (programStage.length > 0) {
            var programStageId = programStage[0].id;
            let datas = {
              program: this.state.programId,
              ou: this.state.orgUnitId
            }
            var arr = [];
            ApiService.getTrackedEntityInstance(datas).then(
              (response) => {
                console.log('here is tei', response);
                response.trackedEntityInstances.forEach(tei => {
                  let obj = {
                    tei: "",
                    Name: "",
                    Gender: "",
                    checked: false
                  };
                  obj["Project Donor"] = ""
                  obj["tei"] = tei.trackedEntityInstance
                  var neededAttr = [];
                  neededAttr["N48JExn2s73"] = true; //Gender
                  neededAttr["KLSVjftH2xS"] = true; //Project Donor
                  neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
                  neededAttr["gJ7mFiFa0dU"] = true; //first Name
                  neededAttr["t67rLuGIQmZ"] = true; //Last Name
                  tei.attributes.forEach(attr => {
                    if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;

                  })
                  obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
                  arr.push(obj);

                })
                //  this.setState({ tei: arr })
                //  console.log(response)
              },
              (error) => {
                console.log("here is seleted", error);
              }
            )
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
  onChange = date => this.setState({ date })
  
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
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    console.log('here is option changed',index1, index2, e.target.value)

  }
  changeRadioBtn(index1, index2, e){
    let dataValues = this.state.programSection;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues})
    console.log('here is option changed',index1, index2, e.target.value)
  }
  EventPass() {
    let date = JSON.stringify(this.state.date);
    let fdate = date.substring(1, date.length - 1);
     console.log('here is date', this.state)
    let payload = {
      orgUnitId: this.state.orgUnitId,
      programStageId: this.state.programStageId,
      programId: this.state.programId,
      eventDate: fdate,
      status: "ACTIVE",
      tei: this.state.tei
    }
    let data = [];
    let event = this.state.dataValues
    event.forEach(element => {
      element.dataElements.forEach(val => {
        if (val.value !== undefined) {
          let id = val.id;
          let valu = val.value
          let dVal = { id: id, value: valu }
          data.push(dVal)
        }
        //  console.log('here is me', data)
      })
    })
    payload['dataValues'] = data;
    payloadService.passpayload(payload);
    this.setState({payload: payload})
     console.log("payload", payload)
  }
  render() {
    const programStageDataElement =this.state.porgramStageDateElement
    // console.log("state",this.state.programRules)
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
                if (ele.optionSet) {
                  return (
                    <>
                      <Col md={3}><div className="font">{ele.displayFormName}</div></Col>
                        <Col md={3}>
                          <Input type="select" name="select" id="exampleSelect" onChange={ (e) =>this.optionChange(index1, index2, e)} >
                            {ele.optionSet.options.map(opt =>
                              <>
                               <option selected hidden>Please Select Option</option>
                                <option value={opt.id}>{opt.name}</option>
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
                        <Col md={3}><div className="font">{ele.name}</div></Col>
                        <Col md={3}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/* <Input type="radio" name={ele.id} onChange={(e)=>changeRadioBtn(index1, index2, e)} /> Yes &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Input type="radio" name={ele.id} onChange={(e)=>changeRadioBtn(index1, index2, e)} />  No */}
                        <Input type="radio" name={ele.id} /> Yes &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Input type="radio" name={ele.id}  />  No
                         
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
                   <Input type="checkbox" onChange={(e)=>checkBoxStatus(index1, index2, e)}/>
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
                  if (ele.valueType === 'TEXT'){
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
              <Col md="auto">Selected Organisation Unit :</Col>
              <Col>
                <Input type="text" defaultValue={this.state.name} />
              </Col>
            </Row>
            <br />
            <Row form>
              <Col md="auto">Program : </Col>
              <Col>
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
              <Col md="auto">Program Stage : </Col>
              <Col>
                <Input type="select" name="select" id="exampleSelect" onChange={this.handleChanges}>
                  {optionVals()}
                </Input>
              </Col>
            </Row>
            <br />
            <Row form>
              <Col md="auto">Event Date :</Col>
              <Col><DatePicker onChange={this.onChange} value={this.state.date} /></Col>
            </Row>
            <br />
          </div>
          <Row form>
            <div className='p-5 shadow-lg p-3 mb-3 bg-white rounded box font'>
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