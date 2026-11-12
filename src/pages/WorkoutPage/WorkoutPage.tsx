import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { SetTracker } from "../../components/SetTracker/SetTracker";
import { RestTimer } from "../../components/RestTimer/RestTimer";
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>(
    {},
  );

  if (dayExercises.length === 0) {
    return (
      <div className={styles.emptyCard}>
        <h2 className={styles.emptyTitle}>
          На {selectedDay} упражнений пока нет
        </h2>
        <button
          type="button"
          onClick={() => navigate("/exercises")}
          className={styles.addBtn}>
          Добавить упражнения
        </button>
      </div>
    );
  }

  const currentExercise = dayExercises[currentIndex];
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

  const isLastExercise = currentIndex === dayExercises.length - 1;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span className={styles.progressText}>
          {selectedDay} • Упражнение {currentIndex + 1} из {dayExercises.length}
        </span>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.finishTopBtn}>
          Завершить
        </button>
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
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
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
