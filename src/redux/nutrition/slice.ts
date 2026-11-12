import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchNutrition,
  addNutritionItem,
  editNutritionItem,
  removeNutritionItem,
  seedDefaultNutrition,
  fetchTodaySelection,
  syncTodaySelection,
  fetchMealSchedule,
  updateMealSchedule,
} from "./operations";
import {
  DEFAULT_MEAL_SCHEDULE,
  EMPTY_DAILY_SELECTION,
} from "../../services/nutritionOps";
import type {
  DailyMealSelection,
  MealSchedule,
  NutritionItem,
} from "../../types/nutrition";

interface NutritionState {
  items: NutritionItem[];
  dailySelection: DailyMealSelection;
  schedule: MealSchedule;
  isLoading: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  items: [],
  dailySelection: EMPTY_DAILY_SELECTION,
  schedule: DEFAULT_MEAL_SCHEDULE,
  isLoading: false,
  error: null,
};

const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    setDailySelectionOptimistic(
      state,
      action: PayloadAction<DailyMealSelection>,
    ) {
      state.dailySelection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNutrition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNutrition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchNutrition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка загрузки рациона";
      })
      .addCase(addNutritionItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editNutritionItem.fulfilled, (state, action) => {
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
      .addCase(removeNutritionItem.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((item) => item.id !== deletedId);
        state.dailySelection.Завтрак = state.dailySelection.Завтрак.filter(
          (id) => id !== deletedId,
        );
        state.dailySelection.Обед = state.dailySelection.Обед.filter(
          (id) => id !== deletedId,
        );
        state.dailySelection.Ужин = state.dailySelection.Ужин.filter(
          (id) => id !== deletedId,
        );
      })
      .addCase(seedDefaultNutrition.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchTodaySelection.fulfilled, (state, action) => {
        state.dailySelection = action.payload;
      })
      .addCase(syncTodaySelection.fulfilled, (state, action) => {
        state.dailySelection = action.payload;
      })
      .addCase(fetchMealSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
      })
      .addCase(updateMealSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
      });
  },
});

export const { setDailySelectionOptimistic } = nutritionSlice.actions;
export const nutritionReducer = nutritionSlice.reducer;
