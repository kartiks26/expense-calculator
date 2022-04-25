import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  filterList: [],
  loader: true,
};
export const otherStates = createSlice({
  name: "otherStates",
  initialState,
  reducers: {
    updateFilterList: (state, action) => {
      state.filterList = action.payload;
    },
    updateLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});
// post transition to backend

// Action creators are generated for each case reducer function
export const { updateFilterList, updateLoader } = otherStates.actions;

export default otherStates.reducer;
