import { teiAttrs } from '../constants';
import { get } from './crud';

async function getPrograms() {
    const url = 'programs.json?paging=false'
    const data = await get(url);
    return data;
}

async function getTEIList(orgUnitId, programId, refarralId) {
    // returns tei, orgUnit,  status
    var transferOut = `sqlViews/md6JPyMPUFs/data.json?paging=false&var=program:${programId}&var=orgunit:${orgUnitId}`
    // returns tei, orgUnit,  status
    var transferIn = `sqlViews/DZ7bUYDn73b/data.json?paging=false&var=program:${programId}&var=orgunit:${orgUnitId}`

    var url = Number(refarralId) ? transferOut : transferIn;
    var trackedEntityInstances = await get(url).listGrid.rows;

    var trackedEntityScheduled = [];
    if(trackedEntityInstances.length) {        
        for(let i = 0; i < trackedEntityInstances.length; i++) {
            let transferredTEI = {};
            transferredTEI = await getEvents(orgUnitId, programId, trackedEntityInstances[i]["0"], refarralId);
            if(Object.keys(transferredTEI).length) trackedEntityScheduled.push(transferredTEI);      
        }
        return trackedEntityScheduled;
    }
    else {
        throw "Info: No Tracked Entity Instance found";
    }    
}

async function getEvents(orgUnitId, programId, teiId, refarralId) {
    //returns orgUnit, tei, enrollment, event, created, status, duedate, eventdate
    var url = `sqlViews/z85tCREJObG/data.json?paging=false&var=program:${programId}&var=tei:${teiId}`
    var events = await get(url).listGrid.rows;    
    if(events.length >= 2) {
        if(!Number(refarralId) && events["0"]["0"] != events["1"]["0"] && orgUnitId == events["0"]["0"])  return await teiAttrValues(orgUnitId, teiId, programId, events["0"]["6"])
        if(Number(refarralId) && orgUnitId == events["1"]["0"] && orgUnitId != events["0"]["0"])  return await teiAttrValues(orgUnitId, teiId, programId, events["1"]["7"])
    }
    return {};
}

async function teiAttrValues(orgUnitId, teiId, programId, date) {
    var url = `trackedEntityInstances/${teiId}.json?paging=false&program=${programId}`
    var tei = await get(url);
    var teiAttrValue = {
        programId: programId,
        teiId: teiId,
        orgUnitId: orgUnitId,
        Date: date.split("T")["0"]
    };    
    teiAttrs.forEach(teiAttr => {
        let attrValue = tei.attributes.find(attr => (attr.attribute == teiAttr["id"]) );
        if(attrValue) teiAttrValue[teiAttr["name"]] = attrValue.value;        
    });
    return teiAttrValue;
}

export const ApiService = {
    getPrograms,
    getTEIList, 
};