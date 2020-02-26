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
} from '@hisp-amr/app'
import { Entity } from './Entity'
import { EventButtons } from './EventButtons'
import Events from './Entity/EventList'

export const EventForm = ({ history, match }) => {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const dispatch = useDispatch()
    const error = useSelector(state => state.data.status) === ERROR
    const panelValid = useSelector(state => state.data.panel.valid)
    const orgUnit = match.params.orgUnit
    const teiId = match.params.teiId
    useEffect(() => {
        dispatch(resetData())
        if (teiId) dispatch(getExistingEvent(orgUnit, teiId))
        else dispatch(initNewEvent(orgUnit))
        setIsFirstRender(false)
    }, [])

    useEffect(() => {
        if (error) history.goBack()
    }, [error])

    useEffect(() => {
        if (!isFirstRender && panelValid) dispatch(createNewEvent())
    }, [panelValid])

    const onDeleteSucccess = () => history.goBack()

    if (isFirstRender) return <TitleRow title="Record" history={history} />

    return (
        <MainSection padded>
            <DeleteModal type="record" onDeleteSucccess={onDeleteSucccess} />
            <TitleRow title="Record" history={history} />
            <form autoComplete="off">
                <Entity showEdit={!panelValid} />
                <Events />
                <Panel showEdit={panelValid} />
                <Event />
            </form>
            {/* <EventButtons history={history} existingEvent={event} /> */}
        </MainSection>
    )
}

export default withRouter(EventForm)
