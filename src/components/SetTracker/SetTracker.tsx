import styles from "./SetTracker.module.css";

interface SetTrackerProps {
  setsState: boolean[];
  onToggleSet: (index: number) => void;
}

export const SetTracker = ({ setsState, onToggleSet }: SetTrackerProps) => {
  const completedCount = setsState.filter(Boolean).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.heading}>Отметьте выполненные подходы:</h4>
        <span className={styles.counter}>
          {completedCount} из {setsState.length}
        </span>
      </div>

      <div className={styles.grid}>
        {setsState.map((isDone, idx) => (
          <label
            key={idx}
            className={`${styles.setLabel} ${
              isDone ? styles.setLabelDone : ""
            }`}>
            <input
              type="checkbox"
              checked={isDone}
              onChange={() => onToggleSet(idx)}
              className={styles.checkbox}
            />
            <span>Подход {idx + 1}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
