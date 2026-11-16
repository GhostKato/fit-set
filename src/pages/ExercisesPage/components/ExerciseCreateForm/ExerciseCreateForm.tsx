import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { addExercise } from "../../../../redux/exercises/operations";
import { CustomSelect } from "../../../../components/CustomSelect/CustomSelect";
import { StatusToggle } from "../../../../components/StatusToggle/StatusToggle";
import { WEEK_DAYS } from "../../../../utils/exerciseOrder";
import { useLanguage } from "../../../../context/LanguageContext";
import { translateDay } from "../../../../i18n";
import type {
  ExerciseUnit,
  NewExercise,
  WeekDay,
} from "../../../../types/exercise";
import styles from "./ExerciseCreateForm.module.css";

interface ExerciseCreateFormProps {
  onSuccess: () => void;
}

type CreateFormState = Omit<NewExercise, "orders"> & { order: number };

const initialFormState: CreateFormState = {
  days: ["monday"],
  dayTitle: "",
  muscleGroup: "",
  order: 1,
  name: "",
  targetMuscles: "",
  sets: 3,
  target: 12,
  unit: "reps",
  weight: "",
  howToDo: "",
  handsMode: "",
  palmPosition: "",
  breathing: "",
  isActive: true,
};

export const ExerciseCreateForm = ({ onSuccess }: ExerciseCreateFormProps) => {
  const dispatch = useAppDispatch();
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<CreateFormState>(initialFormState);

  const dayOptions = WEEK_DAYS.map((day) => ({
    value: day,
    label: translateDay(day, language),
  }));

  const unitOptions = [
    { value: "reps", label: t.unitReps },
    { value: "sec", label: t.unitSec },
  ];

  const isSubmitDisabled = formData.days.length === 0 || !formData.name.trim();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sets" || name === "target" || name === "order"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const { order, ...rest } = formData;
    const orders: Partial<Record<WeekDay, number>> = {};
    for (const day of formData.days) {
      orders[day] = order;
    }

    await dispatch(addExercise({ ...rest, orders }));

    setFormData((prev) => ({
      ...initialFormState,
      days: prev.days,
      dayTitle: prev.dayTitle,
      order: prev.order + 1,
    }));
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>{t.formNewExerciseTitle}</h3>

      <div className={styles.row}>
        <CustomSelect
          multiple
          values={formData.days}
          options={dayOptions}
          placeholder={t.formSelectDaysPlaceholder}
          onChangeMultiple={(days) =>
            setFormData((prev) => ({ ...prev, days: days as WeekDay[] }))
          }
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
            value={formData.order}
            onChange={handleChange}
            min={1}
            title={t.formOrderTitle}
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

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={styles.submitBtn}>
        {t.createBtn}
      </button>
    </form>
  );
};
