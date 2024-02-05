export const ApiService = {
    getFunds
};

async function getFunds(period) {
    let response = await fetch(`${process.env.REACT_APP_DHIS2_BASE_URL}/analytics.json?paging=false&dimension=dx:R0JHwxWssuD;yzCH9OyAHf9;ArM16lmaMz8;CiLKJuIxMHh&dimension=pe:${periods}&skipRounding=false&outputIdScheme=UID&filter=ou:lAHU0RDtd2U`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        }
    });

    let data = await response.json();
    return data;
}
