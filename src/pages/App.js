import React, { useState } from "react";
import "./App.css";
import Sidebar from "../Components/sidebar";
import Import from "../Components/import";
import Export from "../Components/export";

export default function App() {
  const [toImport, setToImport] = useState(false);
  const handleChange = (val) => setToImport(val);

  return (
    <div className=" ">
      <div className="d-flex mt-3">
        <Sidebar handleChange={handleChange} />
        {toImport ? <Import /> : <Export />}
      </div>
    </div>
  );
}
