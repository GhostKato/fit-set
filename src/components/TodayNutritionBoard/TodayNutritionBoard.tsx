import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  syncTodaySelection,
  updateMealSchedule,
} from "../../redux/nutrition/operations";
import { setDailySelectionOptimistic } from "../../redux/nutrition/slice";
import { EMPTY_DAILY_SELECTION } from "../../services/nutritionOps";
import type { MealTime } from "../../types/nutrition";
import styles from "./TodayNutritionBoard.module.css";

interface TodayNutritionBoardProps {
  isEditable?: boolean;
}

const MEAL_ORDER: MealTime[] = ["Завтрак", "Обед", "Ужин"];

export const TodayNutritionBoard = ({
  isEditable = false,
}: TodayNutritionBoardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, dailySelection, schedule } = useAppSelector(
    (state) => state.nutrition,
  );

  const [editingScheduleMeal, setEditingScheduleMeal] =
    useState<MealTime | null>(null);
  const [scheduleInput, setScheduleInput] = useState("");

  const handleToggleMealForToday = (itemId: string, mealKey: MealTime) => {
    const currentList = dailySelection[mealKey] ?? [];
    const exists = currentList.includes(itemId);
    const nextList = exists
      ? currentList.filter((id) => id !== itemId)
      : [...currentList, itemId];

    const nextSelection = {
      ...dailySelection,
      [mealKey]: nextList,
    };

    dispatch(setDailySelectionOptimistic(nextSelection));
    dispatch(syncTodaySelection(nextSelection));
  };

  const handleClearToday = () => {
    dispatch(setDailySelectionOptimistic(EMPTY_DAILY_SELECTION));
    dispatch(syncTodaySelection(EMPTY_DAILY_SELECTION));
  };

  const startEditingSchedule = (mealKey: MealTime) => {
    if (!isEditable) return;
    setEditingScheduleMeal(mealKey);
    setScheduleInput(schedule[mealKey] || "");
  };

  const saveSchedule = (mealKey: MealTime) => {
    const trimmed = scheduleInput.trim();
    if (!trimmed) {
      setEditingScheduleMeal(null);
      return;
    }
    const nextSchedule = {
      ...schedule,
      [mealKey]: trimmed,
    };
    dispatch(updateMealSchedule(nextSchedule));
    setEditingScheduleMeal(null);
  };

  const totalSelectedCount =
    (dailySelection.Завтрак?.length ?? 0) +
    (dailySelection.Обед?.length ?? 0) +
    (dailySelection.Ужин?.length ?? 0);

  return (
    <section className={styles.todayBoard}>
      <div className={styles.todayBoardHeader}>
        <h3 className={styles.todayBoardTitle}>Мой рацион на сегодня</h3>

        {isEditable ? (
          totalSelectedCount > 0 && (
            <button
              type="button"
              onClick={handleClearToday}
              className={styles.clearBtn}>
              Очистить всё
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={() => navigate("/nutrition")}
            className={styles.editPlanBtn}>
            Изменить рацион
          </button>
        )}
      </div>

      <div className={styles.todayGrid}>
        {MEAL_ORDER.map((mealKey) => {
          const mealIds = dailySelection[mealKey] ?? [];
          const mealProducts = mealIds
            .map((id) => items.find((i) => i.id === id))
            .filter(Boolean);

          return (
            <div key={mealKey} className={styles.todayMealBox}>
              <div className={styles.todayMealTop}>
                <span className={styles.todayMealName}>{mealKey}</span>

                {isEditable && editingScheduleMeal === mealKey ? (
                  <div className={styles.scheduleEditBox}>
                    <input
                      type="text"
                      value={scheduleInput}
                      onChange={(e) => setScheduleInput(e.target.value)}
                      className={styles.scheduleInput}
                      placeholder="8.00 – 9.00"
                    />
                    <button
                      type="button"
                      onClick={() => saveSchedule(mealKey)}
                      className={styles.scheduleSaveBtn}>
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingScheduleMeal(null)}
                      className={styles.scheduleCancelBtn}>
                      ✕
                    </button>
                  </div>
                ) : isEditable ? (
                  <button
                    type="button"
                    onClick={() => startEditingSchedule(mealKey)}
                    className={styles.mealScheduleBtn}
                    title="Изменить время приёма пищи">
                    🕒 {schedule[mealKey]}
                  </button>
                ) : (
                  <span className={styles.mealScheduleText}>
                    🕒 {schedule[mealKey]}
                  </span>
                )}
              </div>

              {mealProducts.length === 0 ? (
                <p className={styles.todayEmpty}>Ничего не выбрано</p>
              ) : (
                <ul className={styles.todayList}>
                  {mealProducts.map((prod) =>
                    prod ? (
                      <li key={prod.id} className={styles.todayListItem}>
                        <span>
                          <strong>{prod.title}</strong>
                          {prod.portion ? ` (${prod.portion})` : ""}
                        </span>

                        {isEditable && (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleMealForToday(prod.id, mealKey)
                            }
                            className={styles.removeTagBtn}
                            title="Убрать из приёма пищи">
                            ✕
                          </button>
                        )}
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
