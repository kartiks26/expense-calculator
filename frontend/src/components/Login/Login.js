import { Button, createTheme, TextField, Typography } from "@material-ui/core";
import React from "react";
import "./Login.css";
import Image from "./savings.svg";
import { fetchTransactions } from "../../slice/transactionSlice";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  root: {
    backgroundColor: "#0000",
    fontSize: "1.5rem",
  },
  primary: {
    main: "#00bcd4",
    fontSize: "2.5rem",
  },
});
function Login() {
  const [contactNumber, setContactNumber] = React.useState("");
  const history = useNavigate();

  return (
    <div className="LoginPage">
      <div className="LoginPage__LeftSide">
        <Typography
          variant="h2"
          style={{
            maxWidth: "500px",
          }}
        >
          Transaction At One Place
        </Typography>
        <TextField
          onChange={(e) => {
            setContactNumber(e.target.value);
          }}
          style={{
            margin: "20px 0",
          }}
          size="large"
          type="number"
          variant="outlined"
          helperText="Enter your phone number"
          label="Phone Number"
        />

        <Button
          onClick={() => {
            localStorage.setItem("ExpenseUserContactNumber", contactNumber);
            history("/expense");
            fetchTransactions();
          }}
          variant="outlined"
          size="large"
        >
          Start Now
        </Button>
      </div>
      <img className="LoginPage__image" src={Image} />
    </div>
  );
}

export default Login;
