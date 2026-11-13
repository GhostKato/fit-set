import { useEffect, useRef, useState } from "react";
import styles from "./RestTimer.module.css";

const REST_OPTIONS = Array.of(60, 120, 180, 240, 300);

const createBeepWavUrl = (): string => {
  const sampleRate = 22050;
  const duration = 0.85;
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
    { start: 0, end: 0.15, freq: 880 },
    { start: 0.22, end: 0.37, freq: 880 },
    { start: 0.44, end: 0.8, freq: 1175 },
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

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
};

export const RestTimer = () => {
  const [totalDuration, setTotalDuration] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const url = createBeepWavUrl();
    audioUrlRef.current = url;

    const audio = new Audio(url);
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      URL.revokeObjectURL(url);
    };
  }, []);

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

  const playBeep = () => {
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
    unlockAudio();
    setTotalDuration(seconds);
    setSecondsLeft(seconds);
    setIsRunning(true);
  };

  const handleTogglePause = () => {
    if (!isRunning) {
      unlockAudio();
    }
    setIsRunning((prev) => !prev);
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
  const targetSeconds = isRunning ? Math.max(0, secondsLeft - 1) : secondsLeft;
  const progressPercent =
    isActive && totalDuration > 0
      ? Number(((targetSeconds / totalDuration) * 100).toFixed(2))
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
              onClick={handleTogglePause}
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

      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressFill} ${
            !isRunning ? styles.progressFillPaused : ""
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
