import { ATTR_DE } from "./constants";

export const tableToExcel = (function () {
  var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
  return function (table, name, filename) {
      if (!table.nodeType) table = document.getElementById(table)
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      document.getElementById("dlink").href = uri + base64(format(template, ctx));
      document.getElementById("dlink").download = filename;
      document.getElementById("dlink").click();
  }
})()

export const getBetweenDates = function (startDate) {
  var arr = [],
    startMonth,
    endMonth,
    startDay,
    lastDay;
  const today = new Date();
  var startYear = startDate.split("-");
  var endYear = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`.split("-");

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
    var tei = {};
    var currEv = {};
    data.attributes.forEach((attr) => (tei[attr.attribute] = attr.value));
    data.enrollments.forEach((enrollment) => {
      tei["ouname"] = enrollment.orgUnitName;
      var events = enrollment.events.sort(
        (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
      );
      events.forEach((event) => {
        if (
          (event.programStage == "wmKHppc1gL7" ||
            event.programStage == "uMYfp6QX2d0") &&
          event.eventDate
        )
        currEv["eventDate"] = event.eventDate.split("T")[0];
        event.dataValues.forEach((dv) => (currEv[dv.dataElement] = dv.value));

        if(currEv['zkFIdGgOThz']) currEv = {};
        if (currEv["QB79pRV2LqV"]) {
          let missedDays = getBetweenDates(currEv["QB79pRV2LqV"]);
          currEv["missedDays"] = missedDays.length;
        }
      });
    });
    if(currEv["missedDays"]) {
      tei = {...tei, ...currEv};
      const teiValues = ATTR_DE.map((data) => {
        return tei[data.id] ? tei[data.id] : "";
      });
      teiList.push(teiValues);
    }

  });
  return teiList;
};
