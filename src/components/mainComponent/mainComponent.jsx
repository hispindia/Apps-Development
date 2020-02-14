import React, { Component } from 'react';
import Home from '../homeComponent/homeComponent';
import TEIMain from '../teiComponent/TEIMan';
import ShowTEI from '../teiComponent/ShowTEI';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";
import DynamicData from '../LoadingComponent/dynamicComponent'
class Main extends Component {
    state = {}
    render() {
        return (
                <Switch>
                    <Route  path="/eventDetailPage" component={TEIMain} />
                    {/* <Route  path="/loadedValue" component={ShowTEI} /> */}
                    <Route path = "/" component = {DynamicData} />
                    {/* <Route path="/:id" component={Home} /> */}
                    <Route path="/plan/:id" component={DynamicData} />
                    <Route exact path="/plan/wnDm6jbp27v" component={Home} />
                    <Redirect  to="/plan/wnDm6jbp27v" />
                </Switch>
        );
    }
}
export default withRouter(Main);