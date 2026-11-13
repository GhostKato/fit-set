export type MealTime = "Завтрак" | "Обед" | "Ужин";

export type NutritionCategory =
  | "Простые углеводы"
  | "Сложные углеводы"
  | "Белок"
  | "Жиры"
  | "Клетчатка"
  | "Соус"
  | "Коктейли"
  | "Десерт";

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
