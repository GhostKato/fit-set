import { useLanguage } from "../../../../context/LanguageContext";
import styles from "./SetTracker.module.css";

interface SetTrackerProps {
  setsState: boolean[];
  onToggleSet: (index: number) => void;
  onResetSets?: () => void;
  disabled?: boolean;
  activeSetIndex?: number | null;
  isActive?: boolean;
}

export const SetTracker = ({
  setsState,
  onToggleSet,
  onResetSets,
  disabled = false,
  activeSetIndex = null,
  isActive = false,
}: SetTrackerProps) => {
  const { t } = useLanguage();
  const completedCount = setsState.filter(Boolean).length;
  const isAllCompleted =
    setsState.length > 0 && completedCount === setsState.length;
  const isResetDisabled = disabled || completedCount === 0;

  const handleReset = () => {
    if (isResetDisabled) return;

    if (onResetSets) {
      onResetSets();
      return;
    }

    setsState.forEach((isDone, idx) => {
      if (isDone) {
        onToggleSet(idx);
      }
    });
  };

  return (
    <div
      className={`${styles.container} ${
        isAllCompleted || isActive ? styles.containerActive : ""
      }`}>
      <div className={styles.header}>
        <span className={styles.meta}>{t.setsTrackingLabel}</span>

        <div className={styles.rightControls}>
          <span
            className={`${styles.counter} ${
              isAllCompleted ? styles.counterDone : ""
            }`}>
            {isAllCompleted
              ? `✓ ${t.setsDoneLabel} (${completedCount} ${t.workoutOf} ${setsState.length})`
              : `${completedCount} ${t.workoutOf} ${setsState.length}`}
          </span>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
            disabled={isResetDisabled}
            title={t.setsResetTitle}>
            {t.workoutResetBtn}
          </button>
        </div>
      </div>

      <div className={styles.pillsGrid}>
        {setsState.map((isDone, idx) => {
          const isCurrent = activeSetIndex === idx && !isDone;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onToggleSet(idx)}
              className={`${styles.setPill} ${
                isDone ? styles.setPillDone : ""
              } ${isCurrent ? styles.setPillActive : ""}`}>
              <span>
                {t.setPillLabel} {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
