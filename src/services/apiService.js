export  const ApiService = {
    getDataSets,
    getOU,
    getOUAssginedDS,
    postOUAssginedDS
};
function getDataSets() {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch( `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataSets.json?paging=false`, requestOptions).then(res => res.json());
}
function getOU(ou) {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch( `${process.env.REACT_APP_DHIS2_BASE_URL}/api/organisationUnits/${ou}.json?fields=id,name,children[id,name]&paging=false`, requestOptions).then(res => res.json());
}
function getOUAssginedDS() {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch( `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataSets.json?fields=id,name,organisationUnits[id,name]&paging=false`, requestOptions).then(res => res.json());
}
function postOUAssginedDS(data, id) {
    const requestOptions = { method: 'POST', credentials: 'include', body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
     }
     };
    return fetch( `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataSets/${id}/organisationUnits.json`, requestOptions).then(res => res.json());
}