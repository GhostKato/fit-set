export type ExerciseUnit = "reps" | "sec";

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Exercise = {
  id: string;
  userId: string;
  days: WeekDay[];
  dayTitle: string;
  muscleGroup: string;
  orders: Partial<Record<WeekDay, number>>;
  name: string;
  targetMuscles: string;
  sets: number;
  target: number;
  unit: ExerciseUnit;
  weight: string;
  howToDo: string;
  handsMode: string;
  palmPosition: string;
  breathing: string;
  isActive: boolean;
};

export type NewExercise = Omit<Exercise, "id" | "userId">;
