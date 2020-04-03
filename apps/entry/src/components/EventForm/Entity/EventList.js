import React, { useEffect } from 'react'
import { CardSection, LoadingSection } from '@hisp-amr/app'
import { useSelector, useDispatch } from 'react-redux'
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Modal
} from '@dhis2/ui-core'
import {
    getExistingEvent,
    UpdateEvent,
    resetPanel,
    setPanel,
    panelEditable,
    createNewEvent,
    addPreviousEntity
} from '@hisp-amr/app'
import { withRouter } from 'react-router-dom'
import './main.css'
import $ from "jquery"
import SweetAlert from 'react-bootstrap-sweetalert';
const Events = ({match, history }) => {
    var data = [];
    const dispatch = useDispatch()
    var events = useSelector(state => state.data.eventList);
    var metadata = useSelector(state => state.metadata);
    var state = useSelector(state => state);
    var dataElements = metadata.dataElements;
    var programs = metadata.programs
    const teiId = match.params.teiId
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
            </CardSection>
    )
}
export default withRouter(Events)
