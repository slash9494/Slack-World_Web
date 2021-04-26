import loadable from "@loadable/component";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const Home = loadable(() => import("@pages/Home"));
const workspace = loadable(
  () => import("@components/Workspace/WorkspaceLayout")
);

const App = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/home" />
    </Route>
    <Route path="/home" component={Home} />
    <Route path="/workspace/:workspace" component={workspace} />
  </Switch>
);

export default App;
