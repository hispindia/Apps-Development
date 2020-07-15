import React, { Component } from 'react';
import TEIMain from '../teiComponent/TEIMan';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";
import DynamicData from '../LoadingComponent/dynamicComponent'
import Enrollment from '../LoadingComponent/Enrollment'

class Main extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route  path="/eventDetailPage" component={TEIMain} />
                    <Route  path="/enrollment" component={Enrollment} />
                    <Route path = "/"  component = {DynamicData} />
                    <Route path="/:id"  component={DynamicData} />
                    /*<Route path="/:id" component={DynamicData} />*/
                    <Redirect  to="/"  component={DynamicData} />
                </Switch>
            </Router>
    );
    }
}
export default Main;