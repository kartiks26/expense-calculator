import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import ShowSnackbar from "./components/Snackbar/ShowSnackbar";
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ShowSnackbar />
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
