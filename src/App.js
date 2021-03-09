import React from 'react'
import './App.css'
import NavBar from './components/Navbar/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Routes from './routes'


import StandardReport from './components/StandardReport';
import HomeComponent from './components/HomeComponent/HomeComponent';
// import Report_configuration from './components/Report_Configuration/report_configuration';
import Report_management from './components/ReportManagement/ReportManagement';
import Report_Section from './components/ReportSection/ReportSection';
import Report_Generation from './components/ReportGeneration/ReportGeneration';
import Data_Status from './components/DataStatus/DataStatus';

export default class App extends React.Component {
  render() {
    return (
      <>
      <Routes></Routes>
      </>
    );
  }
}