import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Redirect, withRouter } from "react-router-dom";
// import { BrowserRouter as Router,Switch, Route,withRouter, Redirect } from 'react-router-dom'
import { BrowserRouter as Switch, Route, Redirect, withRouter } from "react-router-dom";
import StaticData from '../Events/staticComponent'
import TEIDetails from '../Events/TEI'
class Main extends Component {
    render() {
        return (
            <Switch>
            <Route  path="/trackedEntityInstances" component={TEIDetails} />
            <Route path = "/"  component = {StaticData} />
            <Redirect to="/"  component={StaticData} /> 
        </Switch>
        );
    }
}
export default withRouter(Main);