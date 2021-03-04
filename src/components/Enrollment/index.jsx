import React, { PureComponent } from 'react';
import { OrgUnitTree } from '@hisp-amr/org-unit-tree'
import { ApiService } from '../../services/apiService'
import DatePicker from "react-date-picker";
import { Col, Row, Input, Button } from "reactstrap";
import Loader from 'react-loader-spinner';
import $ from "jquery";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './EnrollmentWithEvent.css'

const onError = error => console.error(error)
class EnrollmentWithEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgUnit: {
        name: "မြန်မာ",
        id: "RZjIN6Adcdr",
        displayName: "မြန်မာ",
        displayFormName: "မြန်မာ"
      },
      teiAttributes: [],
      programs: [],
      programId: '',
      programStage: '',
      programStageId: '',
      programSections: '',
      dataValues: [],
      teiValues: [],
      eventDate: '',
      loading: true,
      openOUModal: false,
      addressIndex: {},
      hiddenSection: {
        istJndsowbY: true,
        sJXubtey1Dy: true,
        IhONBzMHVfN: true,
        pAqesYY7ymO: true,
        RttUfWrCBZk: true,
        JpH6u1qBmQ5: true
      }
    }

  }
  componentDidMount() {
    this.getPrograms();
  }

  onSelect = (selected) => {
    if (selected) {
      let dataValues = this.state.dataValues;
      dataValues[this.state.addressIndex.index1]["dataElements"][this.state.addressIndex.index2]["value"] = selected.displayName;
      this.setState({ dataValues: dataValues, loading: false })
      $("#myModal").show();
      $(".modal").show();
    }
  }

  getPrograms = () => {
    var orgUnitId = this.state.orgUnit.id;
    ApiService.getProgram(orgUnitId).then(
      (result) => {
        let programs = result.programs
        this.setState({ programs: programs })

        if (programs.length > 0) {
          var programId = programs[0].id;
          if (programId != undefined) {

            ApiService.getProgramDetials(programId).then(res => {

              var programStage = res.programStages;
              if (programStage.length > 0) {
                var programStageId = programStage[0].id;
                var programStageSection = programStage[0].programStageSections;
                var dataValues = [];
                var programDataElementCompulsory =[];
                programStage[0].programStageDataElements.forEach(psde=> programDataElementCompulsory[psde.dataElement.id] = psde.compulsory)
                if (programStageId == "so8YZ9J3MeO") {
                  dataValues = programStageSection.filter(programSection => !this.state.hiddenSection[programSection.id]);
                  dataValues.forEach(dataValue => {
                    if (dataValue.dataElements) {
                      dataValue.dataElements.forEach(de => {
                        de.value = "";
                        de.error = "";
                        de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]: false;
                      })
                    }
                  })
                } else {
                  programStageSection.dataValues.forEach(dataValue => {
                    if (dataValue.dataElements) {
                      dataValue.dataElements.forEach(de => {
                        de.value = "";
                        de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]: false;
                      })
                    }
                  })
                  dataValues = programStageSection;
                }
                let pram = {
                  program: programId,
                  ou: orgUnitId
                };
                var teiAttributes = [];
                var teiValues = [];

                ApiService.getProgramTEIAttribute(pram.program).then(
                  (programAttributeResponse) => {
                    programAttributeResponse.programTrackedEntityAttributes.forEach(progTEIAttr => {
                      if (progTEIAttr.displayInList) {

                        teiAttributes.push({
                          id: progTEIAttr.trackedEntityAttribute.id,
                          name: progTEIAttr.trackedEntityAttribute.displayName,
                          compulsory: progTEIAttr.mandatory,
                          valueType: progTEIAttr.valueType,
                        });
                        if (progTEIAttr.trackedEntityAttribute.optionSet) {
                          teiAttributes[teiAttributes.length - 1]["optionSetValue"] = true;
                          teiAttributes[teiAttributes.length - 1]["displayFormName"] = progTEIAttr.trackedEntityAttribute.displayName;
                          teiAttributes[teiAttributes.length - 1]["optionSet"] = progTEIAttr.trackedEntityAttribute.optionSet;
                        }
                        teiAttributes[progTEIAttr.trackedEntityAttribute.id] = true;
                        teiValues[progTEIAttr.trackedEntityAttribute.id] = "";

                      }
                    });
                    console.log("teiAttributes", teiAttributes);

                    this.setState({
                      programs: programs,
                      programId: programId,
                      programStage: programStage,
                      programStageId: programStageId,
                      programSections: programStageSection,
                      dataValues: dataValues,
                      teiAttributes: teiAttributes,
                      teiValues: teiValues,
                      loading: false,
                    });

                  });
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
  handleProgram = (e) => {
    var id = e.target.value;
    if (id) {
      ApiService.getProgramStage(id).then(
        result => {
          var programStage = result.programStages
          console.log("here is seleted", result.programStages);
          if (programStage.length > 0) {
            var programStageId = programStage[0].id;
            let pram = {
              program: id,
              ou: this.state.orgUnit.id
            };

            var teiAttributes = [];
            var teiValues = [];

            ApiService.getProgramTEIAttribute(pram.program).then(
              (programAttributeResponse) => {
                programAttributeResponse.programTrackedEntityAttributes.forEach(progTEIAttr => {
                  if (progTEIAttr.displayInList) {

                    teiAttributes.push({
                      id: progTEIAttr.trackedEntityAttribute.id,
                      name: progTEIAttr.trackedEntityAttribute.displayName,
                      compulsory: progTEIAttr.mandatory,
                      valueType: progTEIAttr.valueType,
                    });
                    if (progTEIAttr.trackedEntityAttribute.optionSet) {
                      teiAttributes[teiAttributes.length - 1]["optionSetValue"] = true;
                      teiAttributes[teiAttributes.length - 1]["displayFormName"] = progTEIAttr.trackedEntityAttribute.displayName;
                      teiAttributes[teiAttributes.length - 1]["optionSet"] = progTEIAttr.trackedEntityAttribute.optionSet;
                    }
                    teiAttributes[progTEIAttr.trackedEntityAttribute.id] = true;
                    teiValues[progTEIAttr.trackedEntityAttribute.id] = "";
                  }
                });
                this.setState({
                  teiAttributes: teiAttributes,
                  teiValues: teiValues
                });

              });

            ApiService.getDataElements(programStageId).then(result => {
              let dataValues = [];
              var programDataElementCompulsory =[];
              result.programStageDataElements.forEach(psde=> programDataElementCompulsory[psde.dataElement.id] = psde.compulsory)
              
              if (programStageId == "so8YZ9J3MeO") {
                dataValues = result.programStageSections.dataValues.filter(programSection => !this.state.hiddenSection[programSection.id]);
                dataValues.forEach(dataValue => {
                  if (dataValue.dataElements) {
                    dataValue.dataElements.forEach(de => {
                      de.value = "";
                      de.error = "";
                      de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]: "";
                    })
                  }
                })
              } else {
                result.programStageSections.dataValues.forEach(dataValue => {
                  if (dataValue.dataElements) {
                    dataValue.dataElements.forEach(de => {
                      de.value = ""
                      de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]: "";
                    })
                  }
                })
                dataValues = result.programStageSections;
              }
              this.setState({
                programId: id,
                programStage: programStage,
                programStageId: programStageId,
                programSections: result.programStageSections,
                dataValues: dataValues
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
  handleProgramStage = (e) => {
    var programStageId = e.target.value;
    var programDataElementCompulsory =[];
    if (programStageId) {
      ApiService.getDataElements(programStageId).then(
        result => {
          result.programStageDataElements.forEach(psde=> programDataElementCompulsory[psde.dataElement.id] = psde.compulsory)
          var dataValues;
          if (programStageId == "so8YZ9J3MeO") {
            dataValues = result.programStageSections.filter(programSection => !this.state.hiddenSection[programSection.id]);
            dataValues.forEach(dataValue => {
              if (dataValue.dataElements) {
                dataValue.dataElements.forEach(de => {
                  de.value = ""
                  de.error = ""
                  de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]  : "";
                })
              }
            })
          } else {
            result.programStageSections.forEach(dataValue => {
              if (dataValue.dataElements) {
                dataValue.dataElements.forEach(de => {
                  de.value = "";
                  de.error = "";
                  de.compulsory = programDataElementCompulsory[de.id] ? programDataElementCompulsory[de.id]  : "";
                })
              }
            })
            dataValues = result.programStageSections;
          }

          this.setState({
            programStageId: programStageId,
            programSections: result.programStageSections,
            dataValues: dataValues
          });
        },
        error => {
          console.log("here is seleted", error);
        }
      );
    }
  }
  handleChange = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues })
  }

  onChange = eventDate => this.setState({ eventDate });

  checkNumber = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    dataValues[index1]["dataElements"][index2]["error"] = "";
    this.setState({ dataValues: dataValues })
    const re = /^[a-z\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      dataValues[index1]["dataElements"][index2]["error"] = true;
      this.setState({ dataValues: dataValues })
    }
  }
  checkText = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }

    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    dataValues[index1]["dataElements"][index2]["error"] = "";
    this.setState({ dataValues: dataValues })
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      dataValues[index1]["dataElements"][index2]["error"] = true;
      this.setState({ dataValues: dataValues })
    }

  }
  optionChange = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues })
  }
  checkBoxStatus = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.checked;
    this.setState({ dataValues: dataValues })

  }
  changeRadioBtn = (index1, index2, e) => {
    if (this.state.teiAttributes[e.target.id]) {
      let teiValues = this.state.teiValues;
      teiValues[e.target.id] = e.target.value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = e.target.value;
    this.setState({ dataValues: dataValues })
  }
  changeDate = (index1, index2, id, value) => {
    if (this.state.teiAttributes[id]) {
      let teiValues = this.state.teiValues;
      teiValues[id] = value;
      this.setState({ teiValues: teiValues });
      return;
    }
    let dataValues = this.state.dataValues;
    dataValues[index1]["dataElements"][index2]["value"] = value;
    this.setState({ dataValues: dataValues })
  }
  addTEI = () => {

    this.setState({ loading: true })
    for (let i = 0; i < this.state.teiAttributes.length; i++) {
      if (this.state.teiAttributes[i].compulsory && !this.state.teiValues[this.state.teiAttributes[i].id]) {
        this.setState({loading:false});
        alert("Mandatory Case Details not filled!");
        return;
      }
    }
    for (let i = 0; i < this.state.dataValues.length; i++) {
      for (let j = 0; j < this.state.dataValues[i].dataElements.length; j++) {
        if (this.state.dataValues[i].dataElements[j]["compulsory"] && !this.state.dataValues[i].dataElements[j]["value"]) {
        this.setState({loading:false});
          alert("Mandatory event Details not filled!");
          return;
        }

      }
    }
    var teiValues = [];
    var dataValues = [];
    let trackedEntityInstance = {
      "trackedEntityType": "MCPQUTHX1Ze",
      "orgUnit": this.state.orgUnit.id,
      "attributes": [
      ]
    }
    for (let attribute in this.state.teiValues) {
      if (this.state.teiValues[attribute]) {
        trackedEntityInstance["attributes"].push({ attribute: attribute, value: this.state.teiValues[attribute] });
        teiValues[attribute] = "";
      } else teiValues[attribute] = "";
    }

    ApiService.addNewTEI(trackedEntityInstance).then(data => {
      if (data.status == "OK") {
        let newEnrollment = {
          orgUnit: this.state.orgUnit.id,
          status: "ACTIVE",
          trackedEntityInstance: data.response.importSummaries[0].reference,
          trackedEntityType: trackedEntityInstance.trackedEntityType,
          program: this.state.programId
        };
        ApiService.createNewEnrollment(newEnrollment).then(enrollmentResponse => {
          if (enrollmentResponse.status === 'OK') {
            let newEvent = {
              trackedEntityInstance: data.response.importSummaries[0].reference,
              orgUnit: this.state.orgUnit.id,
              status: "COMPLETED",
              enrollment: enrollmentResponse.response.importSummaries[0].reference,
              program: this.state.programId,
              programStage: this.state.programStageId,
              eventDate: this.state.eventDate ? this.state.eventDate : new Date(),
              dataValues: []
            };

            dataValues = this.state.dataValues;
            dataValues.forEach(dataValue => {
              dataValue.dataElements.forEach(de => {
                if (de.value) {
                  newEvent.dataValues.push({ dataElement: de.id, value: de.value })
                  de.value = "";
                }
              })
            })

            ApiService.postEvent(newEvent).then(postEventResponse => {
              if (postEventResponse.httpStatus == 'OK') {
                alert("AEFI Case saved Successfully");
                this.setState({ dataValues: dataValues, dataValues: dataValues, loading: false })
                return;
              }
            }, error => {
              console.log(error)
            });
          }
        }, error => {
          console.log(error)
        })
        this.setState({ teiValues: teiValues });
      }
    }, error => {
      console.log(error)
    })


  }

  changeAddress = (index) => {
    this.setState({ openOUModal: true, addressIndex: index, loading: true })
  }

  toggleModal = () => {
    this.setState({ showModal: true })
  }
  render() {
    const programStageDataElement = this.state.porgramStageDateElement
    const programOptions = () => {
      if (this.state.programs === undefined) {
        let val = [""];
        return val;

      } else {
        let a = [...this.state.programs];
        let b = a.map((val, index) => (
          <option key={index} value={val.id}>
            {val.name}
          </option>
        ));
        return b;
      }
    };
    const programStageOptions = () => {
      if (this.state.programStage === undefined) {
        let val = ['']
        return val
      } else {
        let a = [...this.state.programStage]
        let b = a.map((val, index) => <option key={index} value={val.id}> {val.displayName} </option>)
        return b;
      }
    }

    const sectionHeader = (teiAttr) => {

      if (!this.state.dataValues) {
        let val = ['']
        return val
      } else {
        let a = teiAttr ? [{ dataElements: teiAttr }] : [...this.state.dataValues];

        let b = a.map((val, index1) =>

          <>
            <div>
              <h6 key={index1}>{val.name}</h6>
              <br />
              <Row>
                {val.dataElements.map((ele, index2) => {
                  let deValue = teiAttr ? this.state.teiValues[ele.id] : ele["value"];
                  if (ele.optionSetValue && ele.valueType === 'TEXT') {
                    return (
                      <>
                        <Col md={3} className="mb-3"><div className="font">{ele.displayFormName}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                        <Col md={3} className="mb-3">
                          <Input type="select" name="select" value={deValue} id={ele.id} onChange={(e) => this.optionChange(index1, index2, e)} >
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
                    if (ele.valueType == "ORGANISATION_UNIT") {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">
                            <Input type="" id={ele.id} value={deValue} onFocus={(e) => this.changeAddress({ index1, index2 })} placeholder={ele.valueType} />
                            {ele.error ? <div className="help-block">Please select organisation unit</div> : null}
                            <br />
                          </Col>
                        </>
                      )
                    }
                    if (ele.valueType === 'BOOLEAN') {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.displayFormName}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                          <Input type="radio" value="true" name={ele.id} id={ele.id} onChange={(e) => this.changeRadioBtn(index1, index2, e)} /> Yes &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                          <Input type="radio" value="false" name={ele.id} id={ele.id} onChange={(e) => this.changeRadioBtn(index1, index2, e)} />  No

                         <br />
                            <br />
                          </Col>
                        </>
                      )
                    }
                    if (ele.valueType === 'DATE') {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">
                            <DatePicker value={deValue} onChange={(e) => this.changeDate(index1, index2, ele.id, e)} />
                            <br />
                          </Col>
                        </>
                      )
                    }
                    if (ele.valueType === 'TRUE_ONLY') {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Input type="checkbox" value={deValue} id={ele.id} onChange={(e) => this.checkBoxStatus(index1, index2, e)} />
                            <br />
                            <br />
                          </Col>
                        </>
                      )
                    }
                    if (ele.valueType === 'INTEGER_ZERO_OR_POSITIVE') {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">
                            <Input type="" value={deValue} id={ele.id} onChange={(e) => this.checkNumber(index1, index2, e)} placeholder={ele.valueType} />
                            {ele.error ? <div className="help-block">Please Enter zero and Positive value Only</div> : null}
                            <br />
                          </Col>
                        </>
                      )
                    }
                    if (ele.valueType === 'TEXT' && !ele.optionSetValue) {
                      return (
                        <>
                          <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                          <Col md={3} className="mb-3">
                            <Input type="" value={deValue} id={ele.id} onChange={(e) => this.checkText(index1, index2, e)} placeholder={ele.valueType} />
                            {ele.error ? <div className="help-block">Please Enter text only</div> : null}
                            <br />
                          </Col>
                        </>
                      )
                    }
                    return (
                      <>
                        <Col md={3} className="mb-3"><div className="font">{ele.name}{ele.compulsory ? <span style={{ color: "red" }}>*</span> : ""}</div></Col>
                        <Col md={3} className="mb-3">
                          <Input type={ele.valueType} value={deValue} id={ele.id} placeholder={ele.valueType} onChange={(e) => this.handleChange(index1, index2, e)} />
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
      { this.state.loading ? <div className='loaderPosition'>
        <Loader
          type="Oval"
          color="#00BFFF"
          height={150}
          width={150}
        />
      </div> :

        <div>
          <div className="p-5 shadow-lg p-3 mb-3 bg-white rounded box">
            <Row form>
              <p className="h3 text-center">COVID19 AEFI Reporting</p>
            </Row>
            <br />
            <Row form>
              <Col className="col-md-4">Organisation Unit :</Col>
              <Col className="col-md-8">
                <Input type="text" value={this.state.orgUnit.displayName} />
              </Col>
            </Row>
            <br />
            <Row form>
              <Col className="col-md-4"> Program : </Col>
              <Col className="col-md-8">
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  onChange={this.handleProgram}
                >
                  {programOptions()}
                </Input>
              </Col>
            </Row>
            <br />
            <Row form>
              <Col className="col-md-4">Program Stage : </Col>
              <Col className="col-md-8">
                <Input type="select" name="select" id="exampleSelect" onChange={this.handleProgramStage}>
                  {programStageOptions()}
                </Input>
              </Col>
            </Row>
            <br />
            <Row form>
              <Col className="col-md-4">Event Date :</Col>
              <Col className="col-md-8"><DatePicker onChange={this.onChange} value={this.state.eventDate} /></Col>
            </Row>
          </div>
          <Row form>
            <div className='p-5 shadow-lg p-3 mb-3 bg-white rounded box font col-md-12'>
              <br />
              <Col>
                <h6>AEFI Case Details</h6>
                {sectionHeader(this.state.teiAttributes)}</Col>
              <br />
            </div>
          </Row>
          <Row form>
            <div className='p-5 shadow-lg p-3 mb-3 bg-white rounded box font col-md-12'>
              <br />
              <Col>{sectionHeader()}</Col>
              <br />
              <Col sm={{ size: 10, offset: 11 }}>
                <Button color="primary" onClick={this.addTEI}>Save</Button>
              </Col>
            </div>
          </Row>

        </div>
      }
      {this.state.openOUModal || this.state.loading ?
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => this.setState({ openOUModal: false })}>&times;</span>
            <div class="modal-content-body">
              <OrgUnitTree
                onSelect={this.onSelect}
                onError={onError}
              />
            </div>
            <div class="modal-content-footer" onClick={() => this.setState({ openOUModal: false })}>
              Close
            </div>
          </div>
        </div>
        :
        ""}
    </>
    );
  }
}
export default EnrollmentWithEvent;