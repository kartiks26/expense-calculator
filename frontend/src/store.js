import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slice/transactionSlice";
import snackBarReducer from "./slice/snackBarSlice";
import otherStatesReducer from "./slice/otherStatesSlice";
export const store = configureStore({
  reducer: {
    transaction: transactionReducer,
    snackbar: snackBarReducer,
    otherStates: otherStatesReducer,
  },
});
