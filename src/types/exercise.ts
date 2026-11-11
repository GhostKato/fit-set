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
  reps: number;
  weight: string;
  howToDo: string;
  handsMode: string;
  palmPosition: string;
  breathing: string;
};

export type NewExercise = Omit<Exercise, "id" | "userId">;
