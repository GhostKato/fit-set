import { configureStore } from "@reduxjs/toolkit";
import { exercisesReducer } from "./exercises/slice";

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
