import { useEffect, useState } from "react";
import styles from "./RestTimer.module.css";

const REST_OPTIONS = Array.of(60, 120, 180, 240, 300);

export const RestTimer = () => {
  const [totalDuration, setTotalDuration] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const playBeep = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const beeps = [
      { start: 0, duration: 0.15, freq: 880 },
      { start: 0.22, duration: 0.15, freq: 880 },
      { start: 0.44, duration: 0.35, freq: 1175 },
    ];

    beeps.forEach(({ start, duration, freq }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(1.0, now + start);
      gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  };

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setTotalDuration(0);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning, secondsLeft]);

  const startTimer = (seconds: number) => {
    setTotalDuration(seconds);
    setSecondsLeft(seconds);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(0);
    setTotalDuration(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const isActive = secondsLeft > 0;
  const progressPercent =
    isActive && totalDuration > 0
      ? Math.round((secondsLeft / totalDuration) * 100)
      : 0;

  return (
    <div
      className={`${styles.container} ${
        isActive ? styles.containerActive : ""
      }`}>
      <div className={styles.mainRow}>
        <div className={styles.leftSide}>
          <span className={styles.meta}>Таймер отдыха</span>
          <div
            className={`${styles.display} ${
              isActive ? styles.displayActive : ""
            }`}>
            {formatTime(secondsLeft)}
          </div>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.presetsGrid}>
            {REST_OPTIONS.map((sec) => {
              const isSelectedPreset = isActive && totalDuration === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => startTimer(sec)}
                  className={`${styles.presetBtn} ${
                    isSelectedPreset ? styles.presetBtnActive : ""
                  }`}>
                  {sec / 60} мин
                </button>
              );
            })}
          </div>

          <div className={styles.controlsRow}>
            <button
              type="button"
              disabled={!isActive}
              onClick={() => setIsRunning((prev) => !prev)}
              className={styles.pauseBtn}>
              {isRunning ? "Пауза" : isActive ? "Продолжить" : "Пауза"}
            </button>
            <button
              type="button"
              disabled={!isActive}
              onClick={resetTimer}
              className={styles.resetBtn}>
              Сброс
            </button>
          </div>
        </div>
      </div>

      {isActive && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
