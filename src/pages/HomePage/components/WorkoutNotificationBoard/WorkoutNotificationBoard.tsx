import { useNavigate } from "react-router-dom";
import type { Exercise } from "../../../../types/exercise";
import styles from "./WorkoutNotificationBoard.module.css";

interface WorkoutNotificationBoardProps {
  todayName: string;
  todayExercises: Exercise[];
}

export const WorkoutNotificationBoard = ({
  todayName,
  todayExercises,
}: WorkoutNotificationBoardProps) => {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate(`/workout?day=${encodeURIComponent(todayName)}`);
  };

  if (todayExercises.length === 0) {
    return (
      <div className={styles.restCard}>
        <h3 className={styles.restTitle}>
          Сегодня день отдыха и восстановления
        </h3>
        <p className={styles.restText}>
          На {todayName.toLowerCase()} тренировок нет. Отдыхайте и набирайтесь
          сил перед следующим занятием.
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
