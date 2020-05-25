import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Card, Checkbox, CardContent, Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core";
import { getTEIAttribute, getTrackedEntityInstances, postingEvent,failureEvent } from '../../redux/action/event';
import { ApiService } from "../../services/apiService";
import Loader from "react-loader-spinner";
import SweetAlert from 'react-bootstrap-sweetalert';
import { BrowserRouter as Router, Route,withRouter, NavLink,useHistory } from 'react-router-dom'
import './custom.css';
import $ from 'jquery';
// import Loader from "react-loader-spinner";


const TEIDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  var payload = useSelector(state => state.data.payload);
  const [hide, setHide] = useState(true)
  const dataValues = useSelector(state => state.data.dataValue);
  const TEIRender = useSelector(state => state.data.TEIRender);
  const teiAttributes = useSelector(state => state.data.attributes);
  const disable = useSelector(state => state.data.btnStatus);
  const eventPost = useSelector(state => state.data.eventPost);
  const failEvent = useSelector(state => state.data.failEvent);

  const tranckedEntityInstances = useSelector(state => state.data.tranckedEntityInstances);
  console.log('here is aatt', teiAttributes, TEIRender, tranckedEntityInstances);
  useEffect(() => {
    if (TEIRender) {
        payload = JSON.parse(localStorage.getItem('payload'))
       console.log('here is val', payload)
      let pram = {
        program: payload.programsId,
        ou: payload.orgUnitId
      };
      var arr = [];
      var teiAttributes = [];
      var displayTEIAttr = [];
      ApiService.getTrackedEntityInstance(pram).then(response => {
        ApiService.getProgramTEIAttribute(pram.program).then(programAttributeResponse => {
          programAttributeResponse.programTrackedEntityAttributes.forEach(proTEIAttr => {
            if (proTEIAttr.displayInList) {
              displayTEIAttr[proTEIAttr.trackedEntityAttribute.id] = true;
              teiAttributes.push(proTEIAttr.trackedEntityAttribute.displayName);
            }
          });
          dispatch(getTEIAttribute(teiAttributes)); //   console.log("here is tei", response);

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
          console.log("here is tt", arr);
          dispatch(getTrackedEntityInstances(arr));
        });
      }, error => {
        console.log(error);
      });
    }
  });

  const onHeadChecked = (e,checkboxName, box) => {
    console.log('here is boxes1', checkboxName, box)

    var checkboxes = document.querySelectorAll('Checkbox');
    console.log('here is boxes1', checkboxes)
    for (var i = 0; i < (checkboxes.length); i++) {   
         checkboxes[i].checked = true;
         console.log('here is boxes', checkboxes)
        //   tranckedEntityInstances[i].checked = true;
        //   dispatch(getTrackedEntityInstances(tranckedEntityInstances));

    }
    console.log('here is boxes22', checkboxes)

  };

  const onSelect = (e, i) => {
    console.log('here is index', i);
    let hide = true;
    tranckedEntityInstances[i].checked = !tranckedEntityInstances[i].checked;
    tranckedEntityInstances.forEach(tei => {
      if(tei.checked == true) hide =  false
    })
    setHide(hide)

    dispatch(getTrackedEntityInstances(tranckedEntityInstances));
  };

  const onSubmit = e => {
     payload=JSON.parse(localStorage.getItem('payload'))
     console.log('here is payload',payload)
    let selectedTEI = tranckedEntityInstances.filter(tei => tei.checked);
    
    let dataValue = [];
    for(let dv in dataValues) {
      dataValue.push({dataElement:dv, value:dataValues[dv]})
    }
      selectedTEI.forEach( ele => {
        let tei = ele.tei;
        var event = {
            trackedEntityInstance: tei,
            orgUnit: payload.orgUnitId,
            programStage : payload.programStageId,
            program : payload.programsId,
            eventDate: payload.eventDate,
            status : "ACTIVE",
            dataValues: dataValue
            };
           console.log("here is pay load", event)
            ApiService.postEvent(event).then(result => {
            if(result.httpStatus == 'OK'){
              dispatch(postingEvent())
            }
        }, error => {
          dispatch(failureEvent())
           console.log('here is event',error)
        });
    }) 
  };
  const onConfirm =  () => {
    history.push('/')
    console.log('here is ok')
  }
 
  return <>  
      <Grid elevation={6}>
        <Card item xs={11}> {tranckedEntityInstances.length > 0 ? <CardContent>
        <Table name="table">
          <TableHead>
            <TableRow>
            <TableCell>S.N.</TableCell>
            {teiAttributes.map(header => <TableCell>{header}</TableCell>)}
            <TableCell> 
               <Checkbox type="checkbox" name="check" color="primary" className="checkBox" onChange={e =>onHeadChecked(e, document.table.check, this)} />
               {/* <Checkbox type="checkbox" name="check" color="primary" className="checkBox" onChange={e =>onHeadChecked(e)} /> */}
             </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tranckedEntityInstances.map((ele, index) => <TableRow>
              <TableCell>{index + 1}</TableCell>
              {teiAttributes.map(teiAttrName => <TableCell>{ele[teiAttrName]} </TableCell>)}
                <TableCell>
                <Checkbox type="checkbox" name="check" color="primary" className="checkBox" onChange={e => onSelect(e, index)} />
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table><br />
       <Button type="submit"  variant="contained"  raised disabled={hide} color="primary" onClick={e => onSubmit(e)}>Submit</Button> 
      </CardContent> :
       <div>
       <div className="loaderPosition">
       <Loader type="Oval" color="#00BFFF" height={150} width={150} />
       </div>
       {tranckedEntityInstances.length  ? 
        <CardContent>
        <h3>Tracked Entity Instance not available</h3>
        </CardContent> :
        ""
       }
     
      </div> 
     }   
      </Card>
      </Grid>
     {eventPost ? 
     <SweetAlert
     success
     title="OK"
     onConfirm={onConfirm}
     >
     Event Push Success
   </SweetAlert>
   : ''}
   {failEvent ?
   <SweetAlert
   warning
   confirmBtnBsStyle="danger"
   onConfirm={onConfirm}
 >
  Already Event available 
 </SweetAlert>
 :
 " "
   }
    </>;
};

export default withRouter(TEIDetails);