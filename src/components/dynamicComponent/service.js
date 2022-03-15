export const ApiService = {
    getIndicatorGroups,
    getOrgUnits,
    getJsonData
};
function getOrgUnits(cbdOrgUnitGrp) {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('../../../api/organisationUnitGroups/' +cbdOrgUnitGrp+ '.json?fields=id,name,organisationUnits[id,name]&paging=false', requestOptions).then(res => res.json());
}
function getIndicatorGroups() {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('../../../api/indicatorGroups.json?fields=id,name&paging=false&filter=name:like:indMappingGroup', requestOptions).then(res => res.json());
}
function getJsonData(apipath, ou, pe) {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('../../..'+apipath+"&dimension=pe:"+pe+"&dimension=ou:"+ou, requestOptions).then(res => res.json());
}

