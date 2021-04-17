import loadable from "@loadable/component";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const Home = loadable(() => import("@pages/Home"));
const Channel = loadable(() => import("@pages/Channel"));
const workspace = loadable(() => import("@components/Workspace"));

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/Home" />
    </Route>
    <Route path="/Home" component={Home} />
    <Route path="/workspace/:workspace" component={workspace} />
  </Switch>
);

export default App;
