import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Exercise } from "../../../../types/exercise";
import styles from "./WorkoutScheduleBoard.module.css";

interface WorkoutScheduleBoardProps {
  exercises: Exercise[];
  todayName: string;
}

const WEEK_ORDER = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const WorkoutScheduleBoard = ({
  exercises,
  todayName,
}: WorkoutScheduleBoardProps) => {
  const navigate = useNavigate();

  const activeDays = useMemo(() => {
    const uniqueDays = Array.from(new Set(exercises.map((item) => item.day)));
    return uniqueDays.sort(
      (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b),
    );
  }, [exercises]);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Расписание тренировок</h3>

      {activeDays.length === 0 ? (
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>
            У вас пока нет добавленных упражнений.
          </p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className={styles.addBtn}>
            Добавить упражнения
          </button>
        </div>
      ) : (
        <div className={styles.scheduleGrid}>
          {activeDays.map((day) => {
            const dayExercises = exercises.filter((item) => item.day === day);
            const customTitle =
              dayExercises
                .find((item) => item.dayTitle?.trim())
                ?.dayTitle?.trim() || "Тренировка";
            const isToday = day === todayName;

            return (
              <div
                key={day}
                className={`${styles.dayCard} ${
                  isToday ? styles.dayCardToday : ""
                }`}>
                <h4 className={styles.dayTitle}>
                  {day} —{" "}
                  <span className={styles.dayAccent}>{customTitle}</span>
                  {isToday && <span className={styles.todayTag}></span>}
                </h4>
                <p className={styles.dayCount}>
                  Упражнений в программе: <strong>{dayExercises.length}</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
