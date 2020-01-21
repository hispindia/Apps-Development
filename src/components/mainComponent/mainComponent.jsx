import React, { Component } from 'react';
import Home from '../homeComponent/homeComponent';
import Dyanmic from '../dynamicComponent/dynamicComponent';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
class Main extends Component {
    state = {  }
    render() { 
        return (
            <>
            <Switch>
            <Route path="/plan" component={Home} />
            <Route path="/dynamic" component={Dyanmic} />
            <Redirect to="/plan" />
            </Switch>
            </>
          );
    }
}
export default Main;