
export const trackedEntityInstance = {
  filter: async (orgUnitId, programId, attributeId, value) => {
    var url = `${process.env.REACT_APP_URL}/trackedEntityInstances.json?fields=orgUnit,trackedEntityInstance,trackedEntityType,attributes[attribute,value],enrollments[events[programStage,eventDate,dataValues[dataElement,value]]]&ouMode=DESCENDANTS&ou=${orgUnitId}&program=${programId}&filter=${attributeId}:eq:${value}`;
    let response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
    });
    let data = await response.json();

    return data;
  },
};
