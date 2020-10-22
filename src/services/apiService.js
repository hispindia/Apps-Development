import { BaseUrl } from './BaseUrlService';
export const ApiService = {
    getTrackedEntityInstance,
    postEvent,
    getMetaData,
    getProgramTEIAttribute,
    getUserData,
    getEvents,
    getOUCondition,
    getOUGroup
};
function getTrackedEntityInstance(data) {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch( BaseUrl + '/api/trackedEntityInstances.json?program=' + data.program + '&ou=' + data.ou + '', requestOptions).then(res => res.json());
}

function postEvent(event) {
    const requestOptions = { 
         method: 'POST',
         credentials: 'include',
         body: JSON.stringify(event), 
         headers: {
                'Content-Type': 'application/json'}
                };
    return fetch( BaseUrl + '/api/events', requestOptions).then(res => res.json());
}
function getEvents(teiId, pragramId ,orgUnitId) {
    const requestOptions = { 
         method: 'GET', 
         credentials: 'include',
         headers: {
                'Content-Type': 'application/json'}
                };
    return fetch( BaseUrl + '/api/events?trackedEntityInstance='+teiId+'&program='+pragramId+'&orgUnit='+orgUnitId+'&paging=false', requestOptions).then(res => res.json());
}
function getUserData() {
    const requestOptions = { method: 'GET', credentials: 'include'};
    return fetch( BaseUrl + '/api/me.json?paging=false&fields=organisationUnits,userGroups,userCredentials[username]', requestOptions).then(res => res.json());
}
function getMetaData() {
    const requestOptions = { method: 'GET', credentials: 'include',};
    return fetch( BaseUrl + '/api/metadata.json?paging=false&fields=programRuleVariableSourceType,attributeValues[attribute[id,name,code],value],children,condition,code,dataElement,displayName,formName,id,name,options,organisationUnits,path,priority,program,programRuleActions[programRuleActionType,dataElement,optionGroup,content,trackedEntityAttribute,programStageSection,data],programStage,programStages[id,attributeValues[attribute[id,name,code],value],displayName,access,programStageDataElements[dataElement[id],compulsory,formName],programStageSections[id,name,formName,displayName,renderType,dataElements[id,name,formName,displayFormName,code,valueType,optionSetValue,optionSet[id,name,displayName,options[id,code,name,displayName]]]]],trackedEntityTypeAttributes[name,id,displayName,valueType,unique,optionSetValue,optionSet,mandatory,trackedEntityAttribute[name,id,displayName,valueType,unique,optionSetValue,optionSet]],value&order=level:asc&constants=true&dataElements=true&optionGroups=true&options=true&optionSets=true&organisationUnits=true&programRules=true&programRuleVariables=true&programs=true&trackedEntityTypes=true', requestOptions).then(res => res.json());
}

// get data using programStageSections id
function getProgramTEIAttribute(id ) {
    const requestOptions = { method: 'GET', credentials: 'include',};
    return fetch( BaseUrl + '/api/programs/'+id+'.json?fields=id,displayName,programTrackedEntityAttributes[mandatory,displayInList,valueType,optionSetValue,optionSet[id,name,formName,valueType,options[id,name,valueType]],trackedEntityAttribute[id,displayName]]&paging=false', requestOptions).then(res => res.json());
}
function getOUGroup(){
    const requestOptions = { method: 'GET', credentials: 'include',};
    return fetch(BaseUrl + '/api/organisationUnitGroups.json', requestOptions).then(res => res.json())
}
function getOUCondition(id){
    const requestOptions = { method: 'GET', credentials: 'include',};
    return fetch(BaseUrl + '/api/organisationUnitGroups/'+id+'.json', requestOptions).then(res => res.json())
}
