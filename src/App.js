import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Main from "./components/Main";
const MyApp = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};
export default MyApp;

