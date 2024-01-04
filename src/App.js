import React from "react";
import './App.scss';

import { CircularLoader } from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";

import "bootstrap/dist/css/bootstrap.css";

import { Provider } from "react-redux";
import { store } from "./store/store";

import Navbar from "./components/Navbar";

import { InitialQuery } from "./constants/InitialQuery";
import Main from "./components/Main";

const MyApp = () => {
  const { loading, error, data } = useDataQuery(InitialQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <div className="h-100 d-flex align-items-center justify-content-center"> <CircularLoader/> </div>;
  }

  return (
    <div className="app-container">
        <Provider store={store}>
          <Navbar data={data}/>
          <Main data={data}/>
        </Provider>
    </div>
  );
};

export default MyApp;
