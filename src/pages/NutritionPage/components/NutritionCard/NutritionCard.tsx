import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  removeNutrition,
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
    await dispatch(removeNutrition(item.id));
  };

  if (isEditing) {
    return <NutritionEditForm item={item} onCancel={() => onCancelEdit?.()} />;
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <span className={styles.categoryBadge}>
              {translateCategory(item.category, language)}
            </span>
            <h4 className={styles.cardTitle}>{item.title}</h4>
          </div>

          <div className={styles.cardActions}>
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

        {item.portion && (
          <p className={styles.portionText}>
            <strong>{t.portionLabel}:</strong> {item.portion}
          </p>
        )}

        {item.note && (
          <p className={styles.noteText}>
            <strong>{t.noteLabel}:</strong> {item.note}
          </p>
        )}

        <div className={styles.mealSelectorRow}>
          <span className={styles.mealSelectorLabel}>{t.selectTodayFor}</span>
          <div className={styles.mealPills}>
            {MEAL_ORDER.map((mealKey) => {
              const isSelected = (dailySelection[mealKey] ?? []).includes(
                item.id,
              );
              return (
                <button
                  key={mealKey}
                  type="button"
                  onClick={() => handleToggleMealForToday(mealKey)}
                  className={`${styles.mealPill} ${
                    isSelected ? styles.mealPillActive : ""
                  }`}>
                  {isSelected ? "✓ " : "+ "}
                  {translateMeal(mealKey, language)}
                </button>
              );
            })}
          </div>
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
