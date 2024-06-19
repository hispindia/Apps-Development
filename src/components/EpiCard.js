import React, { useState, useEffect } from "react";
import { CircularLoader } from "@dhis2/ui";
import { ApiService } from "../services/api";
import QRCode from "react-qr-code";
import {
  attributeId,
  attributes,
  events,
  orgUnitId,
  programId,
} from "../constants.js";

export default function EpiCard({ orgUnits, uid }) {
  const [teiValues, setTeiValues] = useState({});
  const [exist, setExist] = useState(true);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (uid) {
      setLoading(true);
      setTeiValues({});
      setExist(true);
      setPath([]);
      const fetchData = async () => {
        let response = await ApiService.trackedEntityInstance.filter(
          orgUnitId,
          programId,
          attributeId,
          uid
        );
        if (response.trackedEntityInstances.length) {
          let values = {};
          let orgUnit = response.trackedEntityInstances[0].orgUnit;
          if(orgUnits[orgUnit]) {
            let path = orgUnits[orgUnit].path.split('/');
            path = path.map(ou => (ou && orgUnits[ou]) ? orgUnits[ou].name: '');
            setPath(path);
          }
          response.trackedEntityInstances[0].attributes.forEach(
            (attr) => (values[attr.attribute] = attr.value)
          );
          response.trackedEntityInstances[0].enrollments.forEach((enrollment) =>
            enrollment.events.forEach((event) => {
              if (event.eventDate && event.programStage == "s53RFfXA75f") {
                let eventDate = event.eventDate.split("T")["0"];
                event.dataValues.forEach(
                  (dv) =>
                    (values[dv.dataElement] =
                      dv.value == "true"
                        ? `Yes (${eventDate})`
                        : dv.value == "false"
                        ? `No (${eventDate})`
                        : "")
                );
              }
            })
          );
          setTeiValues(values);
          setLoading(false);
        } else {
          setExist(false);
          setLoading(false);
        }
        console.log(response);
      };
      fetchData();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <CircularLoader />
      </div>
    );
  }

  if (!exist)
    return (
      <p class="text-center h3 fst-italic">
        {" "}
        EPI does not exist!! Please verify the id.{" "}
      </p>
    );
  return (
    <div id="print">
      <div id="main-container" className="row">
        <div id="attributes" className="col">
          <div id="logo" className="row py-2 align-items-center">
            <div className="col text-end fw-bold">
              الإدارة العامة لصحة الأسرة البرنامج الوطني للتحصين الصحي الموسع
            </div>
            <div className="col text-center">
              <img
                src="https://yemhis.org/epi/api/documents/kr2kzHh8gdT/data"
                alt="Emblem_of_Yemen"
                height={"60"}
              />
            </div>
            <div className="col text-end fw-bold">
              الجمهورية اليمنيةوزارة الصحة العامة والسكان قطاع الرعاية الصحية
              الأولية
            </div>
          </div>
            <div className="text-center my-3">
                  <QRCode
                    value={`http://yemhis.org/epi-vaccination-card/?id=${uid}`}
                    size={120}
                  />
              </div>
          <div>
          <table>
            <thead>
              <tr>
                <th colSpan={"2"} className="text-center">
                  <h4>Vaccination Card</h4>
                </th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attribute) => (
                <tr>
                  <td>
                    {teiValues[attribute.id] ? teiValues[attribute.id] : ""}
                  </td>
                  <td>{attribute.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="text-center my-3">
            <img
              src="https://yemhis.org/epi/api/documents/JFMrKRImbcN/data"
              alt="Children"
              height={"150rem"}
            />
          </div>
        </div>
        <div id="events">
          <table>
            <thead>
              <tr>
                <th className="text-center table-secondary">Governorate: <br/>{path[2] ?path[2]: ''}</th>
                <th className="text-center table-secondary">District: <br/>{path[3] ?path[3]: ''}</th>
                <th className="text-center table-secondary">Health facility: <br/>{path[4] ?path[4]: ''}</th>
              </tr>
              <tr>
                <th className="text-center table-secondary">Status and Date</th>
                <th colSpan={"2"} className="text-center table-secondary">
                  Vaccine
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr>
                  <td className="text-center">
                    {teiValues[event.id] ? teiValues[event.id] : ""}
                  </td>
                  <td className="text-center">{event.name1}</td>
                  <td>{event.name2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
