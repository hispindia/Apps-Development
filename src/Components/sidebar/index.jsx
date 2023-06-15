import React, { useState } from "react";
import "./style.css";

export default function Sidebar({ handleChange }) {
  const [active, setActive] = useState(true);
  return (
    <div className="side-bar">
      <div
        className={active ? "h5 p-2 px-2 active" : "h5 p-2 px-2"}
        onClick={() => {
          handleChange(false);
          setActive(true);
        }}
      >
        Export File
      </div>
      <div
        className={active ? "h5 px-2 p-2" : "h5 px-2  p-2 active"}
        onClick={() => {
          setActive(false);
          handleChange(true);
        }}
      >
        Import File
      </div>
    </div>
  );
}
