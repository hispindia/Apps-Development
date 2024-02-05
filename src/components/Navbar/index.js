import React, { useState, useEffect } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setUserOU,
} from "../../store/outree/outree.action";
import { Period } from "./Period";
import OrganisationUnits from "../OrganisationUnits";

const Navbar = ({ data }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      if (data.me) {
        data.me.organisationUnits[0].children =
          data.me.organisationUnits[0].children.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits[0]));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
    }
  }, [data]);

  return (
    <div className="navbar-container p-2 row bg-light border-bottom">
      <div className="col-3 px-2">
        <Period />
      </div>
      <div className="col-9 px-2"> <OrganisationUnits /></div>
    </div>
  );
};

export default Navbar;
