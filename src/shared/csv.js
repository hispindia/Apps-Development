import {headerNames} from './constants';

export function downloadCSV(reportName, sample,  CSVFile) {
  var head = headerNames[sample]['values'];
  
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8,";

  let arr = head.join(",");
  CSVFile.forEach((row, index) => {
    arr += "\n";
    arr += [(index+1), ...row].join(",");
  });
  
  hiddenElement.href += arr;
  hiddenElement.target = "_blank";
  hiddenElement.download = `${reportName}_${headerNames[sample]['name']}.csv`;
  hiddenElement.click();
}
