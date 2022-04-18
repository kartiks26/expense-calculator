import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { Button, createTheme, TextField, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { fetchTransactions } from "../../slice/transactionSlice";
const theme = createTheme({
  primary: {
    main: "#00bcd4",
  },
});

function LandingPage() {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [contactNumber, setContactNumber] = React.useState("");
  return (
    <>
      <Typography variant="h2">Start Tracking Expense Now</Typography>
      <TextField
        onChange={(e) => {
          setContactNumber(e.target.value);
        }}
        label="Mobile Number"
        helperText="Ex. 9827254041"
      />

      <Button
        onClick={() => {
          localStorage.setItem("ExpenseUserContactNumber", contactNumber);
          history("/expense");
          fetchTransactions();
        }}
        theme={theme}
        variant="contained"
        color="primary"
      >
        Go to expense
      </Button>
    </>
  );
}

export default LandingPage;
