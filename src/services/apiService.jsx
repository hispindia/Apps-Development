export const ApiService = {
    getReportList,
    getReport, 
};

async function getReportList() {
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

async function getReport(repID, orgUnitId, period) {
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
