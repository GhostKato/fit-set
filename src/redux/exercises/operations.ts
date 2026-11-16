import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  deleteAllUserExercises,
  seedDefaultExercisesToDb,
} from "../../services/exercisesOps";
import type { Exercise, NewExercise } from "../../types/exercise";
import type { LanguageCode } from "../../context/LanguageContext";

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

export const removeAllExercises = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("exercises/deleteAll", async (_, thunkAPI) => {
  try {
    await deleteAllUserExercises();
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});

export const seedDefaultExercises = createAsyncThunk<
  Exercise[],
  LanguageCode | undefined,
  { rejectValue: string }
>("exercises/seedDefault", async (lang = "ua", thunkAPI) => {
  try {
    return await seedDefaultExercisesToDb(lang);
  } catch (error) {
    return thunkAPI.rejectWithValue((error as Error).message);
  }
});
