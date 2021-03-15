export const ApiService = {
    getReports,
    getAReports,
    getUserData,
    getDocumentsData,
    getReportData,
    saveReportConfiguration,
    getAllReportSection



};

async function getUserData(){
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/userGroups.json?fields=[id,name]&paging=false`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getReportData(){
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/reports.json?fields=[id,name,userGroupAccesses]&paging=false`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getDocumentsData(){
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/documents.json?fields=[id,name]&paging=false`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}


async function getReports() {
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/reports.json?fields=[id,name,reportParams]&paging=false`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getAReports(repID, orgUnitId, period) {
    var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/reports/${repID}/data.html?t=${new Date().getTime()}&ou=${orgUnitId}`
    if (period) url += `&pe=${period}&date=${period}-01-01`

    let response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    if (response.status == "200") {
        let data = await response.text();
        return data;
    }
    else {
        throw "Error: Report generation failed, Please try again!";
    }
}


// This method for savingConfiguration
async function saveReportConfiguration (configuration) {
    
    var key = 'report_confD';
    var namespace = 'report_configurationValue'
    var reportConfigurationJson = JSON.stringify(configuration);

    var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataStore/${key}`;


    let response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
        });


        let data = await response.json()

        if (data[0] == namespace) {

            url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataStore/${key}/${namespace}`;

            const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json',
                    Authorization : `Basic ${btoa('ram:Ram@1234')}`, },
                    body: reportConfigurationJson,
                };

            const response = await fetch(url, requestOptions);
            if(response.status=='200'){
                return "Updated"
            }

            }       

        else{
                    
                url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataStore/${key}/${namespace}`;

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',
                    Authorization : `Basic ${btoa('ram:Ram@1234')}`, },
                    body: reportConfigurationJson,
                };

                const response = await fetch(url, requestOptions);
                // let data = await response.json();
                    

                if(response.status == "201"){
                    return "Created"
                    
                }
                else {
                    throw "Error: Report generation failed, Please try again!";
                }
                
                
        }        

}


async function getAllReportSection(){

    var key = 'reportApp-section-json';
    var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/dataStore/${key}/${key}`;

    let response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
    });

    let data = await response.json();
    return data;

}
