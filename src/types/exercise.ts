export type ExerciseUnit = "reps" | "sec";
export type Exercise = {
  id: string;
  userId: string;
  day: string;
  dayTitle: string;
  muscleGroup: string;
  order: number;
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
