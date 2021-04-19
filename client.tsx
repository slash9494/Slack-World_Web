import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App/App";
import "./App/app.css";
import { CssBaseline } from "@material-ui/core";
render(
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
