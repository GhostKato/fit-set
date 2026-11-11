import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserExercises,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../../services/exercisesOps";
import type { Exercise, NewExercise } from "../../types/exercise";

export const fetchExercises = createAsyncThunk<
  Exercise[],
  void,
  { rejectValue: string }
>("exercises/fetchAll", async (_, thunkAPI) => {
  try {
    return await fetchUserExercises();
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const addExercise = createAsyncThunk<
  Exercise,
  NewExercise,
  { rejectValue: string }
>("exercises/add", async (newExercise, thunkAPI) => {
  try {
    return await createExercise(newExercise);
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const editExercise = createAsyncThunk<
  { id: string; fields: Partial<NewExercise> },
  { id: string; fields: Partial<NewExercise> },
  { rejectValue: string }
>("exercises/edit", async ({ id, fields }, thunkAPI) => {
  try {
    await updateExercise(id, fields);
    return { id, fields };
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const removeExercise = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("exercises/delete", async (id, thunkAPI) => {
  try {
    await deleteExercise(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});
