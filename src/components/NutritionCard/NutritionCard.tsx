import { useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  editNutritionItem,
  removeNutritionItem,
  syncTodaySelection,
} from "../../redux/nutrition/operations";
import { setDailySelectionOptimistic } from "../../redux/nutrition/slice";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import type {
  MealTime,
  NewNutritionItem,
  NutritionCategory,
  NutritionItem,
} from "../../types/nutrition";
import styles from "./NutritionCard.module.css";

interface NutritionCardProps {
  item: NutritionItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

const MEAL_ORDER: MealTime[] = ["Завтрак", "Обед", "Ужин"];

const CATEGORY_ORDER: NutritionCategory[] = [
  "Простые углеводы",
  "Сложные углеводы",
  "Белок",
  "Полезные жиры",
  "Клетчатка",
  "Соус",
  "Коктейли",
  "Десерт",
];

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

  const [editData, setEditData] = useState<NewNutritionItem>({
    category: item.category,
    title: item.title,
    portion: item.portion,
    note: item.note,
    order: item.order,
  });

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!editData.title.trim()) return;
    await dispatch(editNutritionItem({ id: item.id, fields: editData }));
    onCancelEdit();
  };

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    dispatch(removeNutritionItem(item.id));
  };

  const isSelectedAnywhere = MEAL_ORDER.some((m) =>
    dailySelection[m]?.includes(item.id),
  );

  if (isEditing) {
    return (
      <div className={styles.cardEditing}>
        <h4 className={styles.editTitle}>Редактирование пункта</h4>
        <div className={styles.editGrid}>
          <div className={styles.row}>
            <select
              name="category"
              value={editData.category}
              onChange={handleChange}
              className={`${styles.select} ${styles.flex1}`}>
              {CATEGORY_ORDER.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="order"
              value={editData.order}
              onChange={handleChange}
              min={1}
              className={`${styles.input} ${styles.numberInput}`}
            />
          </div>

          <input
            name="title"
            value={editData.title}
            onChange={handleChange}
            placeholder="Название"
            className={styles.input}
          />

          <input
            name="portion"
            value={editData.portion}
            onChange={handleChange}
            placeholder="Порция / граммовка"
            className={styles.input}
          />

          <textarea
            name="note"
            value={editData.note}
            onChange={handleChange}
            placeholder="Примечание"
            rows={2}
            className={styles.textarea}
          />
        </div>

        <div className={styles.editActions}>
          <button
            type="button"
            onClick={onCancelEdit}
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
      <div
        className={`${styles.card} ${
          isSelectedAnywhere ? styles.cardSelected : ""
        }`}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.badgesRow}>
              <span className={styles.categoryBadge}>{item.category}</span>
            </div>

            <h4 className={styles.title}>{item.title}</h4>
            {item.portion && <p className={styles.portion}>{item.portion}</p>}
            {item.note && <p className={styles.note}>{item.note}</p>}
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
          <span className={styles.pickerLabel}>Выбрать на сегодня:</span>
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
