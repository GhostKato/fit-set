import { useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { editExercise, removeExercise } from "../../redux/exercises/operations";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { StatusToggle } from "../StatusToggle/StatusToggle";
import { ExerciseEditForm } from "../../pages/ExercisesPage/components/ExerciseEditForm/ExerciseEditForm";
import type { Exercise } from "../../types/exercise";
import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
  exercise: Exercise;
  showActions?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
}

export const ExerciseCard = ({
  exercise,
  showActions = true,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
}: ExerciseCardProps) => {
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggleActive = (nextValue: boolean) => {
    dispatch(
      editExercise({
        id: exercise.id,
        fields: { isActive: nextValue },
      }),
    );
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
      <ExerciseEditForm exercise={exercise} onCancel={() => onCancelEdit?.()} />
    );
  }

  return (
    <>
      <div
        className={`${styles.card} ${
          !exercise.isActive ? styles.cardInactive : ""
        }`}>
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
              <StatusToggle
                checked={exercise.isActive}
                onChange={handleToggleActive}
                size="sm"
              />
              <button
                type="button"
                onClick={() => onStartEdit?.()}
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
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};
