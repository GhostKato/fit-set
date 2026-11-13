import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { editNutritionItem } from "../../../../redux/nutrition/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import type {
  NewNutritionItem,
  NutritionCategory,
  NutritionItem,
} from "../../../../types/nutrition";
import styles from "./NutritionEditForm.module.css";

interface NutritionEditFormProps {
  item: NutritionItem;
  onCancel: () => void;
}

const CATEGORY_ORDER: NutritionCategory[] = [
  "Простые углеводы",
  "Сложные углеводы",
  "Белок",
  "Жиры",
  "Клетчатка",
  "Соус",
  "Коктейли",
  "Десерт",
];

export const NutritionEditForm = ({
  item,
  onCancel,
}: NutritionEditFormProps) => {
  const dispatch = useAppDispatch();

  const [editData, setEditData] = useState<NewNutritionItem>({
    category: item.category,
    title: item.title,
    portion: item.portion,
    note: item.note,
    order: item.order,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData.title.trim()) return;
    await dispatch(editNutritionItem({ id: item.id, fields: editData }));
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cardEditing}>
      <h4 className={styles.editTitle}>Редактирование пункта</h4>

      <div className={styles.editGrid}>
        <div className={styles.row}>
          <CustomSelect
            value={editData.category}
            options={CATEGORY_ORDER}
            onChange={(val) =>
              setEditData((prev) => ({
                ...prev,
                category: val as NutritionCategory,
              }))
            }
            className={styles.flex1}
          />

          <label className={styles.numberGroup}>
            <span>№:</span>
            <input
              type="number"
              name="order"
              value={editData.order}
              onChange={handleChange}
              min={1}
              className={`${styles.input} ${styles.numberInput}`}
            />
          </label>
        </div>

        <input
          name="title"
          value={editData.title}
          onChange={handleChange}
          placeholder="Название *"
          required
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
