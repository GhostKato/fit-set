import styles from "./WorkoutTimer.module.css";

export type TimerPhase =
  | "idle"
  | "work"
  | "restSet"
  | "restExercise"
  | "manualWorking";

interface WorkoutTimerProps {
  phase: TimerPhase;
  secondsLeft: number;
  totalDuration: number;
  statusHint: string;
}

const PHASE_LABELS: Record<TimerPhase, string> = {
  idle: "Таймер тренировки",
  manualWorking: "Выполнение подхода",
  work: "Выполнение подхода",
  restSet: "Отдых между подходами",
  restExercise: "Отдых между упражнениями",
};

const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const WorkoutTimer = ({
  phase,
  secondsLeft,
  totalDuration,
  statusHint,
}: WorkoutTimerProps) => {
  const isResting = phase === "restSet" || phase === "restExercise";
  const isCounting = phase === "work" || isResting;
  const isWorking = phase === "work" || phase === "manualWorking";
  const isPrepare = isResting && secondsLeft > 0 && secondsLeft <= 10;

  const progressPercent =
    isCounting && totalDuration > 0
      ? Number(
          ((Math.max(0, secondsLeft - 1) / totalDuration) * 100).toFixed(2),
        )
      : isWorking
        ? 100
        : 0;

  return (
    <div
      className={`${styles.container} ${
        isWorking ? styles.containerWork : ""
      } ${isResting && !isPrepare ? styles.containerRest : ""} ${
        isPrepare ? styles.containerPrepare : ""
      }`}>
      <div className={styles.mainRow}>
        <div className={styles.leftSide}>
          <span className={styles.meta}>
            {isPrepare ? "Приготовьтесь" : PHASE_LABELS[phase]}
          </span>
          <div
            className={`${styles.display} ${
              isWorking ? styles.displayWork : ""
            } ${isResting && !isPrepare ? styles.displayRest : ""} ${
              isPrepare ? styles.displayPrepare : ""
            }`}>
            {phase === "manualWorking" ? "В процессе" : formatTime(secondsLeft)}
          </div>
        </div>

        <div className={styles.rightSide}>
          <span className={styles.hintText}>{statusHint}</span>
        </div>
      </div>

      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressFill} ${
            isWorking ? styles.progressFillWork : ""
          } ${isPrepare ? styles.progressFillPrepare : ""}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
