import { createSlice } from "@reduxjs/toolkit";
const loaderSlice = createSlice({
  name: "loaders", // name of the sluce, used for action types prefixes
  initialState: {
    loading: false, // initial state
  },
  reducers: {
    // Reducer to show / hide loading spinners
    ShowLoading: (state) => {
      state.loading = true; // mutable state updates -> immer.js makes it immutable
    },
    HideLoading: (state) => {
      state.loading = false;
    },
  },
});
export const { ShowLoading, HideLoading } = loaderSlice.actions; // named exports
export default loaderSlice.reducer; // only one default export per file