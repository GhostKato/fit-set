import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { addNutritionItem } from "../../../../redux/nutrition/operations";
import type {
  NewNutritionItem,
  NutritionCategory,
} from "../../../../types/nutrition";
import styles from "./NutritionCreateForm.module.css";

interface NutritionCreateFormProps {
  onSuccess: () => void;
}

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

const initialFormState: NewNutritionItem = {
  category: "Сложные углеводы",
  title: "",
  portion: "",
  note: "",
  order: 1,
};

export const NutritionCreateForm = ({
  onSuccess,
}: NutritionCreateFormProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<NewNutritionItem>(initialFormState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await dispatch(addNutritionItem(formData));
    setFormData((prev) => ({
      ...initialFormState,
      category: prev.category,
      order: prev.order + 1,
    }));
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>Новый пункт меню</h3>

      <div className={styles.row}>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`${styles.select} ${styles.flex1}`}>
          {CATEGORY_ORDER.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className={styles.numberGroup}>
          <span>№:</span>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min={1}
            className={`${styles.input} ${styles.numberInput}`}
          />
        </label>
      </div>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Название продукта, коктейля или соуса *"
        required
        className={styles.input}
      />

      <input
        name="portion"
        value={formData.portion}
        onChange={handleChange}
        placeholder="Порция / граммовка (например, 120–130 г)"
        className={styles.input}
      />

      <textarea
        name="note"
        value={formData.note}
        onChange={handleChange}
        placeholder="Примечание или способ приготовления"
        rows={2}
        className={styles.textarea}
      />

      <button type="submit" className={styles.submitBtn}>
        Сохранить в рацион
      </button>
    </form>
  );
};
