import React from "react";
import "./styles.scss";


import {useSelector } from "react-redux";

import OrgUnitChildren from "./OrgUnitChildren";

const OrganisationUnitTree = () => {
  const userOU = useSelector((state) => state.outree.userOU);

  return <OrgUnitChildren orgUnit={userOU} />;
};

export default OrganisationUnitTree;
