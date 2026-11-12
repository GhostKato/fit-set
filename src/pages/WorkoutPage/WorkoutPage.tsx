import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RestTimer } from "../../components/RestTimer/RestTimer";
import styles from "./WorkoutPage.module.css";

export const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDay = searchParams.get("day") || "Понедельник";

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

      <div className={styles.exerciseCard}>
        <span className={styles.muscleBadge}>
          {currentExercise.muscleGroup}
        </span>
        <h2 className={styles.exerciseName}>{currentExercise.name}</h2>

        <p className={styles.stats}>
          {currentExercise.sets} подх. × {currentExercise.reps} повт. • Вес:{" "}
          {currentExercise.weight || "Свой вес"}
        </p>

        <div className={styles.setsSection}>
          <h4 className={styles.setsHeading}>Отметьте выполненные подходы:</h4>
          <div className={styles.setsGrid}>
            {currentSetsState.map((isDone, idx) => (
              <label
                key={idx}
                className={`${styles.setLabel} ${
                  isDone ? styles.setLabelDone : ""
                }`}>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleSet(idx)}
                  className={styles.setCheckbox}
                />
                <span>Подход {idx + 1}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.details}>
          {currentExercise.targetMuscles && (
            <p className={styles.detailItem}>
              <strong>Мышцы:</strong> {currentExercise.targetMuscles}
            </p>
          )}
          {currentExercise.howToDo && (
            <p className={styles.detailItem}>
              <strong>Техника:</strong> {currentExercise.howToDo}
            </p>
          )}
          {currentExercise.handsMode && (
            <p className={styles.detailItem}>
              <strong>Хват:</strong> {currentExercise.handsMode}
            </p>
          )}
          {currentExercise.palmPosition && (
            <p className={styles.detailItem}>
              <strong>Ладони:</strong> {currentExercise.palmPosition}
            </p>
          )}
          {currentExercise.breathing && (
            <p className={styles.detailItem}>
              <strong>Дыхание:</strong> {currentExercise.breathing}
            </p>
          )}
        </div>
      </div>

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
