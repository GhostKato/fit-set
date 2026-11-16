import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { editExercise } from "../../../../redux/exercises/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import { StatusToggle } from "../../../../components/StatusToggle/StatusToggle";
import {
  areAllOrdersEqual,
  getOrderForContext,
  isSpecificWeekDay,
} from "../../../../utils/exerciseOrder";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateDay } from "../../../../i18n";
import type {
  Exercise,
  ExerciseUnit,
  NewExercise,
} from "../../../../types/exercise";
import styles from "./ExerciseEditForm.module.css";

interface ExerciseEditFormProps {
  exercise: Exercise;
  activeDay?: string;
  onCancel: () => void;
}

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const ExerciseEditForm = ({
  exercise,
  activeDay,
  onCancel,
}: ExerciseEditFormProps) => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();

  const dayOptions = ALL_DAYS.map((day) => ({
    value: day,
    label: translateDay(day, language),
  }));

  const unitOptions = [
    { value: "reps", label: t.unitReps },
    { value: "sec", label: t.unitSec },
  ];

  const [currentOrder, setCurrentOrder] = useState<number>(() =>
    getOrderForContext(exercise.orders, exercise.days, activeDay),
  );

  const [formData, setFormData] = useState<NewExercise>({
    days: exercise.days,
    dayTitle: exercise.dayTitle,
    muscleGroup: exercise.muscleGroup,
    orders: exercise.orders,
    name: exercise.name,
    targetMuscles: exercise.targetMuscles,
    sets: exercise.sets,
    target: exercise.target,
    unit: exercise.unit || "reps",
    weight: exercise.weight,
    howToDo: exercise.howToDo,
    handsMode: exercise.handsMode,
    palmPosition: exercise.palmPosition,
    breathing: exercise.breathing,
    isActive: exercise.isActive,
  });

  const isSaveDisabled = formData.days.length === 0 || !formData.name.trim();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "order") {
      setCurrentOrder(Number(value));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "sets" || name === "target" ? Number(value) : value,
    }));
  };

  const handleDaysChange = (nextDays: string[]) => {
    setFormData((prev) => {
      const updatedOrders: Record<string, number> = {};
      for (const day of nextDays) {
        updatedOrders[day] = prev.orders[day] ?? currentOrder;
      }
      return {
        ...prev,
        days: nextDays,
        orders: updatedOrders,
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaveDisabled) return;

    const updatedOrders: Record<string, number> = {};
    for (const day of formData.days) {
      updatedOrders[day] = formData.orders[day] ?? currentOrder;
    }

    if (isSpecificWeekDay(activeDay) && formData.days.includes(activeDay)) {
      updatedOrders[activeDay] = currentOrder;
    } else if (areAllOrdersEqual(exercise.orders, exercise.days)) {
      for (const day of formData.days) {
        updatedOrders[day] = currentOrder;
      }
    } else if (formData.days.length > 0) {
      updatedOrders[formData.days[0]] = currentOrder;
    }

    await dispatch(
      editExercise({
        id: exercise.id,
        fields: { ...formData, orders: updatedOrders },
      }),
    );
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.cardEditing}>
      <h4 className={styles.editTitle}>{t.formEditExerciseTitle}</h4>

      <div className={styles.editGrid}>
        <div className={styles.row}>
          <CustomSelect
            multiple
            values={formData.days}
            options={dayOptions}
            placeholder={t.formSelectDaysPlaceholder}
            onChangeMultiple={handleDaysChange}
          />

          <input
            name="dayTitle"
            value={formData.dayTitle}
            onChange={handleChange}
            placeholder={t.formDayTitlePlaceholder}
            className={`${styles.input} ${styles.flex1}`}
          />

          <input
            name="muscleGroup"
            value={formData.muscleGroup}
            onChange={handleChange}
            placeholder={t.formMuscleGroupPlaceholder}
            className={`${styles.input} ${styles.flex1}`}
          />

          <StatusToggle
            checked={formData.isActive}
            onChange={(nextValue) =>
              setFormData((prev) => ({ ...prev, isActive: nextValue }))
            }
            size="md"
            label={t.formStatusLabel}
            labelPosition="left"
          />
        </div>

        <div className={styles.row}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.formExerciseNamePlaceholder}
            required
            className={`${styles.input} ${styles.flex2}`}
          />

          <label className={styles.numberGroup}>
            <span>№:</span>
            <input
              type="number"
              name="order"
              value={currentOrder}
              onChange={handleChange}
              min={1}
              title={
                isSpecificWeekDay(activeDay)
                  ? `${t.formOrderTitle} (${translateDay(activeDay, language)})`
                  : t.formOrderTitle
              }
              className={`${styles.input} ${styles.numberInput}`}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.numberGroup}>
            <span>{t.formSetsLabel}</span>
            <input
              type="number"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              min={1}
              className={`${styles.input} ${styles.numberInput}`}
            />
          </label>

          <label className={styles.numberGroup}>
            <span className={styles.targetLabel}>
              {formData.unit === "sec" ? t.formSecondsLabel : t.formRepsLabel}
            </span>
            <input
              type="number"
              name="target"
              value={formData.target}
              onChange={handleChange}
              min={1}
              className={`${styles.input} ${styles.numberInput}`}
            />
          </label>

          <CustomSelect
            value={formData.unit}
            options={unitOptions}
            title={t.formUnitTitle}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, unit: val as ExerciseUnit }))
            }
          />

          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder={t.formWeightPlaceholder}
            className={`${styles.input} ${styles.flex1}`}
          />
        </div>

        <input
          name="targetMuscles"
          value={formData.targetMuscles}
          onChange={handleChange}
          placeholder={t.formTargetMusclesPlaceholder}
          className={styles.input}
        />

        <textarea
          name="howToDo"
          value={formData.howToDo}
          onChange={handleChange}
          placeholder={t.formHowToDoPlaceholder}
          rows={2}
          className={styles.textarea}
        />

        <input
          name="handsMode"
          value={formData.handsMode}
          onChange={handleChange}
          placeholder={t.formHandsModePlaceholder}
          className={styles.input}
        />

        <input
          name="palmPosition"
          value={formData.palmPosition}
          onChange={handleChange}
          placeholder={t.formPalmPositionPlaceholder}
          className={styles.input}
        />

        <input
          name="breathing"
          value={formData.breathing}
          onChange={handleChange}
          placeholder={t.formBreathingPlaceholder}
          className={styles.input}
        />
      </div>

      <div className={styles.editActions}>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>
          {t.cancelBtn}
        </button>
        <button
          type="submit"
          disabled={isSaveDisabled}
          className={styles.saveBtn}>
          {t.saveBtn}
        </button>
      </div>
    </form>
  );
};
