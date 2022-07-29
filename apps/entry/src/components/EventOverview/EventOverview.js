import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    MainSection,
    LoadingSection,
    TitleRow,
    RichButton,
    setDataELments
} from '@hisp-amr/app'

import { Table } from './Table'
import { useEvents } from './useEvents'
import { icmr, tanda } from 'config'
import {DataElements} from '../../api/dataElements'
if (!process.env.REACT_APP_DHIS2_TABLE_CONFIG)
    throw new Error(
        'The environment variable REACT_APP_DHIS2_TABLE_CONFIG must be set'
    )

const { titles, headers } = { icmr, tanda }[
    process.env.REACT_APP_DHIS2_TABLE_CONFIG
]

const title = {
    true: 'You cannot add records for the selected location',
    false: 'Add new record',
}

/**
 * Shows events by status.
 */
export const EventOverview = ({ match, history }) => {
    const status = match.params.status
    const dispatch = useDispatch()
    const selected = useSelector(state => state.selectedOrgUnit)
    const { rows, loading, addButtonDisabled, error } = useEvents(status)
    useEffect(() => {
        DataElements.loadDataElements().then(res =>{
            dispatch(setDataELments(res.dataElements));
        })
    })




    /**
     * Called when table row is clicked.
     */
    const onEventClick = row => {
        history.push(`/orgUnit/${row[6]}/trackedEntityInstances/${row[7]}`)
    }

    /**
     * On table add click.
     */
    const onAddClick = () =>history.push(`/orgUnit/${selected.id}/event/`)
    return (
        <MainSection>
            <TitleRow
                // title={titles[status]}
                button={
                    <div title={title[addButtonDisabled]}>
                        <RichButton
                            primary
                            large
                            icon="add"
                            label="Add record"
                            disabled={addButtonDisabled}
                            onClick={onAddClick}
                        />
                    </div>
                }
            />
            {!error &&
                (loading ? (
                    <LoadingSection />
                ) : (
                    <Table
                        rows={rows}
                        headers={headers}
                        onEventClick={onEventClick}
                        title={selected.displayName}
                    />
                ))}
        </MainSection>
    )
}
