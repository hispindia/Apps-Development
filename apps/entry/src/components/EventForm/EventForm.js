import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    DeleteModal,
    MainSection,
    TitleRow,
    Event,
    Panel,
    getExistingEvent,
    initNewEvent,
    createNewEvent,
    resetData,
    ERROR,
    addEntity,
    resetPreviousEntity
} from '@hisp-amr/app'
import { Entity } from './Entity'
import { EventButtons } from './EventButtons'
import Events from './Entity/EventList'
import $ from "jquery"
import { deleteEvent } from '@hisp-amr/api'
import SweetAlert from 'react-bootstrap-sweetalert';
export const EventForm = ({ history, match }) => {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const dispatch = useDispatch()
    const error = useSelector(state => state.data.status) === ERROR
    const panelValid = useSelector(state => state.data.panel.valid)
    const pageFirst = useSelector(state => state.data.pageFirst)
    const eventList = useSelector(state => state.data.eventList)
    var eventEditable = useSelector(state => state.data.eventEditable)
    var editable = useSelector(state => state.data.editable)
    var event = useSelector(state => state.data)
    const previousEntity = useSelector(state => state.data.previousEntity)
     if(eventList === undefined){l=1}
     else {var l =eventList.length;}
    var orgUnit = match.params.orgUnit
    const teiId = match.params.teiId;
    useEffect(() => {
        if( l == 0 ){
            $("#a").hide(); 
        } else {
            $("#a").show(); 
            $("#panel").hide();
        }
        $("#btn").hide();
      if(eventEditable === true){
        $("#btn").show();
        $("#popup").show();
        } 
        $("#msg").hide();
        $('#success').hide();
      });
    useEffect(() => {
        let previousEvent = ""
        if(!pageFirst) {
            previousEvent = "";
            
        }
        dispatch(resetData())
        if (teiId) {
            dispatch(getExistingEvent(orgUnit, teiId))
        }
        else {
           dispatch(initNewEvent(orgUnit))
        }
        setIsFirstRender(false)
    }, [])
    useEffect(() => {
        if (previousEntity.id) {
            dispatch(addEntity())
            dispatch(resetPreviousEntity())
        }
    }, [previousEntity])
    useEffect(() => {
        if (error) history.goBack()
    }, [error])

    useEffect(() => {
        if (!isFirstRender && panelValid && pageFirst) dispatch(createNewEvent())
    }, [panelValid, pageFirst])

    const onDelete =(e) =>{
        e.preventDefault();
        $('#msg').show();
    }
    
    const  onCancel =(e) =>{
        e.preventDefault();
        console.log('here is me',e)
          $("#panel").hide();
          $("#popup").hide();
         
    }
 
   const onConfirm=(e)=>{
    e.preventDefault();
    let eventID =localStorage.getItem('eventId')
     deleteEvent(eventID).then(res => {
        if(res.httpStatus == 'OK')
        {
        $('#success').show();
        }
   })
     $("#popup").hide();
     $("#panel").hide();
     $('#msg').hide();
    }

   const onNo =(e) =>{
          e.preventDefault();
          $("#popup").hide();
          $("#panel").hide();
          $('#msg').hide();
    }

    const onYes =(e) =>{
        window.location.reload(false)
        $("#popup").hide();
        $("#panel").hide();
  }
    if (isFirstRender) return <TitleRow title="Record" history={history} />
    return (
        <MainSection padded>
            <TitleRow title="Record" history={history} />
            <form autoComplete="off">
                <Entity showEdit={!panelValid} />
                <div id="a">
                <Events />
                </div>
                { (eventEditable  || editable) ? <div id='popup'>
                <SweetAlert
                style={{
                    width: '90%'
                }}
                openAnim={{ name: 'showSweetAlert', duration: 2000 }}
                closeAnim={{ name: 'hideSweetAlert', duration: 2000 }}
                customButtons={
                    <React.Fragment>
                        <div id="btn">
                        <button  primary={true} onClick={(e)=>onDelete(e)}>Delete</button>&emsp;&emsp;&emsp;&emsp;&emsp;
                        </div>
                      <button onClick={(e)=>onCancel(e)}>Cancel</button>
                    </React.Fragment>
                  }
                >
                <Panel />
                <Event />
                   <EventButtons history={history} existingEvent={teiId} />
               </SweetAlert> 
                </div> :
                <div id="panel"> 
                <Panel showEdit={panelValid} />
                <Event />
                <EventButtons history={history} existingEvent={teiId} />
                </div>}
            </form>
            <div id="msg">
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                customButtons={
                    <React.Fragment>
                      <button  onClick={(e)=>onConfirm(e)}>Yes</button>&emsp;&emsp;&emsp;
                      <button onClick={(e)=>onNo(e)}>No</button>
                    </React.Fragment>
                  }
                >
                You will not able to recover this event Detail!
                </SweetAlert>
            </div>
            <div id='success'>
            <SweetAlert success title="Event Delete Success" onConfirm={(e)=>onYes(e)} >
            </SweetAlert>
            </div>
        </MainSection>
    )
}
export default withRouter(EventForm)
