export const ApiService = {
  getTeiList,
};

//   let response = await fetch(
//     `${process.env.REACT_APP_DHIS2_BASE_URL}/api/analytics/enrollments/query/bASezt1TUKD.json?dimension=pe:THIS_YEAR;LAST_YEAR&dimension=ou:${orgUnit}&dimension=wmKHppc1gL7.P3Spi0kT92n&dimension=wmKHppc1gL7.n2gG7cdigPc&dimension=BrZ8MF97cDH.kQzpqh4JL7l&dimension=BrZ8MF97cDH.nVU4BU2jHc3&dimension=BrZ8MF97cDH.x3s6CXPdNjd&dimension=BrZ8MF97cDH.ts9LEoIEJWC&dimension=wmKHppc1gL7.icJeQiH7vf3&dimension=wmKHppc1gL7.QB79pRV2LqV&stage=wmKHppc1gL7&displayProperty=NAME&totalPages=false&outputType=ENROLLMENT&desc=enrollmentdate&paging=false`,
// {

async function getTeiList(orgUnit) {
  let response = await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/trackedEntityInstances.json?skipPaging=true&program=bASezt1TUKD&ou=${orgUnit}&ouMode=DESCENDANTS&fields=orgUnit,trackedEntityInstance,attributes[attribute,value],enrollments[orgUnitName,events[programStage,eventDate,dataValues[dataElement,value]]]`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  let data = await response.json();
  return data;
}
