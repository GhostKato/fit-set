import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { addExercise } from "../../../../redux/exercises/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import type { ExerciseUnit, NewExercise } from "../../../../types/exercise";
import styles from "./ExerciseCreateForm.module.css";

interface ExerciseCreateFormProps {
  onSuccess: () => void;
}

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const UNIT_OPTIONS = [
  { value: "reps", label: "повт." },
  { value: "sec", label: "сек." },
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

export const ExerciseCreateForm = ({ onSuccess }: ExerciseCreateFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<NewExercise>(initialFormState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sets" || name === "target" || name === "order"
          ? Number(value)
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
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>Новое упражнение</h3>

      <div className={styles.row}>
        <CustomSelect
          value={formData.day}
          options={ALL_DAYS}
          onChange={(val) => setFormData((prev) => ({ ...prev, day: val }))}
        />

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

        <CustomSelect
          value={formData.unit}
          options={UNIT_OPTIONS}
          title="Единица измерения"
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, unit: val as ExerciseUnit }))
          }
        />

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
  );
};
