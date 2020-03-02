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
// import StickyBox from "react-sticky-box/dist/esnext";
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
    this.getPrograms = this.getPrograms.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleChangess = this.handleChangess.bind(this);
    this.checkBoxStatus =this.checkBoxStatus.bind(this);
  }
  componentDidMount() {
    $(".row").hide();
    ApiService.getMetaData().then( data => {
      console.log('here is metadata', data)
    })
    // ApiService.getDetials().then( data => {
    //   console.log('here is data Detaildasda', data)
    // })
  }
  onSelect(selected) {
    $(".loaderPosition").hide();
    $(".row").show();
    let id = selected.id;
    if (id != undefined) {
      this.getPrograms(selected);
      // console.log("here is the data", selected);
      this.props.history.push(`/plan${selected.path}`)
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
            var pRules =[];
            ApiService.getProgramDetials(programId).then(res => {
              ApiService.getProgramRules().then(res => {
                let programRules= res.programRules;
                for( let programRule of programRules){
                  if(programRule.program.id === programId){
                    pRules.push(programRule);
                  }
                }
                  this.setState({programRules:pRules})
                  pRules.forEach( ele => {
                    // console.log(ele.condition)
                  })
                console.log('program rules', pRules)
              })
               this.setState({programRulesVariables: res.programRuleVariables })
               console.log("here is program details", res);
              var programStage = res.programStages;
              if (programStage.length > 0) {
                if (programStage.length > 0) {
                  var programStageId = programStage[0].id;
                  var programStageSection = programStage[0].programStageSections;
                  var programStageDataElements = programStage[0].programStageDataElements;
                  let  porgramStageDateElement = []
                  programStageDataElements.forEach(element => {
                  if(element.compulsory === true)
                    { 
                    porgramStageDateElement.push(element) 
                    }
                  })
                     for( let setion of programStageSection){
                        for(let dataElement of setion.dataElements){
                          porgramStageDateElement.forEach(ele => {
                            if(ele.dataElement.id === dataElement.id){
                              dataElement.com ='*';
                             // console.log('here is de',ele)
                            }
                          })
                         // console.log('here is All', dataElement)
                        }
                     }
                  this.setState({porgramStageDateElement: porgramStageDateElement})
                  // console.log("here programStageSection", programStageSection, porgramStageDateElement)
                  let datas = {
                    program: programId,
                    ou: id
                  }
                  var arr = [];
                  ApiService.getTrackedEntityInstance(datas).then(
                    (response) => {
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
      // ApiService.getProgramDetials(id).then(
      //   (result) => {
      //     console.log("here is default",result);
      //     var programName = result.name;
      //     var pId = result.id;
      //     var programStage = result.programStages;
      //     if (programStage.length > 0) {
      //       var programStageId = programStage[0].id;
      //       var programStageSection = programStage[0].programStageSections;
      //       let datas = {
      //         program: pId,
      //         ou: this.state.orgUnitId
      //       }
      //       console.log('here is val', datas)
      //       var arr = [];
      //       ApiService.getTrackedEntityInstance(datas).then(
      //         (response) => {
      //           response.trackedEntityInstances.forEach(tei => {
      //             let obj = {
      //               tei: "",
      //               Name: "",
      //               Gender: "",
      //               checked: false
      //             };
      //             obj["Project Donor"] = ""
      //             obj["tei"] = tei.trackedEntityInstance
      //             var neededAttr = [];
      //             neededAttr["N48JExn2s73"] = true; //Gender
      //             neededAttr["KLSVjftH2xS"] = true; //Project Donor
      //             neededAttr["L2doMQ7OtUB"] = true; //Beneficiary ID
      //             neededAttr["gJ7mFiFa0dU"] = true; //first Name
      //             neededAttr["t67rLuGIQmZ"] = true; //Last Name
      //             tei.attributes.forEach(attr => {
      //               if (neededAttr[attr.attribute]) obj[attr.displayName] = attr.value;

      //             })
      //             obj["Name"] = (obj["First name"] ? obj["First name"] : "") + " " + (obj["Last name"] ? obj["Last name"] : "");
      //             arr.push(obj);

      //           })
      //           this.setState({
      //             program: programName,
      //             programId: pId,
      //             programStage: programStage,
      //             programStageId: programStageId,
      //             programSection: programStageSection,
      //             tei: arr,
      //             loader: false
      //           })
      //           //  this.setState({ tei: arr })
      //           //  console.log(response)
      //         },
      //         (error) => {
      //           console.log("here is seleted", error);
      //         })
      //     }
      //   })

      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          // console.log("here is seleted", result.programStages);
          if (programStage.length > 0) {
            var programStageId = programStage[0].id;
            let datas = {
              program: this.state.programId,
              ou: this.state.orgUnitId
            }
            var arr = [];
            ApiService.getTrackedEntityInstance(datas).then(
              (response) => {
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

              //  console.log("here is DE",  result.programStageSections)
              //   console.log("here is set stateddddd", this.state)
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
    // let dataValues = this.state.programSection;
    // dataValues[index1]["dataElements"][index2]["value"] = e.target.value;

    // console.log("here is check text type", index1, index2, dataValues[index1]["dataElements"][index2]["value"])
    // dataValues.forEach((ele, index1) =>{
    //  console.log(ele,index1)
    //   ele.dataElements((element, index2) => {
    //     console.log('here is me',index1, index2, element.value)
    //   })
    // })
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
    var arr = []
    let obj = {
      id: "VJOqWZznFbq",
      name:'Formal',
    }
    arr.push(obj);
    let pVar = this.state.programRulesVariables;
    let pR = this.state.programRules;
    let programSection = this.state.programSection;
    console.log('here is program section',programSection)
    pVar.forEach( ele =>{
      if(ele.dataElement !== undefined){
        if(ele.dataElement.id === arr[0].id){
           let proVarName = ele.name;
          //  console.log('here is proVarName',ele.name);
            arr.push(obj);
            pR.forEach(ele =>{
              let condition =ele.condition;
              const variableDuplicated = condition.match(/#\{.*?\}/g)
              if(variableDuplicated !== null){
                // console.log('variableDuplicated',variableDuplicated);
                const variables = []
                if (!variableDuplicated) console.log(condition);
                variableDuplicated.forEach(duplicated => {
                    if (variables.indexOf(duplicated) === -1)
                        variables.push(duplicated)
                })
                variables.forEach( variable => {
                    const name = variable.substring(2, variable.length - 1);
                    if(name === proVarName ){
                        let c = ele.condition;
                        let val = c.split("'")
                        val.forEach( el => {
                          if(el === 'Formal'){
                            let actions = ele.programRuleActions;
                            var newData =[];
                            for( let section of programSection){
                              // console.log('here is desdfasdfasdfsa', section.dataElements)
                                for( let i=0; i<section.dataElements.length; i++){
                                  console.log(section.dataElements[i].id)
                                   for( let action of actions){
                                  if(action.programRuleActionType === "HIDEFIELD" ){
                                      // console.log(action)

                                     if( section.dataElements[i].id === action.dataElement.id){
                                        console.log('here is de', action.dataElement.id, section.dataElements[i].id)
                                        section.dataElements[i]='';
                                  //     }else {
                                  //       // newData.push(dataElements)
                                     }
                                    }
                                  }
                                }


                              // for(let dataElements of section.dataElements){
                              //   for( let action of actions){
                              //     if(action.programRuleActionType === "HIDEFIELD" ){
                              //       if(action.dataElement.id === dataElements.id){
                              //         console.log('here is de', action.dataElement.id, dataElements.id)
                              //         dataElements='';
                              //       }else {
                              //         newData.push(dataElements)
                              //       }
                              //     }
                              //   }
                              // }
                            }
                            console.log('here is All', programSection) 

                          }
                        })
                      //  console.log('here is var',val);
                      // console.log("here is ele of the sdfgasf", ele)
                      }
                     
                })
              }            
            })
        }
      }
    })
    // pR.forEach(ele =>{
    //   let condition =ele.condition;
    //   const variableDuplicated = condition.match(/#\{.*?\}/g)
    //   if(variableDuplicated !== null){
    //     console.log('variableDuplicated',variableDuplicated);
    //     const variables = []
    //     if (!variableDuplicated) console.log(condition);
    //     variableDuplicated.forEach(duplicated => {
    //         if (variables.indexOf(duplicated) === -1)
    //             variables.push(duplicated)
    //     })
    //     variables.forEach( variable => {
    //         const name = variable.substring(2, variable.length - 1);
    //         pVar.forEach( element => {
    //           if(element.name === name ){
    //           console.log('here is var',element.name, name );
    //           console.log("here is ele of the sdfgasf", ele)
    //           }
    //         })
    //     })
    //   }            
    // })
    console.log('here is name', arr,pVar, pR )

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
    // this.setState({payload: payload})
     console.log("state", this.state)
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
        // a.forEach( element => {
        //   let id =element.id
        //   ApiService.getDetials(id).then( data => {
        //     console.log('here is data Detaildasda', data)
        //   })
        // })
        let b = a.map((val, index1) =>
          <>
          <div>
            <h6 key={index1}>{val.name}</h6>
            <br />
            <Row>
              {val.dataElements.map((ele, index2) => {
                // console.log('here is ele', ele, programStageDataElement)
                // programStageDataElement.forEach(ele => {
                //   if(ele.dataElement.name === ele.displayFormName){ console.log(ele.dataElement.name, ele.displayFormName)}
                // })
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
                        <Input type="radio" name="radio1" onChange={(e)=>changeRadioBtn(index1, index2, e)} /> Yes &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                        <Input type="radio" name="radio2" onChange={(e)=>changeRadioBtn(index1, index2, e)} />  No
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
        {/* <StickyBox className="p-5 shadow-lg p-5 mb-5 bg-white rounded box" offsetTop={10} offsetBottom={10}>
         here is me for test!!!
      </StickyBox> */}
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