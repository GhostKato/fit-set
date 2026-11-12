import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addExercise } from "../../redux/exercises/operations";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import type { ExerciseUnit, NewExercise } from "../../types/exercise";
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

const initialFormState: NewExercise = {
  day: "Понедельник",
  dayTitle: "",
  muscleGroup: "",
  order: 1,
  name: "",
  targetMuscles: "",
  sets: 3,
  target: 12,
  unit: "reps",
  weight: "",
  howToDo: "",
  handsMode: "",
  palmPosition: "",
  breathing: "",
};

export const ExercisesPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.exercises,
  );

  const [formData, setFormData] = useState<NewExercise>(initialFormState);
  const [selectedDay, setSelectedDay] = useState<string>("Все");
  const [activeForm, setActiveForm] = useState<"create" | string | null>(null);

  const isFormOpen = activeForm === "create";

  const handleToggleCreateForm = () => {
    setActiveForm((prev) => (prev === "create" ? null : "create"));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sets" || name === "target" || name === "order"
          ? Number(value)
          : name === "unit"
            ? (value as ExerciseUnit)
            : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await dispatch(addExercise(formData));
    setFormData((prev) => ({
      ...initialFormState,
      day: prev.day,
      dayTitle: prev.dayTitle,
      order: prev.order + 1,
    }));
    setActiveForm(null);
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
          {isFormOpen ? "Закрыть форму" : "+ Добавить упражнение"}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>Новое упражнение</h3>

          <div className={styles.row}>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className={styles.select}>
              {ALL_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              name="dayTitle"
              value={formData.dayTitle}
              onChange={handleChange}
              placeholder="Тема дня"
              className={`${styles.input} ${styles.flex1}`}
            />

            <input
              name="muscleGroup"
              value={formData.muscleGroup}
              onChange={handleChange}
              placeholder="Группа мышц"
              className={`${styles.input} ${styles.flex1}`}
            />
          </div>

          <div className={styles.row}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Название упражнения *"
              required
              className={`${styles.input} ${styles.flex2}`}
            />

            <label className={styles.numberGroup}>
              <span>№:</span>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min={1}
                title="Порядок в тренировке"
                className={`${styles.input} ${styles.numberInput}`}
              />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.numberGroup}>
              <span>Подходы:</span>
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                min={1}
                className={`${styles.input} ${styles.numberInput}`}
              />
            </label>

            <label className={styles.numberGroup}>
              <span className={styles.targetLabel}>
                {formData.unit === "sec" ? "Секунды:" : "Повторы:"}
              </span>
              <input
                type="number"
                name="target"
                value={formData.target}
                onChange={handleChange}
                min={1}
                className={`${styles.input} ${styles.numberInput}`}
              />
            </label>

            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className={styles.select}
              title="Единица измерения">
              <option value="reps">повт.</option>
              <option value="sec">сек.</option>
            </select>

            <input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Рабочий вес"
              className={`${styles.input} ${styles.flex1}`}
            />
          </div>

          <input
            name="targetMuscles"
            value={formData.targetMuscles}
            onChange={handleChange}
            placeholder="Работающие мышцы"
            className={styles.input}
          />

          <textarea
            name="howToDo"
            value={formData.howToDo}
            onChange={handleChange}
            placeholder="Как выполнять"
            rows={2}
            className={styles.textarea}
          />

          <input
            name="handsMode"
            value={formData.handsMode}
            onChange={handleChange}
            placeholder="Режим работы рук"
            className={styles.input}
          />

          <input
            name="palmPosition"
            value={formData.palmPosition}
            onChange={handleChange}
            placeholder="Положение ладоней"
            className={styles.input}
          />

          <input
            name="breathing"
            value={formData.breathing}
            onChange={handleChange}
            placeholder="Дыхание"
            className={styles.input}
          />

          <button type="submit" className={styles.submitBtn}>
            Создать
          </button>
        </form>
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
