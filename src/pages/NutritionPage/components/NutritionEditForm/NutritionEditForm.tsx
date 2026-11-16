import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { editNutrition } from "../../../../redux/nutrition/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateCategory } from "../../../../i18n";
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

const ALL_CATEGORIES: NutritionCategory[] = [
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
  const { language, t } = useLanguage();

  const categoryOptions = ALL_CATEGORIES.map((cat) => ({
    value: cat,
    label: translateCategory(cat, language),
  }));

  const [formData, setFormData] = useState<NewNutritionItem>({
    category: item.category,
    title: item.title,
    portion: item.portion,
    note: item.note,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await dispatch(
      editNutrition({
        id: item.id,
        fields: {
          category: formData.category,
          title: formData.title.trim(),
          portion: formData.portion.trim(),
          note: formData.note.trim(),
        },
      }),
    );
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cardEditing}>
      <h4 className={styles.editTitle}>{t.formEditNutritionTitle}</h4>

      <div className={styles.editGrid}>
        <CustomSelect
          value={formData.category}
          options={categoryOptions}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              category: val as NutritionCategory,
            }))
          }
        />

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t.formNutritionTitlePlaceholder}
          required
          className={styles.input}
        />

        <input
          name="portion"
          value={formData.portion}
          onChange={handleChange}
          placeholder={t.formNutritionPortionPlaceholder}
          className={styles.input}
        />

        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder={t.formNutritionNotePlaceholder}
          rows={2}
          className={styles.textarea}
        />
      </div>

      <div className={styles.editActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          {t.cancelBtn}
        </button>
        <button type="submit" className={styles.saveBtn}>
          {t.saveBtn}
        </button>
      </div>
    </form>
  );
};
