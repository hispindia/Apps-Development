import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Main from "./components/Main";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Main />
    </Router>
  </React.StrictMode>
);

