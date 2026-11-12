import { configureStore } from "@reduxjs/toolkit";
import { exercisesReducer } from "./exercises/slice";
import { loaderReducer } from "./loader/slice";
import { nutritionReducer } from "./nutrition/slice";

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    loader: loaderReducer,
    nutrition: nutritionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
