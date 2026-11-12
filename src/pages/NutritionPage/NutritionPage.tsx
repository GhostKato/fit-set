import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { seedDefaultNutrition } from "../../redux/nutrition/operations";
import { NutritionCard } from "../../components/NutritionCard/NutritionCard";
import { TodayNutritionBoard } from "./components/TodayNutritionBoard/TodayNutritionBoard";
import { NutritionCreateForm } from "./components/NutritionCreateForm/NutritionCreateForm";
import type { NutritionCategory } from "../../types/nutrition";
import styles from "./NutritionPage.module.css";

type CategoryFilterTab = "Все" | NutritionCategory;

const FILTER_TABS: CategoryFilterTab[] = [
  "Все",
  "Простые углеводы",
  "Сложные углеводы",
  "Белок",
  "Полезные жиры",
  "Клетчатка",
  "Десерт",
  "Соус",
  "Коктейли",
];

export const NutritionPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.nutrition,
  );

  const [selectedTab, setSelectedTab] = useState<CategoryFilterTab>("Все");
  const [activeForm, setActiveForm] = useState<"create" | string | null>(null);

  const isCreateOpen = activeForm === "create";

  const handleToggleCreateForm = () => {
    setActiveForm((prev) => (prev === "create" ? null : "create"));
  };

  const matchesTab = (item: { category: NutritionCategory }) => {
    if (selectedTab === "Все") return true;
    return item.category === selectedTab;
  };

  const filteredItems = items
    .filter(matchesTab)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Мой рацион питания</h2>
        <button
          type="button"
          onClick={handleToggleCreateForm}
          className={`${styles.toggleFormBtn} ${
            isCreateOpen ? styles.toggleFormBtnActive : ""
          }`}>
          {isCreateOpen ? "Закрыть форму" : "+ Добавить пункт"}
        </button>
      </div>

      <TodayNutritionBoard />

      {isCreateOpen && (
        <NutritionCreateForm onSuccess={() => setActiveForm(null)} />
      )}

      <div className={styles.filters}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={`${styles.filterBtn} ${
              selectedTab === tab ? styles.filterBtnActive : ""
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {error && <p className={styles.errorText}>Ошибка: {error}</p>}

      {!isLoading && items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            Ваш рацион пока пуст. Вы можете загрузить свой базовый план питания
            одной кнопкой или добавить пункты вручную.
          </p>
          <button
            type="button"
            onClick={() => dispatch(seedDefaultNutrition())}
            className={styles.seedBtn}>
            Загрузить мой базовый рацион
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          В категории «{selectedTab}» пока нет добавленных пунктов.
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
    </div>
  );
};
