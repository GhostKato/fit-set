import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  removeAllNutrition,
  seedDefaultNutrition,
} from "../../redux/nutrition/operations";
import { TodayNutritionBoard } from "../../components/TodayNutritionBoard/TodayNutritionBoard";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { NutritionCard } from "./components/NutritionCard/NutritionCard";
import { NutritionCreateForm } from "./components/NutritionCreateForm/NutritionCreateForm";
import { useLanguage } from "../../context/LanguageContext";
import { translateCategory } from "../../i18n";
import type { NutritionCategory } from "../../types/nutrition";
import styles from "./NutritionPage.module.css";

const ALL_CATEGORIES: NutritionCategory[] = [
  "simple_carbs",
  "complex_carbs",
  "protein",
  "fats",
  "fiber",
  "sauce",
  "shakes",
  "dessert",
];

const ALL_TAB = "all";

export const NutritionPage = () => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.nutrition,
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_TAB);
  const [activeForm, setActiveForm] = useState<"create" | string | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const isFormOpen = activeForm === "create";

  const handleToggleCreateForm = () => {
    setActiveForm((prev) => (prev === "create" ? null : "create"));
  };

  const handleConfirmDeleteAll = () => {
    setIsDeleteAllOpen(false);
    setActiveForm(null);
    dispatch(removeAllNutrition());
  };

  const getTabLabel = (tab: string) =>
    tab === ALL_TAB ? t.filterAll : translateCategory(tab, language);

  const filteredItems = items
    .filter((item) =>
      selectedCategory === ALL_TAB ? true : item.category === selectedCategory,
    )
    .sort((a, b) => (a.order ?? 1) - (b.order ?? 1));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.nutritionTitle}</h2>

        <div className={styles.headerActions}>
          <button
            type="button"
            disabled={items.length === 0 || isLoading}
            onClick={() => setIsDeleteAllOpen(true)}
            className={styles.deleteAllBtn}>
            {t.deleteAllBtn}
          </button>

          <button
            type="button"
            onClick={handleToggleCreateForm}
            className={`${styles.toggleFormBtn} ${
              isFormOpen ? styles.toggleFormBtnActive : ""
            }`}>
            {isFormOpen ? t.closeFormBtn : t.addBtn}
          </button>
        </div>
      </div>

      {isFormOpen && (
        <NutritionCreateForm onSuccess={() => setActiveForm(null)} />
      )}

      <TodayNutritionBoard isEditable />

      <div className={styles.filters}>
        {[ALL_TAB, ...ALL_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.filterBtn} ${
              selectedCategory === cat ? styles.filterBtnActive : ""
            }`}>
            {getTabLabel(cat)}
          </button>
        ))}
      </div>

      {error && (
        <p className={styles.errorText}>
          {t.errorPrefix}: {error}
        </p>
      )}

      {!isLoading && items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t.nutritionEmptyText}</p>
          <button
            type="button"
            onClick={() => dispatch(seedDefaultNutrition(language))}
            className={styles.seedBtn}>
            {t.nutritionSeedBtn}
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          {t.nutritionEmptyCategoryPrefix}
          {getTabLabel(selectedCategory)}
          {t.nutritionEmptyCategorySuffix}
        </div>
      ) : (
        <div className={styles.cardsList}>
          {filteredItems.map((item) => (
            <NutritionCard
              key={item.id}
              item={item}
              isEditing={activeForm === item.id}
              onStartEdit={() => setActiveForm(item.id)}
              onCancelEdit={() => setActiveForm(null)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteAllOpen}
        title={t.deleteAllConfirmTitle}
        onConfirm={handleConfirmDeleteAll}
        onCancel={() => setIsDeleteAllOpen(false)}
      />
    </div>
  );
};
