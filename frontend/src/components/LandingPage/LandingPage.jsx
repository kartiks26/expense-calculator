import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { Button, createTheme, TextField, Typography } from "@material-ui/core";
const theme = createTheme({
  primary: {
    main: "#00bcd4",
  },
});

function LandingPage() {
  const history = useNavigate();
  const [contactNumber, setContactNumber] = React.useState("");
  return (
    <>
      <Typography>
        <h1>Landing Page</h1>
      </Typography>
      <TextField
        onChange={(e) => {
          setContactNumber(e.target.value);
        }}
        placeholder="Enter your Number"
      />

      <Button
        onClick={() => {
          localStorage.setItem("ExpenseUserContactNumber", contactNumber);
          history("/expense");
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
