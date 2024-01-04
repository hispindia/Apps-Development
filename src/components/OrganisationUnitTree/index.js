import React, { useState, useEffect } from "react";
import "./styles.scss";

import { useSelector } from "react-redux";

import OrgUnitChildren from "./OrgUnitChildren";

const OrganisationUnitTree = () => {
  const userOU = useSelector((state) => state.outree.userOU);

  return (
    <>
      <div className="ou-tree">
        {
          userOU.map(ou => <OrgUnitChildren orgUnit={ou} display={true} />)
        }
        
      </div>
    </>
  );
};

export default OrganisationUnitTree;
