import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMostFrequentDayTitle } from "../../../../utils/dayTitle";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateDay } from "../../../../i18n";
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
  const { language, t } = useLanguage();

  const activeExercises = useMemo(
    () => exercises.filter((item) => item.isActive),
    [exercises],
  );

  const activeDays = useMemo(() => {
    const uniqueDays = Array.from(
      new Set(activeExercises.flatMap((item) => item.days)),
    );
    return uniqueDays.sort(
      (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b),
    );
  }, [activeExercises]);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t.homeScheduleTitle}</h3>

      {activeDays.length === 0 ? (
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>{t.homeNoActiveExercises}</p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className={styles.addBtn}>
            {t.homeGoToExercisesBtn}
          </button>
        </div>
      ) : (
        <div className={styles.scheduleGrid}>
          {activeDays.map((day) => {
            const dayExercises = activeExercises.filter((item) =>
              item.days.includes(day),
            );
            const customTitle = getMostFrequentDayTitle(
              dayExercises,
              t.homeDefaultWorkoutTitle,
            );
            const isToday = day === todayName;

            return (
              <div
                key={day}
                className={`${styles.dayCard} ${
                  isToday ? styles.dayCardToday : ""
                }`}>
                <h4 className={styles.dayTitle}>
                  {translateDay(day, language)} —{" "}
                  <span className={styles.dayAccent}>{customTitle}</span>
                </h4>
                <p className={styles.dayCount}>
                  {t.homeExercisesInProgram}:{" "}
                  <strong>{dayExercises.length}</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
