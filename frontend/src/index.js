import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import ShowSnackbar from "./components/Snackbar/ShowSnackbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2f2e41",
    },
    secondary: {
      main: "#000",
    },
  },
});

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Provider store={store}>
          <ShowSnackbar />
          <App />
        </Provider>
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
