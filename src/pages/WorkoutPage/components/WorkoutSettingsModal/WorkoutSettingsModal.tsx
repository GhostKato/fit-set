import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
  const [draft, setDraft] = useState<WorkoutTimingConfig>(config);

  useEffect(() => {
    if (isOpen) {
      setDraft(config);
    }
  }, [isOpen, config]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAuto = draft.mode === "auto";

  const handleSetDurationChange = (exerciseId: string, rawValue: string) => {
    const parsed = Math.max(5, Number(rawValue) || 0);
    setDraft((prev) => ({
      ...prev,
      setDurations: {
        ...prev.setDurations,
        [exerciseId]: parsed,
      },
    }));
  };

  const handleSave = () => {
    onChangeConfig(draft);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-settings-title">
        <div className={styles.header}>
          <h3 id="workout-settings-title" className={styles.title}>
            Режим и таймеры
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeIconBtn}
            aria-label="Закрыть">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className={styles.modeSwitch}>
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, mode: "manual" }))}
            className={`${styles.modeBtn} ${
              draft.mode === "manual" ? styles.modeBtnActive : ""
            }`}>
            Ручная
          </button>
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, mode: "auto" }))}
            className={`${styles.modeBtn} ${
              draft.mode === "auto" ? styles.modeBtnActive : ""
            }`}>
            Автоматическая
          </button>
        </div>

        <div className={styles.body}>
          {isAuto && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                ВРЕМЯ ВЫПОЛНЕНИЯ ПОДХОДА (СЕК.)
              </div>

              <div className={styles.exercisesList}>
                {exercises.map((ex, idx) => {
                  const isFixedSec = ex.unit === "sec";
                  const currentVal = isFixedSec
                    ? ex.target
                    : (draft.setDurations[ex.id] ?? 40);

                  return (
                    <div key={ex.id} className={styles.exerciseRow}>
                      <span className={styles.exerciseName}>
                        №{idx + 1} {ex.name}
                      </span>

                      {isFixedSec ? (
                        <span className={styles.fixedBadge}>
                          {ex.target} сек. (по плану)
                        </span>
                      ) : (
                        <input
                          type="number"
                          min={5}
                          max={600}
                          value={currentVal}
                          onChange={(e) =>
                            handleSetDurationChange(ex.id, e.target.value)
                          }
                          className={styles.numberInput}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionLabel}>ОТДЫХ (СЕК.)</div>

            <div className={styles.restGrid}>
              <label className={styles.restField}>
                <span className={styles.restLabel}>Между подходами</span>
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={draft.restBetweenSets}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      restBetweenSets: Math.max(5, Number(e.target.value) || 0),
                    }))
                  }
                  className={styles.numberInput}
                />
              </label>

              <label className={styles.restField}>
                <span className={styles.restLabel}>Между упражнениями</span>
                <input
                  type="number"
                  min={5}
                  max={900}
                  value={draft.restBetweenExercises}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      restBetweenExercises: Math.max(
                        5,
                        Number(e.target.value) || 0,
                      ),
                    }))
                  }
                  className={styles.numberInput}
                />
              </label>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Отмена
          </button>
          <button type="button" onClick={handleSave} className={styles.saveBtn}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
