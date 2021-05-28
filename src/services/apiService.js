export  const ApiService = {
    getTEI,
    getEvents,
    getCovacVaccineNames,
    getCovacDose
};
function getTEI() {
    const requestOptions = { method: 'GET', credentials: 'include'};
    return fetch( '../../trackedEntityInstances.json?program=yDuAzyqYABS&ou=AnO97v1hLDU&paging=false&ouMode=DESCENDANTS&fields=orgUnit,trackedEntityInstance,attributes[displayName,attribute,value]', requestOptions).then(res => res.json());
}
function getEvents(id) {
    const requestOptions = { method: 'GET', credentials: 'include'};
    return fetch( '../../events.json?program=yDuAzyqYABS&trackedEntityInstance='+id+'&paging=false', requestOptions).then(res => res.json());
}
function getCovacVaccineNames() {
    const requestOptions = { method: 'GET', credentials: 'include'};
    return fetch( '../../optionSets/VQo3HkUlMHc.json?fields=id,name,options[id,name,code]&paging=false', requestOptions).then(res => res.json());
}
function getCovacDose() {
    const requestOptions = { method: 'GET', credentials: 'include'};
    return fetch( '../../optionSets/oj3CWm4hpPb.json?fields=id,name,options[id,name,code]&paging=false', requestOptions).then(res => res.json());
}