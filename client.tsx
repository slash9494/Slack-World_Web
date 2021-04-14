import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App/index";

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
