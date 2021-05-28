export  const ApiService = {
    getTEI,
    getEvents,
    getCovacVaccineNames,
    getCovacDose
};

function getTEI() {    
    return fetch( 'https://li1637-34.members.linode.com/epi/api/trackedEntityInstances.json?program=yDuAzyqYABS&ou=AnO97v1hLDU&paging=false&ouMode=DESCENDANTS&fields=orgUnit,trackedEntityInstance,attributes[displayName,attribute,value]', {
        method: 'GET',
        headers: {
            "Content-Type": "text/plain",
            'Authorization': `Basic ${process.env.REACT_APP_AUTH}`,
        }}).then(res => res.json());
}
function getEvents(id) {
    return fetch( 'https://li1637-34.members.linode.com/epi/api/events.json?program=yDuAzyqYABS&trackedEntityInstance='+id+'&paging=false', {
        method: 'GET',
        headers: {
            "Content-Type": "text/plain",
            'Authorization': `Basic ${process.env.REACT_APP_AUTH}`,
        }}).then(res => res.json());
}

function getCovacVaccineNames(id) {
    return fetch( 'https://li1637-34.members.linode.com/epi/api/optionSets/VQo3HkUlMHc.json?fields=id,name,options[id,name,code]&paging=false', {
        method: 'GET',
        headers: {
            "Content-Type": "text/plain",
            'Authorization': `Basic ${process.env.REACT_APP_AUTH}`,
        }}).then(res => res.json());
}
function getCovacDose(id) {
    return fetch( 'https://li1637-34.members.linode.com/epi/api/optionSets/oj3CWm4hpPb.json?fields=id,name,options[id,name,code]&paging=false', {
        method: 'GET',
        headers: {
            "Content-Type": "text/plain",
            'Authorization': `Basic ${process.env.REACT_APP_AUTH}`,
        }}).then(res => res.json());
}