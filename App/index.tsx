import loadable from "@loadable/component";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LogIn from "@pages/LogIn";
import SignUp from "@pages/SignUp";

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/login" />
    </Route>
    <Route path="/login" component={LogIn} />
    <Route path="/signup" component={SignUp} />
  </Switch>
);

export default App;
