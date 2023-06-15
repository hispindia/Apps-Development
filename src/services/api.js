export const ApiService = {
  getViralLoadList,
  getTEI,
  getUserOU,
  pushTEIEvent,
  getEventValues
};

async function getUserOU() {
  let response = await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/me.json?fields=organisationUnits`,
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

async function getTEI(tei) {
  let response = await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/trackedEntityInstances/${tei}.json?paging=false&program=L78QzNqadTV&fields=attributes[attribute,value],enrollments[program,events[event,eventDate,dataValues,orgUnit,orgUnitName,programStage]]`,
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

async function getViralLoadList({
  orgUnitId,
  deId,
  stageId,
  startDate,
  endDate,
}) {
  let response = await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/sqlViews/DJsMmxyPwDu/data.json?paging=false&var=deId:${deId}&var=orgUnitId:${orgUnitId}&var=stageId:${stageId}&var=startdate:${startDate}&var=enddate:${endDate}`,
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

async function pushTEIEvent(rawData) {
  let response = await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/events/${rawData["event"]}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(rawData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let data = await response.json();
  return data;
}

async function getEventValues(rawData) {
  let eventRes =  await fetch(
    `${process.env.REACT_APP_DHIS2_BASE_URL}/api/events/${rawData["event"]}.json?paging=false`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );
  let data = await eventRes.json();
  return data;
}