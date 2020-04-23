import React, { Component } from 'react';
import TEIMain from '../teiComponent/TEIMan';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";
import DynamicData from '../LoadingComponent/dynamicComponent'
class Main extends Component {
    render() {
        return (
                <Switch>
                    <Route  path="/eventDetailPage" component={TEIMain} />
                    <Route path = "/" exact component = {DynamicData} />
                    <Route path="/:id" exact component={DynamicData} />
                    /*<Route path="/:id" component={DynamicData} />*/
                    <Redirect exact to="/"  component={DynamicData} />
                </Switch>
        );
    }
}
export default withRouter(Main);