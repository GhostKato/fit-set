import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks";
import { TodayNutritionBoard } from "../../components/TodayNutritionBoard/TodayNutritionBoard";
import { WorkoutNotificationBoard } from "./components/WorkoutNotificationBoard/WorkoutNotificationBoard";
import { WorkoutScheduleBoard } from "./components/WorkoutScheduleBoard/WorkoutScheduleBoard";
import type { UserProfile } from "../../types/user";
import styles from "./HomePage.module.css";

interface HomePageProps {
  user: UserProfile;
}

const DAYS_BY_GET_DAY = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const HomePage = ({ user }: HomePageProps) => {
  const exercises = useAppSelector((state) => state.exercises.items);

  const todayName = DAYS_BY_GET_DAY[new Date().getDay()];

  const todayExercises = useMemo(() => {
    return exercises.filter((item) => item.isActive && item.day === todayName);
  }, [exercises, todayName]);

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Привет, {user.name || "Спортсмен"}!</h1>
      <p className={styles.dateText}>
        Сегодня: <strong>{todayName}</strong>
      </p>

      <WorkoutNotificationBoard
        todayName={todayName}
        todayExercises={todayExercises}
      />

      <TodayNutritionBoard />

      <WorkoutScheduleBoard exercises={exercises} todayName={todayName} />
    </div>
  );
};
