import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { showSnackBar } from "./snackBarSlice";

const axios = require("axios");
const initialState = [];
export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    getData: (state, action) => {
      return action.payload.reverse();
    },

    addNewTransaction: (state, action) => {
      return [action.payload, ...state];
    },
    deleteTransaction: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export function fetchTransactions() {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:4000/transaction/getAll");
      const data = await response.json();

      dispatch(getData(data));
    } catch (error) {}
  };
}
export function AddNewTransition(data) {
  return async (dispatch) => {
    axios
      .post("http://localhost:4000/transaction/newTransaction", data)
      .then((res) => {
        dispatch(addNewTransaction(res.data.data));
        dispatch(
          showSnackBar({ message: res.data.message, variant: "success" })
        );
      })
      .catch((err) => {
        dispatch(
          showSnackBar({ message: err.response.data.message, variant: "error" })
        );
      });
  };
}
export function DeleteTransaction(id) {
  return async (dispatch) => {
    try {
      axios
        .delete(`http://localhost:4000/transaction/deleteTransaction/${id}`)
        .then((res) => {
          if (res.data.success) {
            dispatch(deleteTransaction(id));
          }
        });
    } catch (error) {}
  };
}
export function RecoverLendTransaction(id) {
  return async (dispatch) => {
    try {
      axios
        .delete(
          `http://localhost:4000/transaction/recoverLendTransaction/${id}`
        )
        .then((res) => {
          if (res.data.success) {
            dispatch(
              showSnackBar({
                message: "Lend Recovered Successfully",
                variant: "error",
              })
            );
          }
        });
    } catch (error) {}
  };
}
// Action creators are generated for each case reducer function
export const { addNewTransaction, deleteTransaction, getData } =
  transactionSlice.actions;

export default transactionSlice.reducer;
