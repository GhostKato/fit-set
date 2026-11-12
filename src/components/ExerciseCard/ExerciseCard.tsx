import { useState, type ChangeEvent } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { editExercise, removeExercise } from "../../redux/exercises/operations";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import type { Exercise, ExerciseUnit, NewExercise } from "../../types/exercise";
import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
  exercise: Exercise;
  showActions?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
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

export const ExerciseCard = ({
  exercise,
  showActions = true,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
}: ExerciseCardProps) => {
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  });

  const handleOpenEdit = () => {
    setFormData({
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
    });
    onStartEdit?.();
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

  const handleSave = async () => {
    await dispatch(editExercise({ id: exercise.id, fields: formData }));
    onCancelEdit?.();
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    await dispatch(removeExercise(exercise.id));
  };

  const hasDetails = Boolean(
    exercise.targetMuscles ||
    exercise.howToDo ||
    exercise.handsMode ||
    exercise.palmPosition ||
    exercise.breathing,
  );

  if (isEditing && showActions) {
    return (
      <div className={styles.cardEditing}>
        <h4 className={styles.editTitle}>Редактирование упражнения</h4>
        <div className={styles.editGrid}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название"
            className={styles.input}
          />
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
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="№"
              title="Порядок"
              className={`${styles.input} ${styles.numberInput}`}
            />
          </div>
          <div className={styles.row}>
            <input
              type="number"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              placeholder="Подходы"
              title="Подходы"
              className={`${styles.input} ${styles.numberInput}`}
            />
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder={formData.unit === "sec" ? "Секунды" : "Повторы"}
              title={formData.unit === "sec" ? "Секунды" : "Повторы"}
              className={`${styles.input} ${styles.numberInput}`}
            />
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
              placeholder="Вес (например, 40 кг)"
              className={`${styles.input} ${styles.flex1}`}
            />
          </div>
          <input
            name="targetMuscles"
            value={formData.targetMuscles}
            onChange={handleChange}
            placeholder="Целевые мышцы"
            className={styles.input}
          />
          <textarea
            name="howToDo"
            value={formData.howToDo}
            onChange={handleChange}
            placeholder="Техника выполнения"
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
          <button
            type="button"
            onClick={() => onCancelEdit?.()}
            className={styles.cancelBtn}>
            Отмена
          </button>
          <button type="button" onClick={handleSave} className={styles.saveBtn}>
            Сохранить
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <span className={styles.meta}>
              {exercise.day}
              {exercise.muscleGroup && ` • ${exercise.muscleGroup}`} • №
              {exercise.order}
            </span>
            <h3 className={styles.name}>{exercise.name}</h3>
            <p className={styles.stats}>
              {exercise.sets} подх. × {exercise.target}{" "}
              {exercise.unit === "sec" ? "сек." : "повт."} | Вес:{" "}
              {exercise.weight || "Свой вес"}
            </p>
          </div>

          {showActions && (
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleOpenEdit}
                className={styles.editBtn}>
                Изменить
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className={styles.deleteBtn}>
                Удалить
              </button>
            </div>
          )}
        </div>

        {hasDetails && (
          <div className={styles.details}>
            {exercise.targetMuscles && (
              <p className={styles.detailItem}>
                <strong>Работающие мышцы:</strong> {exercise.targetMuscles}
              </p>
            )}
            {exercise.howToDo && (
              <p className={styles.detailItem}>
                <strong>Как выполнять:</strong> {exercise.howToDo}
              </p>
            )}
            {exercise.handsMode && (
              <p className={styles.detailItem}>
                <strong>Режим работы рук:</strong> {exercise.handsMode}
              </p>
            )}
            {exercise.palmPosition && (
              <p className={styles.detailItem}>
                <strong>Положение ладоней:</strong> {exercise.palmPosition}
              </p>
            )}
            {exercise.breathing && (
              <p className={styles.detailItem}>
                <strong>Дыхание:</strong> {exercise.breathing}
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
