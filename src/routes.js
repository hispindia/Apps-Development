
import React from 'react';
import NavBar  from './components/Navbar/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReportConfiguration from './components/ReportConfiguration/ReportConfiguration';
import ReportManagement from './components/ReportManagement/ReportManagement';
import ReportSection from './components/ReportSection/ReportSection';
import ReportGeneration from './components/ReportGeneration/ReportGeneration';
import DataStatus from './components/DataStatus/DataStatus';

 
  
   const Routes = () => {
    return (
        <div>
    <Router>
    <NavBar />
    <switch>

        <Route  path='/report-configuration' component={ReportConfiguration}>
        </Route>
        
        <Route  path='/report-management' component={ReportManagement}>
        
        </Route>

        <Route  path='/section-management' component={ReportSection}>
        
        </Route>

        <Route  path='/report-genration' component={ReportGeneration}>
        </Route>

        <Route  path='/data-status' component={DataStatus}>
        
        </Route>
    </switch>
    </Router>
    </div> 
    );
  };

  export default Routes;