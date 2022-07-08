
export const SelectedOrgUnit = {
    programs
};
function programs(orgUnit) {
    const requestOptions = { method: 'GET', };
    return fetch( '../../../api/organisationUnits/'+orgUnit+'.json?fields=id,name,programs[id,name]&paging=false', requestOptions).then(res => res.json());
}

