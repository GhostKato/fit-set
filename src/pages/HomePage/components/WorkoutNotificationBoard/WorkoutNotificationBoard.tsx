import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import type { Exercise } from "../../../../types/exercise";
import styles from "./WorkoutNotificationBoard.module.css";

interface WorkoutNotificationBoardProps {
  todayName: string;
  todayExercises: Exercise[];
}

const formatDayAccusative = (day: string): string => {
  const lower = day.toLowerCase();
  const map: Record<string, string> = {
    среда: "среду",
    пятница: "пятницу",
    суббота: "субботу",
  };
  return map[lower] || lower;
};

export const WorkoutNotificationBoard = ({
  todayName,
  todayExercises,
}: WorkoutNotificationBoardProps) => {
  const navigate = useNavigate();
  const allExercises = useAppSelector((state) => state.exercises.items);

  const handleStartWorkout = () => {
    navigate(`/workout?day=${encodeURIComponent(todayName)}`);
  };

  if (todayExercises.length === 0) {
    if (allExercises.length === 0) {
      return null;
    }

    return (
      <div className={styles.restCard}>
        <h3 className={styles.restTitle}>
          Сегодня день отдыха и восстановления
        </h3>
        <p className={styles.restText}>
          На {formatDayAccusative(todayName)} тренировок нет. Отдыхайте и
          набирайтесь сил перед следующим занятием.
        </p>
      </div>
    );
  }

  const customDayTitle =
    todayExercises.find((item) => item.dayTitle?.trim())?.dayTitle?.trim() ||
    "Тренировка";

  return (
    <div className={styles.todayCard}>
      <h2 className={styles.todayTitle}>
        {todayName} — {customDayTitle}
      </h2>

      <p className={styles.todayInfo}>
        Запланировано упражнений: <strong>{todayExercises.length}</strong>
      </p>

      <button
        type="button"
        onClick={handleStartWorkout}
        className={styles.startBtn}>
        Начать сегодняшнюю тренировку
      </button>
    </div>
  );
};
