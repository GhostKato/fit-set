import styles from "./SetTracker.module.css";

interface SetTrackerProps {
  setsState: boolean[];
  onToggleSet: (index: number) => void;
  disabled?: boolean;
  activeSetIndex?: number | null;
  isActive?: boolean;
}

export const SetTracker = ({
  setsState,
  onToggleSet,
  disabled = false,
  activeSetIndex = null,
  isActive = false,
}: SetTrackerProps) => {
  const completedCount = setsState.filter(Boolean).length;
  const isAllCompleted =
    setsState.length > 0 && completedCount === setsState.length;

  return (
    <div
      className={`${styles.container} ${
        isAllCompleted || isActive ? styles.containerActive : ""
      }`}>
      <div className={styles.header}>
        <span className={styles.meta}>Трекинг подходов</span>

        <span
          className={`${styles.counter} ${
            isAllCompleted ? styles.counterDone : ""
          }`}>
          {isAllCompleted
            ? `✓ Выполнено (${completedCount} из ${setsState.length})`
            : `${completedCount} из ${setsState.length}`}
        </span>
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
              <span>Подход {idx + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
