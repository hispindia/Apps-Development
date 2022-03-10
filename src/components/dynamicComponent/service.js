export const ApiService = {
    getIndicatorGroups,
    getOrgUnits,
    getJsonData
};
function getOrgUnits() {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('http://afgamis.org/afga/api/organisationUnitGroups/GhuHmwRnPBs.json?fields=id,name,organisationUnits[id,name]&paging=false', requestOptions).then(res => res.json());
}
function getIndicatorGroups() {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('http://afgamis.org/afga/api/indicatorGroups.json?fields=id,name&paging=false&filter=name:like:indMappingGroup', requestOptions).then(res => res.json());
}
function getJsonData(apipath, ou, pe) {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('http://afgamis.org/afga'+apipath+"&dimension=pe:"+pe+"&dimension=ou:"+ou, requestOptions).then(res => res.json());
}

