import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";
import type { MealTime } from "../../../../types/nutrition";
import styles from "./HomeNutritionCard.module.css";

const MEAL_ORDER: MealTime[] = ["Завтрак", "Обед", "Ужин"];

export const HomeNutritionCard = () => {
  const navigate = useNavigate();
  const { items, dailySelection, schedule } = useAppSelector(
    (state) => state.nutrition,
  );

  const totalSelectedCount = useMemo(
    () =>
      (dailySelection.Завтрак?.length ?? 0) +
      (dailySelection.Обед?.length ?? 0) +
      (dailySelection.Ужин?.length ?? 0),
    [dailySelection],
  );

  return (
    <section className={styles.nutritionSection}>
      <div className={styles.header}>
        <h3 className={styles.title}>Питание на сегодня</h3>

        <button
          type="button"
          onClick={() => navigate("/nutrition")}
          className={styles.manageBtn}>
          {totalSelectedCount > 0 ? "Изменить рацион" : "Выбрать на сегодня"}
        </button>
      </div>

      {totalSelectedCount === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyText}>
            На сегодня блюда ещё не выбраны. Откройте раздел «Питание», чтобы
            составить меню дня.
          </p>
        </div>
      ) : (
        <div className={styles.mealsGrid}>
          {MEAL_ORDER.map((mealKey) => {
            const mealIds = dailySelection[mealKey] ?? [];
            const mealProducts = mealIds
              .map((id) => items.find((i) => i.id === id))
              .filter(Boolean);

            return (
              <div key={mealKey} className={styles.mealCard}>
                <div className={styles.mealTop}>
                  <span className={styles.mealName}>{mealKey}</span>
                  <span className={styles.mealTime}>{schedule[mealKey]}</span>
                </div>

                {mealProducts.length === 0 ? (
                  <p className={styles.mealEmpty}>Не выбрано</p>
                ) : (
                  <ul className={styles.mealList}>
                    {mealProducts.map((prod) =>
                      prod ? (
                        <li key={prod.id} className={styles.mealItem}>
                          <strong>{prod.title}</strong>
                          {prod.portion ? ` — ${prod.portion}` : ""}
                        </li>
                      ) : null,
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
