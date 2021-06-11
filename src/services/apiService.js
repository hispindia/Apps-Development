import {
  program,
  orgUnit,
  covacVaccine,
  covacDose,
  trackedEntityAttributes,
} from "../config";

const requestOptions = { method: "GET", credentials: "include" };

export function getTEI(valueType, value) {
  return fetch(
    `../../trackedEntityInstances.json?program=${program}&ou=${orgUnit}&paging=false&ouMode=DESCENDANTS&filter=${trackedEntityAttributes[valueType]}:eq:${value}`,
    requestOptions
  ).then((res) => res.json());
}
export function getEvents(id) {
  return fetch(
    `../../events.json?program=${program}&trackedEntityInstance=${id}&paging=false`,
    requestOptions
  ).then((res) => res.json());
}
export function getCovacVaccineNames() {
  return fetch(
    `../../optionSets/${covacVaccine}.json?fields=id,name,options[id,name,code]&paging=false`,
    requestOptions
  ).then((res) => res.json());
}
export function getCovacDose() {
  return fetch(
    `../../optionSets/${covacDose}.json?fields=id,name,options[id,name,code]&paging=false`,
    requestOptions
  ).then((res) => res.json());
}
