
export const DataElements = {
    loadDataElements
};
function loadDataElements() {
    const requestOptions = { method: 'GET', };
    return fetch('../../../api/dataElements.json?fields=name,code,id,displayName,formName,&paging=false', requestOptions).then(res => res.json());
}

