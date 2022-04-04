import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { Button, createTheme, Typography } from "@material-ui/core";
const theme = createTheme({
  primary: {
    main: "#00bcd4",
  },
});

function LandingPage() {
  const history = useNavigate();
  return (
    <>
      <Typography>
        <h1>Landing Page</h1>
      </Typography>
      <Button
        onClick={() => {
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
