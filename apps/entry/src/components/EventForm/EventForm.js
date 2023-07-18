import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    MainSection,
    TitleRow,
    Event,
    Panel,
    addExistingEvent,
    getExistingEvent,
    initNewEvent,
    createNewEvent,
    resetData,
    ERROR,
    addEntity,
    resetPreviousEntity,
    setEventValue,
    setAggregationProgress,

} from '@hisp-amr/app'
import {
    Button,
} from '@dhis2/ui-core'
import { Entity } from './Entity'
import { EventButtons } from './EventButtons'
import Events from './Entity/EventList'
import $ from "jquery"
import {
    Aggregate
} from '../../api/helpers/aggregate'
import { deleteEvent } from '@hisp-amr/api'
import SweetAlert from 'react-bootstrap-sweetalert';
import ClinicianNote from "./Entity/ClinicianNote";
export const EventForm = ({ history, match }) => {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [isSave, setIsSave] = useState(false)
    const [isOrganismDetected, setIsOrganismDetected] = useState(false)
    const dispatch = useDispatch()
    const error = useSelector(state => state.data.status) === ERROR
    const panelValid = useSelector(state => state.data.panel.valid)
    const pageFirst = useSelector(state => state.data.pageFirst)
    var eventEditable = useSelector(state => state.data.eventEditable)
    var editable = useSelector(state => state.data.editable)
    const event = useSelector(state => state.data.event)
    const eventValue = useSelector(state => state.data.event.values)
    const dataElementObjects = useSelector(state=> state.metadata.dataElementObjects)
    const programs = useSelector(state=>state.metadata.programs)
    const categoryCombos = useSelector(state=> state.metadata.categoryCombos)
    const dataSets = useSelector(state=>state.metadata.dataSets)
    const eventIDs = useSelector(state => state.data.event.id)
    const previousValues = useSelector(state => state.data.previousValues)
    var aggregationOnProgress = useSelector(state => state.data.aggregationOnProgress)
    var { sampleDate } = useSelector(state => state.data.panel)
    var orgUnit = match.params.orgUnit
    const teiId = match.params.teiId;
    var teiAttributeValues = useSelector(state => state.data.entity.values);
    var [dialogNote, setDialogNote] = useState(false);
    useEffect(() => {
        if( (eventValue?.u8VDCIwa3w4  == "Sterile") || (eventValue?.u8VDCIwa3w4 == "Insignificant Growth")  ||  (eventValue?.u8VDCIwa3w4 == "Commensals") || (eventValue?.u8VDCIwa3w4  == "Growth of contaminants")){
            setIsOrganismDetected(true)
        }
        if( pageFirst ){
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
        // let previousEvent = ""
        // if(!pageFirst) {
        //     previousEvent = "";
        // }
        dispatch(resetData())
        if (teiId) {
            dispatch(getExistingEvent(orgUnit, teiId))
        }
        else {
           dispatch(initNewEvent(orgUnit))
        }
        setIsFirstRender(false)
    }, [])

    //for Previous event value
    useEffect(()=> {
        // dispatch(PreValue(previousValues))
        if (eventIDs && editable) {
            var isPrev = true
            for (let eventValues in previousValues) {
                    if (event["values"][eventValues] == "") {
                        dispatch(setEventValue(eventValues, previousValues[eventValues],isPrev))
                        // event["values"][eventValues] = previousValues[eventValues]
                    }
            }
            // dispatch(addExistingEvent(event))
            // dispatch(resetPreviousEntity())
        }
    }, [eventIDs])

    // for previous entity values

    useEffect(() => {
        if (previousValues.id) {
            dispatch(addEntity())
            dispatch(resetPreviousEntity())
        }
    }, [previousValues])
    useEffect(() => {
        if (error) history.goBack()
    }, [error])

    useEffect(() => {
        if (!isFirstRender && panelValid && pageFirst) dispatch(createNewEvent())
    }, [panelValid, pageFirst])
    const onClickNote = (e) => {
          e.preventDefault();
          setDialogNote(true);
      };
    const onDelete =(e) =>{
        e.preventDefault();
        $('#msg').show();
    }
    const onClickSave =(e)=>{
        e.preventDefault();
        setIsSave(true)
        setTimeout(()=>{
        setIsSave(false)
        },2000)
    }
    const  onCancel =(e) =>{
        e.preventDefault();
        if(pageFirst){
            history.goBack()
        }
           $("#panel").hide();
           $("#popup").hide();
    }

    const changeAggregationStatus = (status)=>{
        dispatch(setAggregationProgress(status))
        aggregationOnProgress = status
    }
   const onConfirm=async(e)=>{
        e.preventDefault();
        let eventID =localStorage.getItem('eventId')
        let res = await Aggregate(
            {
                event: event,
                teiAttributeValues : teiAttributeValues,
                operation: "INCOMPLETE",
                dataElements: dataElementObjects,
                categoryCombos: categoryCombos,
                dataSets: dataSets,
                orgUnit: orgUnit,
                programs: programs,
                sampleDate: sampleDate,
                changeStatus: changeAggregationStatus
            }
        )
        changeAggregationStatus(false);
        if(res.response){
            await deleteEvent(eventID).then(res => {
                if(res.httpStatus === 'OK')
                {
                    $('#success').show();
                }
            })
            $("#popup").hide();
            $("#panel").hide();
            $('#msg').hide();
        }
    }
   const onNo =(e) =>{
          e.preventDefault();
          setDialogNote(false);
          $("#popup").hide();
          $("#panel").hide();
          $('#msg').hide();
    }
    const onYes =(e) =>{
        window.location.reload(false)
        $("#popup").hide();
        $("#panel").hide();
        $("#cnote").hide();     
  }
    if (isFirstRender) return <TitleRow title="Record" history={history} />
    return (
        <MainSection padded>
            <TitleRow title="Record" history={history} />
            <form autoComplete="off">
                <Entity showEdit={true} />
                <div id="a">
                <Events />
                </div>
                { (eventEditable || editable) ? <div id='popup'>
                <SweetAlert
                style={{
                    width: '90%'
                }}
                openAnim={{ name: 'showSweetAlert', duration: 2000 }}
                closeAnim={{ name: 'hideSweetAlert', duration: 2000 }}
                customButtons={
                    <React.Fragment>
                         <EventButtons history={history} existingEvent={teiId} />&emsp;&emsp;
                         <Button  disabled={isOrganismDetected} primary={true} onClick={e=>onClickNote(e)}>Follow-up Notes</Button>&emsp;&emsp;
                        <div id="btn">
                        <Button  destructive={true} onClick={(e)=>onDelete(e)}>Delete</Button>&emsp;&emsp;
                        </div>
                      <Button onClick={(e)=>onCancel(e)}>Cancel</Button>
                    </React.Fragment>
                  }
                >
                <Panel />
                <Event />
               </SweetAlert>
                </div> :
                <div id="panel">
                <Panel showEdit={panelValid} />
                <Event />
                <EventButtons history={history} existingEvent={teiId} />
                </div>}
            </form>
            {dialogNote ? 
            <SweetAlert
            style={{
                width: '60%'
            }}
            openAnim={{ name: 'showSweetAlert', duration: 2000 }}
            closeAnim={{ name: 'hideSweetAlert', duration: 2000 }}
            customButtons={
                <React.Fragment>
                  <Button primary={true} onClick={(e)=>onClickSave(e)} >Save</Button>&emsp;&emsp;&emsp;
                  <Button disabled={aggregationOnProgress} onClick={(e)=>onNo(e)}>Cancel</Button>
                </React.Fragment>
              }
            >
            <ClinicianNote />
            </SweetAlert>
            :""}
            <div id="msg">
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                customButtons={
                    <React.Fragment>
                      <Button disabled={aggregationOnProgress} primary={true} onClick={(e)=>onConfirm(e)}>Yes</Button>&emsp;&emsp;&emsp;
                      <Button disabled={aggregationOnProgress} onClick={(e)=>onNo(e)}>No</Button>
                    </React.Fragment>
                  }
                >
                You will not able to recover this event Detail!
                </SweetAlert>
            </div>
            <div id='success'>
            <SweetAlert success title="Event Delete Success"
             customButtons={
                <React.Fragment>
                  <Button primary={true} onClick={(e)=>onYes(e)}>Ok</Button>&emsp;&emsp;&emsp;
                </React.Fragment>
              }
            >
            </SweetAlert>
            </div>
            { isSave ?
            <div id="cnote">
           <SweetAlert success title="Event save Success"
           customButtons={
              <React.Fragment>
                <Button primary={true} onClick={(e)=>onYes(e)}>Ok</Button>&emsp;&emsp;&emsp;
              </React.Fragment>
            }
          >
          </SweetAlert>
          </div>
            :""}
        </MainSection>
    )
}
export default withRouter(EventForm)
