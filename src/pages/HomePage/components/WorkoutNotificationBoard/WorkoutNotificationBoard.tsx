import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import { getMostFrequentDayTitle } from "../../../../utils/dayTitle";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateDay, translateDayAccusative } from "../../../../i18n";
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
  const { language, t } = useLanguage();
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
        <h3 className={styles.restTitle}>{t.homeRestTitle}</h3>
        <p className={styles.restText}>
          {t.homeRestTextPrefix} {translateDayAccusative(todayName, language)}{" "}
          {t.homeRestTextSuffix}
        </p>
      </div>
    );
  }

  const customDayTitle = getMostFrequentDayTitle(
    todayExercises,
    t.homeDefaultWorkoutTitle,
  );

  return (
    <div className={styles.todayCard}>
      <h2 className={styles.todayTitle}>
        {translateDay(todayName, language)} — {customDayTitle}
      </h2>

      <p className={styles.todayInfo}>
        {t.homePlannedExercises}: <strong>{todayExercises.length}</strong>
      </p>

      <button
        type="button"
        onClick={handleStartWorkout}
        className={styles.startBtn}>
        {t.homeStartWorkoutBtn}
      </button>
    </div>
  );
};
