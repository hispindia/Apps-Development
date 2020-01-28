import { BaseUrl } from '../services/EventService';
export const ApiService = {
    getProgram,
    getProgramStage,
    getDataElements,
    getTrackedEntityInstance,
    postEvent
};
function getProgram(id) {
    const requestOptions = { method: 'GET' };
    return fetch(BaseUrl + '/api/organisationUnits/' + id + '.json?fields=id,name,programs[id,name,code]&paging=false', requestOptions).then(res => res.json());
}

function getProgramStage(id) {
    const requestOptions = { method: 'GET' };
    return fetch(BaseUrl+"/api/programs/"+id +".json?fields=id,name,programStages[id,name,code]&paging=false", requestOptions).then(res => res.json());
}

function getDataElements(id) {
    const requestOptions = { method: 'GET' };
    return fetch( BaseUrl+"/api/programStages/"+id+".json?fields=id,name,programStageSections[id,name,dataElements[id,name,formName,valueType]]&paging=false", requestOptions).then(res => res.json());
}

function getTrackedEntityInstance(data) {
    const requestOptions = { method: 'GET' };
    return fetch( BaseUrl + '/api/trackedEntityInstances.json?program=' + data.program + '&ou=' + data.ou + '', requestOptions).then(res => res.json());
}

function postEvent(event) {
    const requestOptions = { 
         method: 'POST',
         body: JSON.stringify(event), 
         headers: {
                'Content-Type': 'application/json'}
                };
    return fetch( BaseUrl + '/api/events', requestOptions).then(res => res.json());
}