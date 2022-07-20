export const DataElements = ()=> {
    const requestOptions = { method: 'GET', credentials: 'include' };
    return fetch('../../../api/dataElements.json?fields=name,code,id,displayName,formName,&paging=false', requestOptions).then(res => res.json());
}
