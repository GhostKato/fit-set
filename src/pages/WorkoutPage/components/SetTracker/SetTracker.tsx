import { useEffect, useState } from "react";
import type { ExerciseUnit } from "../../../../types/exercise";
import styles from "./SetTracker.module.css";

interface SetTrackerProps {
  setsState: boolean[];
  onToggleSet: (index: number) => void;
  unit?: ExerciseUnit;
  target?: number;
}

export const SetTracker = ({
  setsState,
  onToggleSet,
  unit = "reps",
  target = 0,
}: SetTrackerProps) => {
  const completedCount = setsState.filter(Boolean).length;
  const isAllCompleted =
    setsState.length > 0 && completedCount === setsState.length;
  const isTimed = unit === "sec" && target > 0;

  const [secondsLeft, setSecondsLeft] = useState(target);
  const [isRunning, setIsRunning] = useState(false);
  const [prevConfig, setPrevConfig] = useState({ target, unit });

  if (prevConfig.target !== target || prevConfig.unit !== unit) {
    setPrevConfig({ target, unit });
    setIsRunning(false);
    setSecondsLeft(target);
  }

  if (isAllCompleted && (isRunning || secondsLeft !== target)) {
    setIsRunning(false);
    setSecondsLeft(target);
  }

  const playSetDoneBeep = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1046, now);
    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  };

  useEffect(() => {
    if (!isTimed || !isRunning || isAllCompleted) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playSetDoneBeep();

          const nextUnfinishedIndex = setsState.findIndex((done) => !done);
          if (nextUnfinishedIndex !== -1) {
            onToggleSet(nextUnfinishedIndex);
          }

          return target;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimed, isRunning, isAllCompleted, setsState, onToggleSet, target]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const canReset = !isAllCompleted && (isRunning || secondsLeft !== target);

  return (
    <div
      className={`${styles.container} ${
        isAllCompleted ? styles.containerDone : ""
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

      <div
        className={`${styles.contentRow} ${
          isTimed ? styles.contentRowTimed : ""
        }`}>
        {isTimed && (
          <div
            className={`${styles.timerBox} ${
              isRunning ? styles.timerBoxActive : ""
            }`}>
            <div className={styles.timerInfo}>
              <span className={styles.timerLabel}>Таймер подхода</span>
              <span
                className={`${styles.timerDigits} ${
                  isRunning ? styles.timerDigitsActive : ""
                }`}>
                {formatTime(secondsLeft)}
              </span>
            </div>

            <div className={styles.timerActions}>
              <button
                type="button"
                disabled={isAllCompleted}
                onClick={() => setIsRunning((prev) => !prev)}
                className={styles.timerStartBtn}>
                {isRunning ? "Пауза" : "Старт подхода"}
              </button>
              <button
                type="button"
                disabled={!canReset}
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(target);
                }}
                className={styles.timerResetBtn}>
                Сброс
              </button>
            </div>
          </div>
        )}

        <div className={`${styles.grid} ${isTimed ? styles.gridRight : ""}`}>
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
    </div>
  );
};
