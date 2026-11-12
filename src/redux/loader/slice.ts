import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";

interface LoaderState {
  pendingCount: number;
}

const initialState: LoaderState = {
  pendingCount: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader: (state) => {
      state.pendingCount += 1;
    },
    hideLoader: (state) => {
      state.pendingCount = Math.max(0, state.pendingCount - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.pendingCount += 1;
      })
      .addMatcher(isFulfilled, (state) => {
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      })
      .addMatcher(isRejected, (state) => {
        state.pendingCount = Math.max(0, state.pendingCount - 1);
      });
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export const loaderReducer = loaderSlice.reducer;
