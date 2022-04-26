import { createSlice } from "@reduxjs/toolkit";
import { updateLoader } from "./otherStatesSlice";
import { showSnackBar } from "./snackBarSlice";
const baseUrl = process.env.REACT_APP_API_URL;
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
    updateLendRecovered: (state, action) => {
      return state.map((item) => {
        if (action.payload == item.id) {
          const data = {
            ...item,
            Type: "Lend Recovered",
          };
          return data;
        }
        return item;
      });
    },
  },
});

export function fetchTransactions() {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${baseUrl}/transaction/getAll/${localStorage.getItem(
          "ExpenseUserContactNumber"
        )}`
      );
      const data = await response.json();
      dispatch(
        showSnackBar({ message: "Transaction Fetched", variant: "success" })
      );
      dispatch(getData(data));
      if (data) {
        dispatch(updateLoader(false));
      } else {
        dispatch(updateLoader(true));
      }
    } catch (error) {}
  };
}
export function AddNewTransition(data) {
  return async (dispatch) => {
    axios
      .post(`${baseUrl}/transaction/newTransaction`, data)
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
        .delete(`${baseUrl}/transaction/deleteTransaction/${id}`)
        .then((res) => {
          if (res.data.success) {
            dispatch(deleteTransaction(id));
            dispatch(
              showSnackBar({
                message: "Transaction Deleted",
                variant: "success",
              })
            );
          }
        });
    } catch (error) {}
  };
}
export function RecoverLendTransaction(id) {
  return async (dispatch) => {
    try {
      axios
        .delete(`${baseUrl}/transaction/recoverLendTransaction/${id}`)
        .then((res) => {
          dispatch(updateLendRecovered(id));
          if (res.data.success) {
            dispatch(
              showSnackBar({
                message: "Lend Recovered Successfully",
                variant: "success",
              })
            );
          }
        });
    } catch (error) {}
  };
}
// Action creators are generated for each case reducer function
export const {
  addNewTransaction,
  deleteTransaction,
  getData,
  updateLendRecovered,
} = transactionSlice.actions;

export default transactionSlice.reducer;
