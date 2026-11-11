import { useEffect, useState } from "react";

const REST_OPTIONS = Array.of(60, 120, 180, 240, 300);

export const RestTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning, secondsLeft]);

  const playBeep = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  const startTimer = (seconds: number) => {
    setSecondsLeft(seconds);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      style={{
        padding: "15px",
        border: "1px solid #007bff",
        borderRadius: "8px",
        marginTop: "20px",
        textAlign: "center",
      }}>
      <h4 style={{ margin: "0 0 10px 0" }}>Таймер отдыха</h4>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "12px",
          color: secondsLeft > 0 ? "#007bff" : "#333",
        }}>
        {formatTime(secondsLeft)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}>
        {REST_OPTIONS.map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={() => startTimer(sec)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>
            {sec / 60} мин
          </button>
        ))}

        {secondsLeft > 0 && (
          <>
            <button
              type="button"
              onClick={() => setIsRunning((prev) => !prev)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}>
              {isRunning ? "Пауза" : "Продолжить"}
            </button>
            <button
              type="button"
              onClick={resetTimer}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #dc3545",
                color: "#dc3545",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}>
              Сброс
            </button>
          </>
        )}
      </div>
    </div>
  );
};
