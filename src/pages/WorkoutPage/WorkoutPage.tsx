import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { SetTracker } from "./components/SetTracker/SetTracker";
import { RestTimer } from "./components/RestTimer/RestTimer";
import styles from "./WorkoutPage.module.css";

const DAYS_BY_INDEX = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const formatDayAccusative = (day: string): string => {
  const lower = day.toLowerCase();
  const map: Record<string, string> = {
    среда: "среду",
    пятница: "пятницу",
    суббота: "субботу",
  };
  return map[lower] || lower;
};

export const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const todayName = DAYS_BY_INDEX[new Date().getDay()];
  const selectedDay = searchParams.get("day") || todayName;

  const allExercises = useAppSelector((state) => state.exercises.items);

  const dayExercises = useMemo(() => {
    return allExercises
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.order - b.order);
  }, [allExercises, selectedDay]);

  const customDayTitle = useMemo(() => {
    return dayExercises.find((item) => item.dayTitle?.trim())?.dayTitle?.trim();
  }, [dayExercises]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>(
    {},
  );

  const progressPercent = useMemo(() => {
    const totalSets = dayExercises.reduce((sum, ex) => sum + ex.sets, 0);
    if (totalSets === 0) return 0;

    const doneSets = dayExercises.reduce((sum, ex) => {
      const setsArr = completedSets[ex.id] || [];
      return sum + setsArr.filter(Boolean).length;
    }, 0);

    return Math.round((doneSets / totalSets) * 100);
  }, [dayExercises, completedSets]);

  if (dayExercises.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Тренировка • {selectedDay}</h2>
        </div>

        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            На <strong>{formatDayAccusative(selectedDay)}</strong> упражнений
            пока нет. Добавьте их в свою программу, чтобы начать тренировку.
          </p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className={styles.primaryBtn}>
            Перейти к упражнениям
          </button>
        </div>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, dayExercises.length - 1);
  const currentExercise = dayExercises[safeIndex];
  const currentSetsState =
    completedSets[currentExercise.id] ||
    Array(currentExercise.sets).fill(false);

  const toggleSet = (setIndex: number) => {
    const updated = [...currentSetsState];
    updated[setIndex] = !updated[setIndex];
    setCompletedSets((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));
  };

  const isLastExercise = safeIndex === dayExercises.length - 1;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {selectedDay}
          {customDayTitle ? ` • ${customDayTitle}` : ""}
        </h2>

        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.finishTopBtn}>
          Завершить
        </button>
      </div>

      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <span className={styles.progressLabel}>
            Упражнение {safeIndex + 1} из {dayExercises.length}
          </span>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <ExerciseCard exercise={currentExercise} showActions={false} />

      <SetTracker
        key={currentExercise.id}
        setsState={currentSetsState}
        onToggleSet={toggleSet}
        unit={currentExercise.unit}
        target={currentExercise.target}
      />

      <RestTimer />

      <div className={styles.navBar}>
        <button
          type="button"
          disabled={safeIndex === 0}
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          className={styles.prevBtn}>
          ← Назад
        </button>

        <button
          type="button"
          onClick={() =>
            isLastExercise ? navigate("/") : setCurrentIndex((prev) => prev + 1)
          }
          className={styles.nextBtn}>
          {isLastExercise ? "Завершить тренировку" : "Следующее упражнение →"}
        </button>
      </div>
    </div>
  );
};
