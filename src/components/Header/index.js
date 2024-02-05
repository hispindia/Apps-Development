import React from "react";
import MHSSP from "../../images/dhis2-app-icon.png";

const Header = () => {
  return (
    <header className="d-flex justify-content-center align-items-center my-2">
      <img src={MHSSP} height="45" width="45" />
      <h4 className="mb-0 ps-2">
        Mizoram Health Systems Strengthening Project{" "}
      </h4>
    </header>
  );
};

export default Header;
