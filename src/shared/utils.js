import { rowList } from "./constants";

export const filterAttrEvents = (tei, startDate, endDate, sample) => {
  const stageId = sample.split("-")[0];
  const sampleId = sample.split("-")[1];

  let teiEventArr = [];
  let attrs = {};
  tei.attributes.forEach((attr) => (attrs[attr.attribute] = attr.value));
  tei.enrollments.forEach((list) => {
    list.events.forEach((event) => {
      let ev = {},
        values = [];
      if (event.programStage == "zRUw1avYEvI") {
        event.dataValues.forEach((dv) => (ev[dv.dataElement] = dv.value));

        if (ev["rQnmYAF1899"])
          attrs["medicalHistory"] = `${
            ev["rQnmYAF1899"] ? ev["rQnmYAF1899"] : ""
          }`;
        else if (ev["gPHLt0PQq1b"])
          attrs["medicalHistory"] = `${
            ev["gPHLt0PQq1b"] ? ev["gPHLt0PQq1b"] : ""
          }`;
      } else if (event.programStage == stageId) {
        ev["eventId"] = event.event;
        let eventDate = event.eventDate ? event.eventDate.split("T")[0] : "";
        ev["eventDate"] = eventDate;
        ev["orgUnitName"] = event.orgUnitName;
        if (eventDate) {
          event.dataValues.forEach((dv) => (ev[dv.dataElement] = dv.value));
        }
        if (
          ev[sampleId] &&
          new Date(startDate) <= new Date(ev[sampleId]) &&
          new Date(endDate) >= new Date(ev[sampleId])
        ) {
          ev = { ...ev, ...attrs };
          if (rowList[sampleId]["isObj"]) {
            for (let id in rowList[sampleId]) {
              if (ev[id]) {
                let val = [];
                rowList[sampleId][id].forEach((ids) => {
                  if (ids == "Infant1" || ids == "Infant1" || ids == "Infant3")
                    val.push(`${ids}`);
                  else val.push(`${ev[ids] ? ev[ids] : ""}`);
                });
                values.push(val);
              }
            }
          } else {
            rowList[sampleId].forEach((ids) => {
              let val = `${ev[ids] ? ev[ids] : ""}`;
              values.push(val);
            });
          }
        }
      }
      if (values.length) {
        if (Array.isArray(values[0])) teiEventArr.push(...values);
        else teiEventArr.push(values);
      }
    });
  });
  return teiEventArr;
};

export const setDataElements = (tei, sample) => {
  const sampleId = sample.split("-")[1];
  const idValues = {};
  var dataElement = [];
  var deStatus = false;

  if (rowList[sampleId]["isObj"]) {
    let valCheck = {};
    tei.forEach((val) => (valCheck[val] = true));
    if (valCheck["Infant1"]) {
      rowList[sampleId][sampleId].forEach((id, index) => {
        if (id) idValues[id] = tei[index + 1];
        if (id == sampleId) deStatus = true;
        if (deStatus && id && tei[index + 1]) {
          dataElement.push({
            dataElement: id,
            value: tei[index + 1],
          });
        }
      });
    } else if (valCheck["Infant2"]) {
      rowList[sampleId]["GEqbUeytrHY"].forEach((id, index) => {
        if (id) idValues[id] = tei[index + 1];
        if (id == "GEqbUeytrHY") deStatus = true;
        if (deStatus && id && tei[index + 1]) {
          dataElement.push({
            dataElement: id,
            value: tei[index + 1],
          });
        }
      });
    } else if (valCheck["Infant3"]) {
      rowList[sampleId]["ZzlWdUjXGiL"].forEach((id, index) => {
        if (id) idValues[id] = tei[index + 1];
        if (id == "ZzlWdUjXGiL") deStatus = true;
        if (deStatus && id && tei[index + 1]) {
          dataElement.push({
            dataElement: id,
            value: tei[index + 1],
          });
        }
      });
    }
  } else {
    rowList[sampleId].forEach((id, index) => {
      if (id) idValues[id] = tei[index + 1];
      if (id == sampleId) deStatus = true;
      if (deStatus && id && tei[index + 1]) {
        dataElement.push({
          dataElement: id,
          value: tei[index + 1],
        });
      }
    });
  }

  return {
    event: idValues["eventId"],
    program: "L78QzNqadTV",
    dataValues: dataElement,
  };
};

export const setSortedDE = (teiEventVal, rawData) => {
  var de = {};
  rawData.dataValues.forEach((dv, index) => (de[dv.dataElement] = `${index}`));
  var newDE = teiEventVal.dataValues.filter((dv) => {
    if (!de[dv.dataElement]) return dv;
  });
  rawData.dataValues = [...newDE, ...rawData.dataValues];
  return rawData;
};
