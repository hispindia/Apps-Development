import React, { useEffect } from 'react'
import { CardSection } from '@hisp-amr/app'
import { useSelector, useDispatch } from 'react-redux'
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from '@dhis2/ui-core'
import {
    getExistingEvent,
    addPreviousEntity
} from '@hisp-amr/app'
import { withRouter } from 'react-router-dom'
import './main.css'
import $ from "jquery"
import SweetAlert from 'react-bootstrap-sweetalert';
import { deleteTEI } from '@hisp-amr/api'
const Events = ({match, history }) => {
    var data = [];
    const dispatch = useDispatch()
    var events = useSelector(state => state.data.eventList);
    var metadata = useSelector(state => state.metadata);
    const eventList = useSelector(state => state.data.eventList)

    if(eventList.length === 0){
       $('#Dbtn').show()
    }else (
        $('#Dbtn').hide()
    )
    useEffect(() => {
        $("#msg1").hide();
        $('#succes1').hide();
      });
      const onConfirm=(e)=>{
        e.preventDefault();
        deleteTEI(teiId).then(res => {
            if(res.httpStatus == 'OK')
            {
            $('#succes1').show();
            }
       })
         $('#msg1').hide();
        }
    
       const onNo =(e) =>{
              e.preventDefault();
              $('#msg1').hide();
        }
        const onYes =(e) =>{
            history.goBack()
      }
    var programs = metadata.programs
    var teiId = match.params.teiId
    var orgUnit = match.params.orgUnit
    const onEdit = (ou, eventId, dataValues) => {
        localStorage.setItem('eventId', eventId) 
        let btnStatus= false
        for (let dataValue of dataValues) {
            let dataElement = dataValue.dataElement;
            if( dataElement == 'u8VDCIwa3w4'){
                btnStatus = true;
            }
        }
        let editStatus = true;
        // dispatch(UpdateEvent(editStatus))
        dispatch(getExistingEvent(ou, teiId, eventId, editStatus, btnStatus))
    }

    if (events != undefined) {
        data = events
    }
     const onAddClick = () => {
        dispatch(addPreviousEntity());
        history.push(`/orgUnit/${orgUnit}/event/`)
     }
     const OnDelete =() => {
         $('#msg1').show()         
     }
    var val = () => {
        if (events != undefined) {
            const v = events.map((ele, index) => {
                if (ele) {
                    var d = new Date(ele.eventDate)
                    var day = d.getDate();
                    var year = d.getFullYear();
                    var month = d.getMonth();
                    var proId = ele.program;
                    for (let program of programs) {
                        if (program.id == proId) {
                            var name = program.name;
                        }
                    }
                    var dataValue= [];
                    var dataValues = ele.dataValues;
                    for( let value of dataValues){
                        if(value.dataElement == 'B7XuDaXPv10'){
                            dataValue['0'] =value;
                        }
                        if(value.dataElement == 'GpAu5HjWAEz'){
                            dataValue['1'] =value;
                        }
                        if(value.dataElement == 'mp5MeJ2dFQz'){
                            dataValue['2'] =value;
                        }
                        if((value.dataElement == 'SaQe2REkGVw') || (value.dataElement  =='u8VDCIwa3w4')){
                            dataValue['3'] =value;
                        }
                    }
                     for(let i=0; i<3; i++){
                            if (!dataValue['0']){
                              let data = [ {value: ''}]
                              dataValue['0']=data
                            } 
                            if (!dataValue['1']){
                                let data = [ {value: ''}]
                                dataValue['1']=data
                              } 
                            if (!dataValue['2']){
                                let data = [ {value: ''}]
                                dataValue['2']=data
                              } 
                              if (!dataValue['3']){
                                let data = [ {value: ''}]
                                dataValue['3']=data
                              } 
                        } 
                    return (  
                        <TableRow>
                            <TableCell>{name}</TableCell>
                            {dataValue.map(ele =>(<TableCell>{ele.value}</TableCell>))}
                            <TableCell>{year}-{month}-{day}</TableCell>
                            <div className="btn">
                            <Button primary={true}  onClick={() => onEdit(ele.orgUnit, ele.event, dataValues)}>Edit</Button>
                            </div>
                        </TableRow>)
                }
            })
            return v
        }
    }

    return (
            <CardSection heading="Event List">
                <div  className="btn">
                <span id="Dbtn">
                <Button destructive={true} onClick={() => OnDelete()}>Delete TEI</Button>&nbsp;&nbsp;&nbsp;
                </span>
                <Button primary={true} onClick={() => onAddClick()}>Add Sample</Button>&nbsp;&nbsp;&nbsp;
                 </div>
                <div className='sidebar'>
                    <Table>
                    <TableRow>
                    <TableCell><b>Program Name</b></TableCell> 
                    <TableCell><b>Location</b></TableCell> 
                    <TableCell><b>Lap Sample ID</b></TableCell> 
                    <TableCell><b>Sample Type</b></TableCell> 
                    <TableCell><b>Organism</b></TableCell> 
                    <TableCell><b>Event Date</b></TableCell>
                    </TableRow>
                        <TableBody>
                            {val()}
                        </TableBody>
                    </Table>
                </div>
                <div id="msg1">
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                customButtons={
                    <React.Fragment>
                      <Button primary={true} onClick={(e)=>onConfirm(e)}>Yes</Button>&emsp;&emsp;&emsp;
                      <Button onClick={(e)=>onNo(e)}>No</Button>
                    </React.Fragment>
                  }
                >
                You will not able to recover this TEI Detail!
                </SweetAlert>
            </div>
            <div id='succes1'>
            <SweetAlert success title="TEI Delete success" 
             customButtons={
                <React.Fragment>
                  <Button primary={true} onClick={(e)=>onYes(e)}>Ok</Button>&emsp;&emsp;&emsp;
                </React.Fragment>
              }
            >
            </SweetAlert>
            </div>
            </CardSection>
    )
}
export default withRouter(Events)
