export type MealTime = "breakfast" | "lunch" | "dinner";

export type NutritionCategory =
  | "simple_carbs"
  | "complex_carbs"
  | "protein"
  | "fats"
  | "fiber"
  | "sauce"
  | "shakes"
  | "dessert";

export interface NutritionItem {
  id: string;
  userId: string;
  meal?: MealTime;
  category: NutritionCategory;
  title: string;
  portion: string;
  note: string;
  order: number;
}

export type NewNutritionItem = Omit<NutritionItem, "id" | "userId">;

export type DailyMealSelection = Record<MealTime, string[]>;

export type MealSchedule = Record<MealTime, string>;
