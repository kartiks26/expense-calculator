import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visible: false,
  message: "",
  variant: "",
};
export const snackBarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackBar: (state, action) => {
      return {
        message: action.payload.message,
        variant: action.payload.variant,
      };
    },
    closeSnackBar: (state) => {
      return initialState;
    },
  },
});
// post transition to backend

// Action creators are generated for each case reducer function
export const { closeSnackBar, showSnackBar } = snackBarSlice.actions;

export default snackBarSlice.reducer;
