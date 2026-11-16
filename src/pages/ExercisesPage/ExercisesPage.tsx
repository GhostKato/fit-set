import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  removeAllExercises,
  seedDefaultExercises,
} from "../../redux/exercises/operations";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { ExerciseCreateForm } from "./components/ExerciseCreateForm/ExerciseCreateForm";
import { getOrderForContext } from "../../utils/exerciseOrder";
import { useLanguage } from "../../context/LanguageContext";
import { translateDay } from "../../i18n";
import styles from "./ExercisesPage.module.css";

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const ALL_TAB = "Все";
const INACTIVE_TAB = "Неактивные";

export const ExercisesPage = () => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.exercises,
  );

  const [selectedDay, setSelectedDay] = useState<string>(ALL_TAB);
  const [activeForm, setActiveForm] = useState<"create" | string | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const isFormOpen = activeForm === "create";

  const handleToggleCreateForm = () => {
    setActiveForm((prev) => (prev === "create" ? null : "create"));
  };

  const handleConfirmDeleteAll = () => {
    setIsDeleteAllOpen(false);
    setActiveForm(null);
    dispatch(removeAllExercises());
  };

  const getTabLabel = (tab: string) => {
    if (tab === ALL_TAB) return t.filterAll;
    if (tab === INACTIVE_TAB) return t.filterInactive;
    return translateDay(tab, language);
  };

  const filteredExercises = items
    .filter((item) => {
      if (selectedDay === INACTIVE_TAB) return !item.isActive;
      if (!item.isActive) return false;
      return selectedDay === ALL_TAB ? true : item.days.includes(selectedDay);
    })
    .sort(
      (a, b) =>
        getOrderForContext(a.orders, a.days, selectedDay) -
        getOrderForContext(b.orders, b.days, selectedDay),
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t.exercisesTitle}</h2>

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
        <ExerciseCreateForm onSuccess={() => setActiveForm(null)} />
      )}

      <div className={styles.filters}>
        {[ALL_TAB, ...ALL_DAYS, INACTIVE_TAB].map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`${styles.filterBtn} ${
              selectedDay === day ? styles.filterBtnActive : ""
            }`}>
            {getTabLabel(day)}
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
          <p>{t.exercisesEmptyText}</p>
          <button
            type="button"
            onClick={() => dispatch(seedDefaultExercises())}
            className={styles.seedBtn}>
            {t.exercisesSeedBtn}
          </button>
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className={styles.emptyState}>
          {selectedDay === INACTIVE_TAB
            ? t.exercisesEmptyInactive
            : `${t.exercisesEmptyForDayPrefix}${getTabLabel(selectedDay)}${t.exercisesEmptyForDaySuffix}`}
        </div>
      ) : (
        filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            activeDay={selectedDay}
            isEditing={activeForm === exercise.id}
            onStartEdit={() => setActiveForm(exercise.id)}
            onCancelEdit={() => setActiveForm(null)}
          />
        ))
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
