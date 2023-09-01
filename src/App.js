import React from "react";
import './App.scss';

import { Provider } from "react-redux";
import { store } from "./store/store";

import { useDataQuery } from "@dhis2/app-runtime";

import Main from "./components/Main/Main.component";
import SideBar from "./components/SideBar/SideBar.component";
import { InitialQuery } from "./components/constants";

const MyApp = () => {
  const { loading, error, data } = useDataQuery(InitialQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <div className="d-flex my-1">
      <Provider store={store}>
        <SideBar data={data} />
        <Main />
      </Provider>
    </div>
  );
};

export default MyApp;
