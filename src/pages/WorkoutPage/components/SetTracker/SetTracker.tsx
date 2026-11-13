import { useEffect, useRef, useState } from "react";
import type { ExerciseUnit } from "../../../../types/exercise";
import styles from "./SetTracker.module.css";

interface SetTrackerProps {
  setsState: boolean[];
  onToggleSet: (index: number) => void;
  unit?: ExerciseUnit;
  target?: number;
}

const createSetDoneWavDataUrl = (): string => {
  const sampleRate = 22050;
  const duration = 0.45;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  const notes = [
    { start: 0, end: 0.14, freq: 880 },
    { start: 0.18, end: 0.42, freq: 1175 },
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const note of notes) {
      if (t >= note.start && t <= note.end) {
        const localT = t - note.start;
        const noteLen = note.end - note.start;
        const envelope = Math.min(1, localT * 40) * (1 - localT / noteLen);
        sample = Math.sin(2 * Math.PI * note.freq * t) * envelope * 0.85;
        break;
      }
    }

    const intSample = Math.max(-1, Math.min(1, sample)) * 32767;
    view.setInt16(44 + i * 2, intSample, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
};

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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const dataUrl = createSetDoneWavDataUrl();
    const audio = new Audio(dataUrl);
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  if (prevConfig.target !== target || prevConfig.unit !== unit) {
    setPrevConfig({ target, unit });
    setIsRunning(false);
    setSecondsLeft(target);
  }

  if (isAllCompleted && (isRunning || secondsLeft !== target)) {
    setIsRunning(false);
    setSecondsLeft(target);
  }

  const unlockAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 1;
        })
        .catch(() => {
          audio.volume = 1;
        });
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
  };

  const playFallbackWebAudio = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

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

  const playSetDoneBeep = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.currentTime = 0;
      audio.play().catch(() => {
        playFallbackWebAudio();
      });
    } else {
      playFallbackWebAudio();
    }
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

  const handleToggleTimer = () => {
    if (!isRunning) {
      unlockAudio();
    }
    setIsRunning((prev) => !prev);
  };

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
                onClick={handleToggleTimer}
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
    </div>
  );
};
