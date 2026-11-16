import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { addNutrition } from "../../../../redux/nutrition/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateCategory } from "../../../../i18n";
import type {
  NewNutritionItem,
  NutritionCategory,
} from "../../../../types/nutrition";
import styles from "./NutritionCreateForm.module.css";

interface NutritionCreateFormProps {
  onSuccess: () => void;
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

const initialFormState: NewNutritionItem = {
  category: "Белок",
  title: "",
  portion: "",
  note: "",
};

export const NutritionCreateForm = ({
  onSuccess,
}: NutritionCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<NewNutritionItem>(initialFormState);

  const categoryOptions = ALL_CATEGORIES.map((cat) => ({
    value: cat,
    label: translateCategory(cat, language),
  }));

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
      addNutrition({
        category: formData.category,
        title: formData.title.trim(),
        portion: formData.portion.trim(),
        note: formData.note.trim(),
      }),
    );

    setFormData((prev) => ({
      ...initialFormState,
      category: prev.category,
    }));
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>{t.formNewNutritionTitle}</h3>

      <div className={styles.row}>
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
          className={`${styles.input} ${styles.flex2}`}
        />
      </div>

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

      <button type="submit" className={styles.submitBtn}>
        {t.formNutritionSaveBtn}
      </button>
    </form>
  );
};
