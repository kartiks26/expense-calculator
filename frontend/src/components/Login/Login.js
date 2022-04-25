import {
  Button,
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import React from "react";
import "./Login.css";
import Image from "./savings.svg";
import { fetchTransactions } from "../../slice/transactionSlice";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useDispatch } from "react-redux";
import { showSnackBar } from "../../slice/snackBarSlice";
const appVerifier = window.recaptchaVerifier;

const firebaseConfig = {
  apiKey: "AIzaSyDNyh5_lBDfVmPNeI9ahLn41ek0ra3dvoE",
  authDomain: "expenseit-82590.firebaseapp.com",
  projectId: "expenseit-82590",
  storageBucket: "expenseit-82590.appspot.com",
  messagingSenderId: "178332335583",
  appId: "1:178332335583:web:94709b49c3b57dc8a6186a",
};
const app = initializeApp(firebaseConfig);

function Login() {
  const [ContactNumber, setContactNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [startOtp, setStartOtp] = React.useState(false);
  const [confirmationResult, setConfirmationResult] = React.useState(null);
  const [startNow, setStartNow] = React.useState(true);
  const history = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      },
      auth
    );
  };
  const onSignInSubmit = (event) => {
    event.preventDefault();
    setupRecaptcha();
    const phoneNumber = `+91${ContactNumber}`;
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((result) => {
        setStartOtp(true);
        setConfirmationResult(result);
      })
      .catch((error) => {});
  };
  const OtpEnter = (event) => {
    confirmationResult
      .confirm(otp)
      .then((result) => {
        const user = result.user;
        if (!user.isAnonymous) {
          dispatch(fetchTransactions());
          localStorage.setItem("ExpenseUserContactNumber", ContactNumber);
          history("/expense");
          fetchTransactions();
        } else {
        }
      })
      .catch((error) => {
        dispatch(showSnackBar({ message: "Please Enter Valid OTP" }));
      });
  };
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
        {startNow ? (
          <Button
            id="sign-in-button"
            onClick={() => setStartNow(false)}
            variant="contained"
            color="primary"
            size="large"
            style={{
              margin: "20px 0",
            }}
          >
            Start Now
          </Button>
        ) : (
          <>
            {startOtp ? (
              <TextField
                onChange={(e) => {
                  if (e.target.value.length <= 6) {
                    setOtp(e.target.value);
                  }
                }}
                style={{
                  margin: "20px 0",
                }}
                value={otp}
                size="large"
                type="number"
                variant="outlined"
                helperText="Enter 6 digit Otp"
                label="OTP"
                error={otp.length < 6 && otp.length !== 0}
                InputProps={{ maxLength: 6 }}
              />
            ) : (
              <TextField
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    setContactNumber(e.target.value);
                  }
                }}
                style={{
                  margin: "20px 0",
                }}
                value={ContactNumber}
                size="large"
                type="number"
                variant="outlined"
                helperText="Enter 10 digit phone number"
                label="Phone Number"
                InputProps={{ maxLength: 10 }}
                error={ContactNumber.length < 10 && ContactNumber.length !== 0}
              />
            )}
            <div id="recaptcha-container"></div>
            {startOtp ? (
              <Button
                disabled={otp.length < 6}
                id="sign-in-button"
                onClick={OtpEnter}
                variant="outlined"
                size="large"
              >
                Enter Otp
              </Button>
            ) : (
              <Button
                disabled={ContactNumber.length < 10}
                id="sign-in-button"
                onClick={onSignInSubmit}
                variant="outlined"
                size="large"
              >
                Get Otp
              </Button>
            )}
          </>
        )}
      </div>
      <img className="LoginPage__image" src={Image} />
    </div>
  );
}

export default Login;
