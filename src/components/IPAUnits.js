import React, { useState, useEffect } from "react";
import { ApiService } from "../api/analytics.api";
import { ipaUnits } from "../constants/Ids";
import { useSelector } from "react-redux";
import Card from "./Card";

const IPAUnits = () => {
  const orgUnit = useSelector((state) => state.outree.clickedOU);
  const period = useSelector((state) => state.navbar.period);
  const [units, setUnits] = useState(ipaUnits);

  useEffect(() => {
    if (orgUnit) {
      const unitIds = ipaUnits.map((unit) => unit.id).join(";");
      ApiService.getIPAUnits(unitIds, orgUnit.id, period).then((res) => {
        var values;
        var data = {
          all:0
        };
        if (res.rows.length) {
          res.rows.forEach((row) => {
            data['all'] += Number(row[1]);
            data[row[0]] = row[1]
          });
        }
        values = ipaUnits.map((entity) => {
          return { ...entity, value: data[entity.id] ? data[entity.id]: '' };
        });
        setUnits(values);
      });
    }
  }, [orgUnit, period]);

  return   <>{units.map((unit) => unit.value && <Card center={unit} />)}</>;
};

export default IPAUnits;
