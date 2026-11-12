import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
  type UnknownAction,
} from "@reduxjs/toolkit";

interface LoaderState {
  pendingCount: number;
}

const initialState: LoaderState = {
  pendingCount: 0,
};

// Операции, которые должны работать тихо в фоне без глобального оверлея
const SILENT_ACTION_PREFIXES = [
  "nutrition/remove",
  "nutrition/edit",
  "nutrition/syncTodaySelection",
  "nutrition/updateSchedule",
  "exercises/remove",
  "exercises/edit",
  "exercises/delete",
  "exercises/update",
];

const isTrackedAction = (action: UnknownAction): boolean => {
  return !SILENT_ACTION_PREFIXES.some((prefix) =>
    action.type.startsWith(prefix),
  );
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
      .addMatcher(
        (action) => isPending(action) && isTrackedAction(action),
        (state) => {
          state.pendingCount += 1;
        },
      )
      .addMatcher(
        (action) => isFulfilled(action) && isTrackedAction(action),
        (state) => {
          state.pendingCount = Math.max(0, state.pendingCount - 1);
        },
      )
      .addMatcher(
        (action) => isRejected(action) && isTrackedAction(action),
        (state) => {
          state.pendingCount = Math.max(0, state.pendingCount - 1);
        },
      );
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export const loaderReducer = loaderSlice.reducer;
