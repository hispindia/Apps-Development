import React from 'react'
import { CardSection, LoadingSection } from '@hisp-amr/app'
import { useSelector, useDispatch } from 'react-redux'
import {
    Table,
    TableRowHead,
    TableCellHead,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui-core'
const Events = () => {
    const dispatch = useDispatch()
    var events = useSelector(state => state.data.eventList)
    var val = () => {
        if (events != undefined) {
            const v = events.map(ele => (
                <TableRow>
                    <TableCell>Program :</TableCell>
                    <TableCell>{ele.program}</TableCell>
                    <TableCell>OrgUnit :</TableCell>
                    <TableCell>{ele.orgUnitName}</TableCell>
                    <TableCell>Event Date :</TableCell>
                    <TableCell>{ele.eventDate}</TableCell>
                </TableRow>
            ))
            return v
        }
    }
    // console.log('here is data state', events, val())

    return (
        <CardSection heading="Event Lists">
            <Table>
                <TableHead></TableHead>
                <TableBody>{val()}</TableBody>
            </Table>
        </CardSection>
    )
}
export default Events
