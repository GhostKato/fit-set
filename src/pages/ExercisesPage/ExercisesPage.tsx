import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
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

export const ExercisesPage = () => {
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
    .filter((item) => (selectedDay === "Все" ? true : item.day === selectedDay))
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
        {["Все", ...ALL_DAYS].map((day) => (
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

      {!isLoading && filteredExercises.length === 0 ? (
        <div className={styles.emptyState}>
          Пока нет упражнений. Нажмите «+ Добавить упражнение», чтобы создать
          первое.
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
