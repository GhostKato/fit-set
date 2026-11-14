import { useEffect, type MouseEvent } from "react";
import type { Exercise } from "../../../../types/exercise";
import styles from "./WorkoutSettingsModal.module.css";

export type WorkoutMode = "manual" | "auto";

export interface WorkoutTimingConfig {
  mode: WorkoutMode;
  setDurations: Record<string, number>;
  restBetweenSets: number;
  restBetweenExercises: number;
}

interface WorkoutSettingsModalProps {
  isOpen: boolean;
  exercises: Exercise[];
  config: WorkoutTimingConfig;
  onChangeConfig: (nextConfig: WorkoutTimingConfig) => void;
  onClose: () => void;
}

export const WorkoutSettingsModal = ({
  isOpen,
  exercises,
  config,
  onChangeConfig,
  onClose,
}: WorkoutSettingsModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isManual = config.mode === "manual";

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleModeChange = (nextMode: WorkoutMode) => {
    onChangeConfig({ ...config, mode: nextMode });
  };

  const handleSetDurationChange = (exerciseId: string, rawValue: string) => {
    const num = Math.max(1, Number(rawValue) || 1);
    onChangeConfig({
      ...config,
      setDurations: {
        ...config.setDurations,
        [exerciseId]: num,
      },
    });
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Режим и таймеры</h3>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeIconBtn}
            aria-label="Закрыть">
            ✕
          </button>
        </div>

        <div className={styles.modeSwitch}>
          <button
            type="button"
            onClick={() => handleModeChange("manual")}
            className={`${styles.modeBtn} ${
              isManual ? styles.modeBtnActive : ""
            }`}>
            Ручная
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("auto")}
            className={`${styles.modeBtn} ${
              !isManual ? styles.modeBtnActive : ""
            }`}>
            Автоматическая
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Время выполнения подхода (сек.)
          </div>

          <div className={styles.exercisesList}>
            {exercises.map((ex, idx) => {
              const isFixedSec = ex.unit === "sec";
              const currentValue = isFixedSec
                ? ex.target
                : (config.setDurations[ex.id] ?? 40);
              const isDisabled = isManual || isFixedSec;

              return (
                <div key={ex.id} className={styles.exerciseRow}>
                  <span className={styles.exerciseLabel}>
                    <strong>№{idx + 1}</strong> {ex.name}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={600}
                    disabled={isDisabled}
                    value={currentValue}
                    onChange={(e) =>
                      handleSetDurationChange(ex.id, e.target.value)
                    }
                    className={styles.timeInput}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Время отдыха (сек.)</div>

          <div className={styles.restRow}>
            <span className={styles.restLabel}>Между подходами</span>
            <input
              type="number"
              min={5}
              max={600}
              value={config.restBetweenSets}
              onChange={(e) =>
                onChangeConfig({
                  ...config,
                  restBetweenSets: Math.max(1, Number(e.target.value) || 1),
                })
              }
              className={styles.timeInput}
            />
          </div>

          <div className={styles.restRow}>
            <span className={styles.restLabel}>Между упражнениями</span>
            <input
              type="number"
              min={5}
              max={900}
              value={config.restBetweenExercises}
              onChange={(e) =>
                onChangeConfig({
                  ...config,
                  restBetweenExercises: Math.max(
                    1,
                    Number(e.target.value) || 1,
                  ),
                })
              }
              className={styles.timeInput}
            />
          </div>
        </div>

        <button type="button" onClick={onClose} className={styles.doneBtn}>
          Готово
        </button>
      </div>
    </div>
  );
};
