import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNutritionFromDb,
  addNutritionToDb,
  updateNutritionInDb,
  deleteNutritionFromDb,
  seedDefaultNutritionToDb,
  getTodaySelectionFromDb,
  saveTodaySelectionToDb,
  getMealScheduleFromDb,
  saveMealScheduleToDb,
} from "../../services/nutritionOps";
import type {
  NutritionItem,
  NewNutritionItem,
  MealSchedule,
  DailyMealSelection,
} from "../../types/nutrition";

export const fetchNutrition = createAsyncThunk<
  NutritionItem[],
  void,
  { rejectValue: string }
>("nutrition/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getNutritionFromDb();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addNutritionItem = createAsyncThunk<
  NutritionItem,
  NewNutritionItem,
  { rejectValue: string }
>("nutrition/add", async (newItem, { rejectWithValue }) => {
  try {
    return await addNutritionToDb(newItem);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const editNutritionItem = createAsyncThunk<
  { id: string; fields: Partial<NewNutritionItem> },
  { id: string; fields: Partial<NewNutritionItem> },
  { rejectValue: string }
>("nutrition/edit", async ({ id, fields }, { rejectWithValue }) => {
  try {
    await updateNutritionInDb(id, fields);
    return { id, fields };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const removeNutritionItem = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("nutrition/remove", async (id, { rejectWithValue }) => {
  try {
    await deleteNutritionFromDb(id);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const seedDefaultNutrition = createAsyncThunk<
  NutritionItem[],
  void,
  { rejectValue: string }
>("nutrition/seedDefault", async (_, { rejectWithValue }) => {
  try {
    return await seedDefaultNutritionToDb();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchTodaySelection = createAsyncThunk<
  DailyMealSelection,
  void,
  { rejectValue: string }
>("nutrition/fetchTodaySelection", async (_, { rejectWithValue }) => {
  try {
    return await getTodaySelectionFromDb();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const syncTodaySelection = createAsyncThunk<
  DailyMealSelection,
  DailyMealSelection,
  { rejectValue: string }
>("nutrition/syncTodaySelection", async (selection, { rejectWithValue }) => {
  try {
    return await saveTodaySelectionToDb(selection);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchMealSchedule = createAsyncThunk<
  MealSchedule,
  void,
  { rejectValue: string }
>("nutrition/fetchSchedule", async (_, { rejectWithValue }) => {
  try {
    return await getMealScheduleFromDb();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateMealSchedule = createAsyncThunk<
  MealSchedule,
  MealSchedule,
  { rejectValue: string }
>("nutrition/updateSchedule", async (schedule, { rejectWithValue }) => {
  try {
    return await saveMealScheduleToDb(schedule);
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
