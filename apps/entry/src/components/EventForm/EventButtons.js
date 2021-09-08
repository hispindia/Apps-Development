import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import {
    ButtonRow,
    submitEvent,
    editEvent,
    setDeletePrompt,
    DUPLICATE_ERROR,
    setAggregationProgress,
} from '@hisp-amr/app'
import {
    Aggregate
} from '../../api/helpers/aggregate'

const StyledButtonRow = styled(ButtonRow)`
    margin: 0px;
`

export const EventButtons = ({ history, existingEvent }) => {
    const dispatch = useDispatch()
    const buttonsDisabled = useSelector(state => state.data.buttonsDisabled)
    var btnStatus = useSelector(state => state.data.btnStatus)
    const status = useSelector(state => state.data.event.status)
    const event = useSelector(state => state.data.event)
    const eventId = useSelector(state => state.data.event.id)
    const invalid = useSelector(state => state.data.event.invalid)
    const duplicate = useSelector(state => state.data.event.duplicate)
    const exit = useSelector(state => state.data.exit)
    const dataElementObjects = useSelector(state=> state.metadata.dataElementObjects)
    const programs = useSelector(state=>state.metadata.programs)
    const categoryCombos = useSelector(state=> state.metadata.categoryCombos)
    const dataSets = useSelector(state=>state.metadata.dataSets)
    const orgUnit = useSelector(state=>state.data.orgUnit)
    const buttonLoading = useSelector(state => state.data.buttonLoading)
    const pageFirst = useSelector(state => state.data.pageFirst)
    const removeButtton = useSelector(state => state.data.removebtn)
    const prevValues = Object.keys(useSelector(state => state.data.previousValues)).length ? true : false;
    const isCompleteClicked = useSelector(state => state.data.completeClicked)
    const entityValid = useSelector(state => state.data.entity.valid)
    var { sampleDate, defaultProgram } = useSelector(state => state.data.panel)
    var editable = useSelector(state => state.data.editable)
    var addSampleValid = (defaultProgram.length && !editable && sampleDate) ? false : true
    var aggregationOnProgress = useSelector(state => state.data.aggregationOnProgress)
    var { program } = useSelector(state => state.data.panel);

    useEffect(() => {
        if (exit) history.goBack()
    }, [exit, history])

    const changeAggregationStatus = (status)=>{

        dispatch(setAggregationProgress(status))
        aggregationOnProgress = status
    }

    const onSubmit = async addMore => {
        if (!removeButtton) {
            let res = await Aggregate({
                event: event,
                operation: "COMPLETE",
                dataElements: dataElementObjects,
                categoryCombos: categoryCombos,
                dataSets: dataSets,
                orgUnit: orgUnit.id,
                programs: programs,
                sampleDate: sampleDate,
                changeStatus: changeAggregationStatus
            })
            if (res.response) {
                console.log(" Aggregation response ", res, res.response)
                await dispatch(submitEvent(addMore))
            }
                    changeAggregationStatus(false);
        }
        else {
            await dispatch(submitEvent(addMore))
        }
    }

    const submitExit = async () => await onSubmit(false)
    const submitAdd = async () => await onSubmit(true)

    const onEdit = async () => {
        let res = await Aggregate({
            event:event,
            operation:"INCOMPLETE",
            dataElements:dataElementObjects,
            categoryCombos: categoryCombos,
            dataSets: dataSets,
            sampleDate: sampleDate,
            orgUnit: orgUnit.id,
            programs: programs,
            changeStatus : changeAggregationStatus
        })

        if(res.response){
            await dispatch(editEvent())
        }
        changeAggregationStatus(false);
    }

    const editButton = {
        label: 'Edit',
        onClick: onEdit,
        disabled: buttonsDisabled || !status.editable || btnStatus || aggregationOnProgress,
        icon: 'edit',
        primary: true,
        tooltip:
            buttonsDisabled || !status.editable
                ? 'Records with this approval status cannot be edited'
                : 'Edit record',
        loading: buttonLoading === 'edit',
    }

    const submitAddButton = {
        label: 'Submit and add new',
        onClick: submitAdd,
        disabled: buttonsDisabled || !!invalid || aggregationOnProgress,
        icon: 'add',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record and add new record for the same person',
        loading: buttonLoading === 'submitAdd',
    }

    const submitButton = {
        label: 'Submit',
        onClick: submitExit,
        disabled: buttonsDisabled || !!invalid || aggregationOnProgress,
        icon: 'done',
        primary: true,
        tooltip:
            duplicate === DUPLICATE_ERROR
                ? DUPLICATE_ERROR
                : invalid
                ? invalid
                : 'Submit record',
        loading: buttonLoading === 'submit',
    }

    const buttons = () =>
        existingEvent && !pageFirst
            ? !eventId
                ? []
                : [status.completed ? editButton : submitButton]
            : removeButtton ? [submitButton]: [submitAddButton, submitButton]
    return <StyledButtonRow buttons={buttons()} />
}
