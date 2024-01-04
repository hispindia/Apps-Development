export const ApiService = {
    getFundStatus,
    getFundDisbursed,
    getIPAUnits,
    getAssesmentScore
};

async function getFundDisbursed(rbfFund,ouList,period) {
    var orgUnitIds = ouList.map(ou => ou.id);
    const ouGroup = 'OU_GROUP-QbaIyUsVHJ9;OU_GROUP-qvN06qQw9Hr;OU_GROUP-D5YO4NsZtSp;OU_GROUP-u52bDIwLiOG;OU_GROUP-vTZ2yIeAi81';
    if(orgUnitIds.length == 1) orgUnitIds.push(ouGroup);

    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/analytics.json?dimension=dx:${rbfFund}&dimension=ou:${orgUnitIds.join(';')}&filter=pe:${period}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getFundStatus(fundIds,ouList,period) {
    var orgUnitIds = ouList.map(ou => ou.id);
    const ouGroup = 'OU_GROUP-QbaIyUsVHJ9;OU_GROUP-qvN06qQw9Hr;OU_GROUP-D5YO4NsZtSp;OU_GROUP-u52bDIwLiOG;OU_GROUP-vTZ2yIeAi81';
    if(orgUnitIds.length == 1) orgUnitIds.push(ouGroup);

    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/analytics.json?paging=false&dimension=dx:${fundIds.join(";")}&dimension=ou:${orgUnitIds.join(";")}&filter=pe:${period}&skipRounding=false&outputIdScheme=UID`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getIPAUnits(unitIds, ou, period) {
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/analytics.json?paging=false&dimension=dx:${unitIds}&filter=ou:${ou}&filter=pe:${period}&skipRounding=false&outputIdScheme=UID`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}

async function getAssesmentScore(scoreIds, ou, ouGroup, period) {
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/api/analytics.json?paging=false&dimension=dx:${scoreIds}&dimension=ou:${ou};${ouGroup}&dimension=pe:${period}&skipRounding=false&outputIdScheme=UID`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}
