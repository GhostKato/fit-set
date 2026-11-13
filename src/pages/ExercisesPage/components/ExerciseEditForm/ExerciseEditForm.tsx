import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { editExercise } from "../../../../redux/exercises/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import { StatusToggle } from "../../../../components/StatusToggle/StatusToggle";
import type {
  Exercise,
  ExerciseUnit,
  NewExercise,
} from "../../../../types/exercise";
import styles from "./ExerciseEditForm.module.css";

interface ExerciseEditFormProps {
  exercise: Exercise;
  onCancel: () => void;
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

export const ExerciseEditForm = ({
  exercise,
  onCancel,
}: ExerciseEditFormProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<NewExercise>({
    day: exercise.day,
    dayTitle: exercise.dayTitle,
    muscleGroup: exercise.muscleGroup,
    order: exercise.order,
    name: exercise.name,
    targetMuscles: exercise.targetMuscles,
    sets: exercise.sets,
    target: exercise.target,
    unit: exercise.unit || "reps",
    weight: exercise.weight,
    howToDo: exercise.howToDo,
    handsMode: exercise.handsMode,
    palmPosition: exercise.palmPosition,
    breathing: exercise.breathing,
    isActive: exercise.isActive,
  });

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
    await dispatch(editExercise({ id: exercise.id, fields: formData }));
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cardEditing}>
      <h4 className={styles.editTitle}>Редактирование упражнения</h4>

      <div className={styles.editGrid}>
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

          <StatusToggle
            checked={formData.isActive}
            onChange={(nextValue) =>
              setFormData((prev) => ({ ...prev, isActive: nextValue }))
            }
            size="md"
            label="Статус:"
            labelPosition="left"
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
      </div>

      <div className={styles.editActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          Отмена
        </button>
        <button type="submit" className={styles.saveBtn}>
          Сохранить
        </button>
      </div>
    </form>
  );
};
