import * as React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import "./AddExpense.css";

import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { useSelector, useDispatch } from "react-redux";
import {
  addNewTransaction,
  AddNewTransition,
} from "../../slice/transactionSlice";
const style = {
  position: "absolute",
  top: "44%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AddExpense(props) {
  const { open, setOpen } = props;
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();

  const [NewTransaction, setNewTransaction] = React.useState({
    userId: localStorage.getItem("ExpenseUserContactNumber"),
    Transaction: "",
    Date:
      new Date().getDate() +
      "/" +
      (parseInt(new Date().getMonth()) + 1) +
      "/" +
      new Date().getFullYear(),
    Type: "",
    Amount: 0,
    Description: "",
  });
  const onChange = (e) => {
    setNewTransaction({
      ...NewTransaction,
      [e.target.name]: e.target.value,
    });
  };
  const [dateForFrontend, setDatedateForFrontend] = React.useState(new Date());
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="OuterBoxAddNewTransaction">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add New Transaction
        </Typography>
        <div className="NewTransactionFrom">
          <FormControl
            onSubmit={() => {
              alert("Submitted");
            }}
            variant="standard"
            fullWidth
            className="formInput"
          >
            <TextField
              id="outlined-multiline-flexible"
              label="Transaction"
              name="Transaction"
              onChange={onChange}
              multiline
              maxRows={4}
              className="formInput"
              value={NewTransaction.Transaction}
              helperText=" Add Transaction eg. Food, Rent, Groceries, etc."
            />
            <FormControl
              sx={{ m: 1 }}
              variant="standard"
              fullWidth
              className="formInput"
            >
              <InputLabel htmlFor="standard-adornment-amount">
                Amount
              </InputLabel>
              <Input
                id="standard-adornment-amount"
                type="number"
                name="Amount"
                onChange={(e) => {
                  setNewTransaction({
                    ...NewTransaction,
                    Amount: parseInt(e.target.value),
                  });
                }}
                value={NewTransaction.Amount}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />

              <FormHelperText id="component-helper-text">
                Amount traded for transaction
              </FormHelperText>
            </FormControl>
            <TextField
              fullWidth
              id="outlined-select-currency"
              select
              label="Transaction type"
              helperText="Please select Trade Type"
              className="formInput"
              name="Type"
              onChange={onChange}
              value={NewTransaction.Type}
            >
              <MenuItem value="Debit">Debit</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Lend">Lend</MenuItem>
              <MenuItem value="Investment">Investment</MenuItem>
            </TextField>
            <FormControl
              sx={{ m: 1 }}
              variant="standard"
              fullWidth
              className="formInput"
            >
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableFuture
                  className="MoboResponsive"
                  format="DD/MM/YYYY"
                  value={dateForFrontend}
                  onChange={(date) => {
                    const dateToSend =
                      new Date(date._d).getDate() +
                      "/" +
                      (parseInt(new Date(date._d).getMonth()) + 1) +
                      "/" +
                      new Date(date._d).getFullYear();
                    setDatedateForFrontend(date);
                    setNewTransaction({
                      ...NewTransaction,
                      Date: dateToSend,
                    });
                  }}
                />
              </MuiPickersUtilsProvider>
              <FormHelperText id="component-helper-text">
                Date of transaction
              </FormHelperText>
            </FormControl>
            <TextField
              id="outlined-multiline-flexible"
              label="Description"
              className="formInput"
              name="Description"
              value={NewTransaction.Description}
              onChange={onChange}
              multiline
              maxRows={4}
              helperText="Add description like ate Pizza at with friends at domino's"
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className="formInput"
            fullWidth
            type="submit"
            onClick={() => {
              console.log(NewTransaction);
              dispatch(AddNewTransition(NewTransaction));
              setNewTransaction({
                Transaction: "",
                Date:
                  new Date().getDate() +
                  "/" +
                  (parseInt(new Date().getMonth()) + 1) +
                  "/" +
                  new Date().getFullYear(),
                Type: "",
                Amount: 0,
                Description: "",
                userId: localStorage.getItem("ExpenseUserContactNumber") || "",
              });
            }}
          >
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
