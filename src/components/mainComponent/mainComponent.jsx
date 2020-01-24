import React, { Component } from 'react';
import Home from '../homeComponent/homeComponent';
import Dyanmic from '../dynamicComponent/dynamicComponent';
import TEIMain from '../teiComponent/TEIMan';
import ShowTEI from '../teiComponent/ShowTEI';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";
class Main extends Component {
    state = {}
    render() {
        return (
                <Switch>
                    <Route  path="/eventDetailPage" component={TEIMain} />
                    {/* <Route  path="/loadedValue" component={ShowTEI} /> */}
                    <Route path = "/" component = {Home} />
                    <Route path="/:id" component={Home} />
                    <Route exact path="/plan/wnDm6jbp27v" component={Home} />
                    <Redirect  to="/plan/wnDm6jbp27v" />
                </Switch>
        );
    }
}
export default withRouter(Main);