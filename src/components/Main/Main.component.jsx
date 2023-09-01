import React, { useState } from "react";
import "./styles.scss";
import TeiList from "../TeiList/TeiList.component";

const Main = () => {
  return (
    <div className="flex-fill">
      <h3 className="py-2 mb-3 text-center text-decoration-underline">Missed Appointment List</h3>
      <TeiList />
    </div>
  );
};

export default Main;
