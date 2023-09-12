import { ATTR_DE } from "./constants";

export const getBetweenDates = function (startDate) {
  var arr = [], startMonth, endMonth, startDay,
    lastDay;
  const today = new Date();
  var startYear = startDate.split("-");
  var endYear = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`.split('-');

  for (var i = parseInt(startYear["0"]); i <= parseInt(endYear["0"]); i++) {
    startMonth = i > parseInt(startYear["0"]) ? 1 : parseInt(startYear["1"]);
    endMonth = i == endYear["0"] ? endYear["1"] : 12;

    for (var j = startMonth; j <= endMonth; j++) {
      startDay =
        i == startYear["0"] && startMonth == j ? parseInt(startYear["2"]) : 1;
      lastDay =
        endYear["0"] == i && endMonth == j
          ? endYear["2"]
          : new Date(i, j, 0).getDate();

      for (var k = startDay; k <= lastDay; k++) {
        let checkMonth = j < 10 ? i + "0" + j : i + "" + j;
        let value = k < 10 ? checkMonth + "0" + k : checkMonth + "" + k;
        arr.push(value);
      }
    }
  }

  return arr;
};

export const arrangeTeiElements = (res) => {
  const teiList = [];
  res.trackedEntityInstances.forEach((data) => {
    const tei = {};
    data.attributes.forEach((attr) => (tei[attr.attribute] = attr.value));
    data.enrollments.forEach((enrollment) => {
      tei["ouname"] = enrollment.orgUnitName;
      var events = enrollment.events.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
      events.forEach((event) => {
        if (event.programStage == "wmKHppc1gL7" && event.eventDate)
          tei["eventDate"] = event.eventDate.split("T")[0];
        event.dataValues.forEach((dv) => (tei[dv.dataElement] = dv.value));
      });
    });
    if (tei["QB79pRV2LqV"]) {
      let missedDays = getBetweenDates(tei["QB79pRV2LqV"]);
      tei["missedDays"] = missedDays.length;
    }
    const teiValues = ATTR_DE.map((data) => {
      return tei[data.id] ? tei[data.id] : "";
    });
    if(!tei['uQwJ1KDketQ']) teiList.push(teiValues);
  });
  return teiList;
};
