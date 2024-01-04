import React, { useState, useEffect } from "react";
import "./style.scss";

import { Period } from "./Period";
import OrganisationUnitTree from "../OrganisationUnitTree";

import { useDispatch, useSelector } from "react-redux";
import {
  setOUList,
  setClickedOU,
  setUserOU,
  setOUChildren,
} from "../../store/outree/outree.action";

const Navbar = ({ data }) => {
  const dispatch = useDispatch();
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const [displayOU, setDisplayOU] = useState(false);

  useEffect(() => {
    if(selectedOU) {
      setDisplayOU(false);
      if(selectedOU.level==1) dispatch(setOUChildren(selectedOU.children));
      else dispatch(setOUChildren([selectedOU]));
    }
  }, [selectedOU]);

  useEffect(() => {
    if (data) {
      if (data.ouList) {
        dispatch(setOUList(data.ouList.organisationUnits))
      }
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
    }
  }, [data]);

  return (
    <div className="navbar-container p-2 row bg-light border-bottom">
      <div className="col-3 px-2">
        <Period />
      </div>
      <div className="col-3 px-2">
        {selectedOU && (
          <input
            className="form-control"
            id="organisation-unit"
            onFocus={() => setDisplayOU(true)}
            value={selectedOU.name}
          />
        )}
        {displayOU && (
          <div className={"orgunit w-25 mt-1"}>
            <OrganisationUnitTree />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
