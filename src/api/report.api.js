export const ApiService = {
  getReport,
};

async function getReport(id, ou, period) {
  var url = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/reports/${id}/data.html?t=${new Date().getTime()}&ou=${ou}`
  if (period) url += `&pe=${period}&date=${period}-01-01`;

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
      let err =  await response.text();
      throw `Error: Report generation failed, Please try again!
      (${err})`;
  }
}