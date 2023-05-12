
export const DataElements = {
    loadDataElements,
    pushEvent
};
function loadDataElements() {
    const requestOptions = { method: 'GET', };
    return fetch('../../../api/dataElements.json?fields=name,code,id,displayName,formName,&paging=false', requestOptions).then(res => res.json());
}
function pushEvent(values, event, de) {
    const requestOptions = {
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(values),
        headers: { 
        "Content-Type": "application/json",
       },
      };
    return fetch('../../../api/events/'+event+'/'+de, requestOptions).then(res => res.json());
}
