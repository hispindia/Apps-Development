// http://localhost:8090/amr/api/events.json?orgUnit=bLfOUtl4eZd&trackedEntityInstances=UcGNwlCCyWg&paging=false
import { get, request } from '@hisp-amr/api'
export const getAllEvents = async (ou, teiId) =>
    await get(
        request(
            'events.json?orgUnit=' +
                ou +
                '&program=L7bu48EI54J&trackedEntityInstances=' +
                teiId,
            {
                fields: '',
            }
        )
    )

export const getPersonVal = async teiId =>
    await get(
        request('trackedEntityInstances/' + teiId + '.json', {
            fields: '',
        })
    )
// http://localhost:8090/amr/api/trackedEntityInstances/UcGNwlCCyWg.json
