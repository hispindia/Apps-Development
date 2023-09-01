import React, { useEffect } from "react";
import "./sideBar.style.scss";

import OrganisationUnitTree from "../OrganisationUnitTree";
import { ApiService } from "../../api/tei.api";

import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
import { setTeiList, setTeiPresent } from "../../store/tei/tei.action";
import { arrangeTeiElements } from "../utils.func";

const SideBar = ({ data }) => {
  const dispatch = useDispatch();
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  useEffect(() => {
    if (data) {
      if (data.me) dispatch(setUserOU(data.me.organisationUnits[0]));
      if (data.ouList) dispatch(setOUList(data.ouList.organisationUnits));

      if (data.me) dispatch(setClickedOU(data.me.organisationUnits[0]));
      getTeiList(data.me.organisationUnits[0]);
    }
  }, [data]);

  const getTeiList = (selectedOU) => {
    dispatch(setTeiPresent(false));
    dispatch(setTeiList([]));
    ApiService.getTeiList(selectedOU.id).then((data) => {
      var teiList = arrangeTeiElements(data);
      dispatch(setTeiList(teiList));
      dispatch(setTeiPresent(true));
    });
  };

  return (
    selectedOU && (
      <div className="side-bar">
        <div className="input-group">
          <input
            className="form-control"
            id="organisation-unit"
            disabled
            value={selectedOU.name}
          />
          <button
            className="btn btn-primary ms-1"
            onClick={() => getTeiList(selectedOU)}
          >
            Submit
          </button>
        </div>
        <div className="ou-tree">
          <OrganisationUnitTree />
        </div>
      </div>
    )
  );
};

export default SideBar;
