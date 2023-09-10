import React, { useState, useEffect } from "react";
import "./styles.scss";

import { useSelector } from "react-redux";

import SearchBar from "./SearchBar";
import OrgUnitChildren from "./OrgUnitChildren";

const OrganisationUnitTree = () => {
  const userOU = useSelector((state) => state.outree.userOU);
  const filteredOU = useSelector((state) => state.outree.filteredOU);
  const [path, setPath] = useState("");

  useEffect(() => {
    if (filteredOU && filteredOU.path) setPath(filteredOU.path);
  }, [filteredOU]);

  return (
    <>
      <div className="py-1">
        <SearchBar />
      </div>
      <div className="ou-tree">
        <OrgUnitChildren orgUnit={userOU} display={true} path={path} />
      </div>
    </>
  );
};

export default OrganisationUnitTree;
