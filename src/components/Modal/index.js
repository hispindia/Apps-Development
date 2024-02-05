import React from "react";
import "./styles.scss";

import OrganisationUnitTree from "../OrganisationUnitTree";

export const Modal = ({handleModal}) => {
  return (
    <div className="modal-container">
        <div className="modal-content">
          <div className="modal-content-body">
            <OrganisationUnitTree />
          </div>
          <div className="modal-content-footer ">
            <button className="btn btn-primary" onClick={() => handleModal(true)} >Submit</button>
            <button className="btn btn-light ms-2" onClick={() => handleModal(false)}>Cancel</button>
          </div>
        </div>
    </div>
  );
};
false