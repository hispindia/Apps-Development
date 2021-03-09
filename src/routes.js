
import React from 'react';
import NavBar  from './components/Navbar/NavBar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomeComponent from './components/HomeComponent/HomeComponent'
import ReportConfiguration from './components/ReportConfiguration/ReportConfiguration';
import ReportManagement from './components/ReportManagement/ReportManagement';
import ReportSection from './components/ReportSection/ReportSection';
import ReportGeneration from './components/ReportGeneration/ReportGeneration';
import DataStatus from './components/DataStatus/DataStatus';

 
  
   const Routes = () => {
    return (
        <div>
    <BrowserRouter>
    <NavBar />
    <Switch>

        <Route  exact path='/' component={HomeComponent}>
        </Route>
        <Route  exact path='/report-configuration' component={ReportConfiguration}>
        </Route>
        
        <Route exact path='/report-management' component={ReportManagement}>
        
        </Route>

        <Route exact path='/section-management' component={ReportSection}>
        
        </Route>

        <Route exact path='/report-genration' component={ReportGeneration}>
        </Route>

        <Route  path='/data-status' component={DataStatus}>
        
        </Route>
    </Switch>
    </BrowserRouter>
    </div> 
    );
  };

  export default Routes;