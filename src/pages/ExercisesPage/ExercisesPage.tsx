import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { seedDefaultExercises } from "../../redux/exercises/operations";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { ExerciseCreateForm } from "./components/ExerciseCreateForm/ExerciseCreateForm";
import styles from "./ExercisesPage.module.css";

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const INACTIVE_TAB = "Неактивные";

export const ExercisesPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.exercises,
  );

  const [selectedDay, setSelectedDay] = useState<string>("Все");
  const [activeForm, setActiveForm] = useState<"create" | string | null>(null);

  const isFormOpen = activeForm === "create";

  const handleToggleCreateForm = () => {
    setActiveForm((prev) => (prev === "create" ? null : "create"));
  };

  const filteredExercises = items
    .filter((item) => {
      if (selectedDay === INACTIVE_TAB) return !item.isActive;
      if (!item.isActive) return false;
      return selectedDay === "Все" ? true : item.day === selectedDay;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Моя программа упражнений</h2>
        <button
          type="button"
          onClick={handleToggleCreateForm}
          className={`${styles.toggleFormBtn} ${
            isFormOpen ? styles.toggleFormBtnActive : ""
          }`}>
          {isFormOpen ? "Закрыть форму" : "+ Добавить"}
        </button>
      </div>

      {isFormOpen && (
        <ExerciseCreateForm onSuccess={() => setActiveForm(null)} />
      )}

      <div className={styles.filters}>
        {["Все", ...ALL_DAYS, INACTIVE_TAB].map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`${styles.filterBtn} ${
              selectedDay === day ? styles.filterBtnActive : ""
            }`}>
            {day}
          </button>
        ))}
      </div>

      {error && <p className={styles.errorText}>Ошибка: {error}</p>}

      {!isLoading && items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            Ваша программа упражнений пока пуста. Вы можете загрузить свою
            базовую программу одной кнопкой или добавить упражнения вручную.
          </p>
          <button
            type="button"
            onClick={() => dispatch(seedDefaultExercises())}
            className={styles.seedBtn}>
            Загрузить мою базовую программу
          </button>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className={styles.emptyState}>
          {selectedDay === INACTIVE_TAB
            ? "Неактивных упражнений пока нет."
            : `На день «${selectedDay}» пока нет активных упражнений.`}
        </div>
      ) : (
        filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isEditing={activeForm === exercise.id}
            onStartEdit={() => setActiveForm(exercise.id)}
            onCancelEdit={() => setActiveForm(null)}
          />
        ))
      )}
    </div>
  );
};
