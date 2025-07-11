import React, { useEffect } from "react";
import "./sideBar.style.scss";

import OrganisationUnitTree from "../OrganisationUnitTree";

import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setGroups,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
import { setDisplay } from "../../store/report/report.action";
import { OUGroup } from "./OUGroup.component";

const SideBar = ({ data }) => {
  const dispatch = useDispatch();
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  useEffect(() => {
    if (data) {
      if (data.ouList) dispatch(setOUList(data.ouList.organisationUnits));
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
      if (data.ouGroups) {
        dispatch(setGroups(data.ouGroups.organisationUnitGroups));
      }
    }
  }, [data]);

  useEffect(() => {
    dispatch(setDisplay(false));
  }, [selectedOU]);

  return (
    selectedOU && (
      <div className="side-bar">
        <OUGroup />

        <input
          className="form-control"
          id="organisation-unit"
          disabled
          value={selectedOU.name}
        />
        <div>
          <OrganisationUnitTree />
        </div>
      </div>
    )
  );
};

export default SideBar;
