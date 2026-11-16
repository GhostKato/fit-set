import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  removeNutritionItem,
  syncTodaySelection,
} from "../../../../redux/nutrition/operations";
import { setDailySelectionOptimistic } from "../../../../redux/nutrition/slice";
import { ConfirmModal } from "../../../../components/ConfirmModal/ConfirmModal";
import { NutritionEditForm } from "../NutritionEditForm/NutritionEditForm";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateCategory, translateMeal } from "../../../../i18n";
import type { MealTime, NutritionItem } from "../../../../types/nutrition";
import styles from "./NutritionCard.module.css";

interface NutritionCardProps {
  item: NutritionItem;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
}

const MEAL_ORDER: MealTime[] = ["Завтрак", "Обед", "Ужин"];

export const NutritionCard = ({
  item,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
}: NutritionCardProps) => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();
  const dailySelection = useAppSelector(
    (state) => state.nutrition.dailySelection,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isAnyMealSelected = MEAL_ORDER.some((mealKey) =>
    (dailySelection[mealKey] ?? []).includes(item.id),
  );

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

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    await dispatch(removeNutritionItem(item.id));
  };

  if (isEditing) {
    return <NutritionEditForm item={item} onCancel={() => onCancelEdit?.()} />;
  }

  return (
    <>
      <div
        className={`${styles.card} ${
          isAnyMealSelected ? styles.cardSelected : ""
        }`}>
        <div className={styles.header}>
          <div className={styles.info}>
            <span className={styles.meta}>
              {translateCategory(item.category, language)} • №{item.order ?? 1}
            </span>
            <h4 className={styles.name}>{item.title}</h4>
            {item.portion && (
              <p className={styles.portion}>
                {t.portionLabel}: {item.portion}
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => onStartEdit?.()}
              className={styles.editBtn}>
              {t.editBtn}
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className={styles.deleteBtn}>
              {t.deleteBtn}
            </button>
          </div>
        </div>

        {item.note && (
          <p className={styles.note}>
            <strong>{t.noteLabel}:</strong> {item.note}
          </p>
        )}

        <div className={styles.mealPickerRow}>
          <span className={styles.pickerLabel}>{t.selectTodayFor}</span>
          {MEAL_ORDER.map((mealKey) => {
            const isSelected = (dailySelection[mealKey] ?? []).includes(
              item.id,
            );
            return (
              <button
                key={mealKey}
                type="button"
                onClick={() => handleToggleMealForToday(mealKey)}
                className={`${styles.mealToggleBtn} ${
                  isSelected ? styles.mealToggleBtnActive : ""
                }`}>
                {isSelected ? "✓ " : "+ "}
                {translateMeal(mealKey, language)}
              </button>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};
