import React, { useEffect } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "./App.module.css";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { useDataQuery } from "@dhis2/app-runtime";
import { InitialQuery } from "./constants/InitialQuery";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Main from "./components/Main";

const MyApp = () => {
  const { loading, error, data } = useDataQuery(InitialQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <div className="app-container">
      <Provider store={store}>
        <Header />
        <NavBar data={data} />
        <Main />
      </Provider>
    </div>
  );
};

export default MyApp;
