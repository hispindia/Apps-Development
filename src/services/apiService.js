export  const ApiService = {
    getTEI,
    getEvents
};
const requestOptions = {
    method: 'GET',
    headers: {
        "Content-Type": "text/plain",
        'Authorization': 'Basic d2hvOkFpaGFtQEAyMDIx',
    }};

function getTEI() {    
    return fetch( 'https://li1637-34.members.linode.com/epi/api/trackedEntityInstances.json?program=yDuAzyqYABS&ou=AnO97v1hLDU&paging=false&ouMode=DESCENDANTS&fields=orgUnit,trackedEntityInstance,attributes[displayName,attribute,value]', requestOptions).then(res => res.json());
}
function getEvents(id) {
    return fetch( 'https://li1637-34.members.linode.com/epi/api/events.json?program=yDuAzyqYABS&trackedEntityInstance='+id+'&paging=false', requestOptions).then(res => res.json());
}