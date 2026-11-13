import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  removeNutritionItem,
  syncTodaySelection,
} from "../../../../redux/nutrition/operations";
import { setDailySelectionOptimistic } from "../../../../redux/nutrition/slice";
import { ConfirmModal } from "../../../../components/ConfirmModal/ConfirmModal";
import { NutritionEditForm } from "../NutritionEditForm/NutritionEditForm";
import type { MealTime, NutritionItem } from "../../../../types/nutrition";
import styles from "./NutritionCard.module.css";

interface NutritionCardProps {
  item: NutritionItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

const MEAL_ORDER: MealTime[] = ["Завтрак", "Обед", "Ужин"];

export const NutritionCard = ({
  item,
  isEditing,
  onStartEdit,
  onCancelEdit,
}: NutritionCardProps) => {
  const dispatch = useAppDispatch();
  const dailySelection = useAppSelector(
    (state) => state.nutrition.dailySelection,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleToggleMealForToday = (mealKey: MealTime) => {
    const currentList = dailySelection[mealKey] ?? [];
    const exists = currentList.includes(item.id);
    const nextList = exists
      ? currentList.filter((id) => id !== item.id)
      : [...currentList, item.id];

    const nextSelection = {
      ...dailySelection,
      [mealKey]: nextList,
    };

    dispatch(setDailySelectionOptimistic(nextSelection));
    dispatch(syncTodaySelection(nextSelection));
  };

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    dispatch(removeNutritionItem(item.id));
  };

  const isSelectedAnywhere = MEAL_ORDER.some((m) =>
    dailySelection[m]?.includes(item.id),
  );

  if (isEditing) {
    return <NutritionEditForm item={item} onCancel={onCancelEdit} />;
  }

  return (
    <>
      <div
        className={`${styles.card} ${
          isSelectedAnywhere ? styles.cardSelected : ""
        }`}>
        <div className={styles.header}>
          <div className={styles.info}>
            <span className={styles.meta}>{item.category}</span>
            <h3 className={styles.name}>{item.title}</h3>
            {item.portion && (
              <p className={styles.portion}>Порция: {item.portion}</p>
            )}
            {item.note && (
              <p className={styles.note}>
                <strong>Заметка:</strong> {item.note}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onStartEdit}
              className={styles.editBtn}>
              Изменить
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className={styles.deleteBtn}>
              Удалить
            </button>
          </div>
        </div>

        <div className={styles.mealPickerRow}>
          <span className={styles.pickerLabel}>Выбрать сегодня на:</span>
          {MEAL_ORDER.map((mealKey) => {
            const isAdded = dailySelection[mealKey]?.includes(item.id);
            return (
              <button
                key={mealKey}
                type="button"
                onClick={() => handleToggleMealForToday(mealKey)}
                className={`${styles.mealToggleBtn} ${
                  isAdded ? styles.mealToggleBtnActive : ""
                }`}>
                {isAdded ? `✓ ${mealKey}` : `+ ${mealKey}`}
              </button>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
