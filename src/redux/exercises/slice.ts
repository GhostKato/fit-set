import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  fetchExercises,
  addExercise,
  editExercise,
  removeExercise,
} from "./operations";
import type { Exercise } from "../../types/exercise";

interface ExercisesState {
  items: Exercise[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExercisesState = {
  items: [],
  isLoading: false,
  error: null,
};

const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addExercise.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editExercise.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload.fields,
          };
        }
      })
      .addCase(removeExercise.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addMatcher(
        isAnyOf(
          fetchExercises.pending,
          addExercise.pending,
          editExercise.pending,
          removeExercise.pending,
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchExercises.fulfilled,
          addExercise.fulfilled,
          editExercise.fulfilled,
          removeExercise.fulfilled,
        ),
        (state) => {
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          fetchExercises.rejected,
          addExercise.rejected,
          editExercise.rejected,
          removeExercise.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload ?? "Ошибка при работе с базой";
        },
      );
  },
});

export const exercisesReducer = exercisesSlice.reducer;
