import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import { SetTracker } from "./components/SetTracker/SetTracker";
import {
  WorkoutTimer,
  type TimerPhase,
} from "./components/WorkoutTimer/WorkoutTimer";
import {
  WorkoutSettingsModal,
  type WorkoutTimingConfig,
} from "./components/WorkoutSettingsModal/WorkoutSettingsModal";
import { playWorkoutSignal } from "../../utils/workoutSound";
import styles from "./WorkoutPage.module.css";

const DAYS_BY_INDEX = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const formatDayAccusative = (day: string): string => {
  const lower = day.toLowerCase();
  const map: Record<string, string> = {
    среда: "среду",
    пятница: "пятницу",
    суббота: "субботу",
  };
  return map[lower] || lower;
};

interface SavedWorkoutProgress {
  currentIndex: number;
  completedSets: Record<string, boolean[]>;
}

const getStorageKey = (day: string) => `fitset_workout_progress_${day}`;
const getConfigKey = (day: string) => `fitset_workout_config_${day}`;

const DEFAULT_TIMING_CONFIG: WorkoutTimingConfig = {
  mode: "manual",
  setDurations: {},
  restBetweenSets: 120,
  restBetweenExercises: 240,
};

const loadSavedProgress = (day: string): SavedWorkoutProgress => {
  try {
    const raw = localStorage.getItem(getStorageKey(day));
    if (!raw) return { currentIndex: 0, completedSets: {} };
    const parsed = JSON.parse(raw) as SavedWorkoutProgress;
    return {
      currentIndex:
        typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0,
      completedSets:
        parsed.completedSets && typeof parsed.completedSets === "object"
          ? parsed.completedSets
          : {},
    };
  } catch {
    return { currentIndex: 0, completedSets: {} };
  }
};

const loadTimingConfig = (day: string): WorkoutTimingConfig => {
  try {
    const raw = localStorage.getItem(getConfigKey(day));
    if (!raw) return DEFAULT_TIMING_CONFIG;
    return { ...DEFAULT_TIMING_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_TIMING_CONFIG;
  }
};

export const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const todayName = DAYS_BY_INDEX[new Date().getDay()];
  const selectedDay = searchParams.get("day") || todayName;
  const storageKey = getStorageKey(selectedDay);
  const configKey = getConfigKey(selectedDay);

  const allExercises = useAppSelector((state) => state.exercises.items);

  const dayExercises = useMemo(() => {
    return allExercises
      .filter((item) => item.isActive && item.day === selectedDay)
      .sort((a, b) => a.order - b.order);
  }, [allExercises, selectedDay]);

  const customDayTitle = useMemo(() => {
    return dayExercises.find((item) => item.dayTitle?.trim())?.dayTitle?.trim();
  }, [dayExercises]);

  const [currentIndex, setCurrentIndex] = useState<number>(
    () => loadSavedProgress(selectedDay).currentIndex,
  );
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>(
    () => loadSavedProgress(selectedDay).completedSets,
  );
  const [timingConfig, setTimingConfig] = useState<WorkoutTimingConfig>(() =>
    loadTimingConfig(selectedDay),
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [loadedDay, setLoadedDay] = useState<string>(selectedDay);

  if (loadedDay !== selectedDay) {
    const restored = loadSavedProgress(selectedDay);
    setLoadedDay(selectedDay);
    setCurrentIndex(restored.currentIndex);
    setCompletedSets(restored.completedSets);
    setTimingConfig(loadTimingConfig(selectedDay));
    setPhase("idle");
    setSecondsLeft(0);
    setIsAutoRunning(false);
  }
  useEffect(() => {
    try {
      const payload: SavedWorkoutProgress = { currentIndex, completedSets };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Игнорируем ошибку доступа к localStorage
    }
  }, [storageKey, currentIndex, completedSets]);

  const handleSaveConfig = (nextConfig: WorkoutTimingConfig) => {
    setTimingConfig(nextConfig);
    setIsAutoRunning(false);
    setPhase("idle");
    setSecondsLeft(0);
    try {
      localStorage.setItem(configKey, JSON.stringify(nextConfig));
    } catch {
      // Игнорируем ошибку доступа к localStorage
    }
  };

  const completedExercisesCount = useMemo(() => {
    return dayExercises.filter((ex) => {
      const setsArr = completedSets[ex.id] || [];
      return ex.sets > 0 && setsArr.filter(Boolean).length === ex.sets;
    }).length;
  }, [dayExercises, completedSets]);

  const progressPercent = useMemo(() => {
    const totalSets = dayExercises.reduce((sum, ex) => sum + ex.sets, 0);
    if (totalSets === 0) return 0;
    const doneSets = dayExercises.reduce((sum, ex) => {
      const setsArr = completedSets[ex.id] || [];
      return sum + setsArr.filter(Boolean).length;
    }, 0);
    return Math.round((doneSets / totalSets) * 100);
  }, [dayExercises, completedSets]);

  const safeIndex = Math.min(
    currentIndex,
    Math.max(0, dayExercises.length - 1),
  );
  const currentExercise = dayExercises[safeIndex];

  const getWorkDuration = useCallback(
    (exIndex: number) => {
      const ex = dayExercises[exIndex];
      if (!ex) return 40;
      return ex.unit === "sec"
        ? ex.target
        : (timingConfig.setDurations[ex.id] ?? 40);
    },
    [dayExercises, timingConfig.setDurations],
  );

  const handleTimerTickComplete = useCallback(() => {
    if (!currentExercise) return;

    if (phase === "work") {
      playWorkoutSignal("setDone");
      const currentSets =
        completedSets[currentExercise.id] ||
        Array(currentExercise.sets).fill(false);
      const nextSetIdx = currentSets.findIndex((done) => !done);
      const updated = [...currentSets];
      if (nextSetIdx !== -1) updated[nextSetIdx] = true;

      setCompletedSets((prev) => ({ ...prev, [currentExercise.id]: updated }));

      const allDoneNow = updated.every(Boolean);
      const isLastEx = safeIndex >= dayExercises.length - 1;

      if (allDoneNow && isLastEx) {
        setIsAutoRunning(false);
        setPhase("idle");
        setSecondsLeft(0);
        return;
      }

      if (allDoneNow) {
        setCurrentIndex(safeIndex + 1);
      }

      const restSec = allDoneNow
        ? timingConfig.restBetweenExercises
        : timingConfig.restBetweenSets;
      setPhase(allDoneNow ? "restExercise" : "restSet");
      setTotalDuration(restSec);
      setSecondsLeft(restSec);
      return;
    }

    if (phase === "restSet" || phase === "restExercise") {
      playWorkoutSignal("restDone");
      if (timingConfig.mode === "auto" && isAutoRunning) {
        const workSec = getWorkDuration(safeIndex);
        setPhase("work");
        setTotalDuration(workSec);
        setSecondsLeft(workSec);
      } else {
        setPhase("idle");
        setSecondsLeft(0);
      }
    }
  }, [
    currentExercise,
    phase,
    completedSets,
    safeIndex,
    dayExercises.length,
    timingConfig,
    isAutoRunning,
    getWorkDuration,
  ]);

  useEffect(() => {
    const isCounting =
      phase === "work" || phase === "restSet" || phase === "restExercise";
    if (!isCounting || secondsLeft <= 0) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.setTimeout(handleTimerTickComplete, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [phase, secondsLeft, handleTimerTickComplete]);
  const handleManualAction = () => {
    if (!currentExercise) return;

    if (phase !== "manualWorking") {
      setPhase("manualWorking");
      setSecondsLeft(0);
      return;
    }

    playWorkoutSignal("setDone");
    const currentSets =
      completedSets[currentExercise.id] ||
      Array(currentExercise.sets).fill(false);
    const nextSetIdx = currentSets.findIndex((done) => !done);
    const updated = [...currentSets];
    if (nextSetIdx !== -1) updated[nextSetIdx] = true;

    setCompletedSets((prev) => ({ ...prev, [currentExercise.id]: updated }));

    const allDoneNow = updated.every(Boolean);
    const isLastEx = safeIndex >= dayExercises.length - 1;

    if (allDoneNow && isLastEx) {
      setPhase("idle");
      setSecondsLeft(0);
      return;
    }

    if (allDoneNow) {
      setCurrentIndex(safeIndex + 1);
    }

    const restSec = allDoneNow
      ? timingConfig.restBetweenExercises
      : timingConfig.restBetweenSets;
    setPhase(allDoneNow ? "restExercise" : "restSet");
    setTotalDuration(restSec);
    setSecondsLeft(restSec);
  };

  const handleAutoToggle = () => {
    if (isAutoRunning) {
      setIsAutoRunning(false);
      setPhase("idle");
      setSecondsLeft(0);
      return;
    }

    const firstUnfinishedEx = dayExercises.findIndex((ex) => {
      const sets = completedSets[ex.id] || [];
      return sets.filter(Boolean).length < ex.sets;
    });
    const targetExIdx =
      firstUnfinishedEx !== -1 ? firstUnfinishedEx : safeIndex;
    setCurrentIndex(targetExIdx);

    const workSec = getWorkDuration(targetExIdx);
    setIsAutoRunning(true);
    setPhase("work");
    setTotalDuration(workSec);
    setSecondsLeft(workSec);
  };

  const handleSelectExercise = (idx: number) => {
    setIsAutoRunning(false);
    setPhase("idle");
    setSecondsLeft(0);
    setCurrentIndex(idx);
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Игнорируем ошибку доступа к localStorage
    }
    setIsAutoRunning(false);
    setPhase("idle");
    setSecondsLeft(0);
    setCurrentIndex(0);
    setCompletedSets({});
  };

  if (dayExercises.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Тренировка • {selectedDay}</h2>
        </div>

        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            На <strong>{formatDayAccusative(selectedDay)}</strong> активных
            упражнений пока нет. Добавьте или активируйте их в своей программе,
            чтобы начать тренировку.
          </p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className={styles.primaryBtn}>
            Перейти к упражнениям
          </button>
        </div>
      </div>
    );
  }

  const currentSetsState =
    completedSets[currentExercise.id] ||
    Array(currentExercise.sets).fill(false);

  const toggleSet = (setIndex: number) => {
    const updated = [...currentSetsState];
    const isClickingDoneSet = updated[setIndex];

    if (!isClickingDoneSet) {
      const firstUnfinishedIdx = updated.findIndex((done) => !done);
      if (firstUnfinishedIdx !== -1) {
        updated[firstUnfinishedIdx] = true;
      }
    } else {
      const lastDoneIdx = updated.lastIndexOf(true);
      if (lastDoneIdx !== -1) {
        updated[lastDoneIdx] = false;
      }
    }

    setCompletedSets((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));
  };

  const activeSetIndex = currentSetsState.findIndex((done) => !done);
  const isManualMode = timingConfig.mode === "manual";
  const isManualResting =
    isManualMode && (phase === "restSet" || phase === "restExercise");
  const isWorkoutCompleted =
    dayExercises.length > 0 && completedExercisesCount === dayExercises.length;
  const hasAnyProgress =
    safeIndex > 0 ||
    phase !== "idle" ||
    Object.values(completedSets).some((sets) => sets.some(Boolean));

  const statusHint = isWorkoutCompleted
    ? "Тренировка выполнена! Нажмите «Закончить тренировку»"
    : phase === "manualWorking"
      ? "Выполняйте подход и нажмите «Закончить подход»"
      : phase === "work"
        ? `Идёт подход ${activeSetIndex !== -1 ? activeSetIndex + 1 : currentExercise.sets} из ${currentExercise.sets}`
        : phase === "restSet"
          ? isManualMode
            ? "Идёт отдых — новый подход станет доступен после таймера"
            : "Восстановите дыхание перед следующим подходом"
          : phase === "restExercise"
            ? "Отдых перед стартом следующего упражнения — изучите технику"
            : isManualMode
              ? "Нажмите «Начать подход» внизу экрана"
              : "Нажмите «Начать тренировку» для автозапуска";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {selectedDay}
          {customDayTitle ? ` • ${customDayTitle}` : ""}
        </h2>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={styles.modeSelectBtn}>
            {isManualMode ? "Ручная" : "Автоматическая"}
          </button>

          <button
            type="button"
            disabled={!hasAnyProgress}
            onClick={handleResetProgress}
            className={styles.resetTopBtn}>
            Сбросить
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        {dayExercises.map((ex, idx) => {
          const exSets = completedSets[ex.id] || [];
          const isExDone =
            ex.sets > 0 && exSets.filter(Boolean).length === ex.sets;

          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => handleSelectExercise(idx)}
              className={`${styles.filterBtn} ${
                idx === safeIndex ? styles.filterBtnActive : ""
              } ${isExDone && idx !== safeIndex ? styles.filterBtnDone : ""}`}>
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <span className={styles.progressLabel}>
            Выполнено: {completedExercisesCount} из {dayExercises.length}
          </span>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>

        <div className={styles.segmentsTrack}>
          {dayExercises.map((ex) => {
            const exSets = completedSets[ex.id] || [];
            const doneCount = exSets.filter(Boolean).length;
            const segmentFillPercent =
              ex.sets > 0 ? Math.min(100, (doneCount / ex.sets) * 100) : 0;

            return (
              <div key={ex.id} className={styles.segment}>
                <div
                  className={styles.segmentFill}
                  style={{ width: `${segmentFillPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <ExerciseCard exercise={currentExercise} showActions={false} />

      <SetTracker
        setsState={currentSetsState}
        onToggleSet={toggleSet}
        disabled={!isManualMode && isAutoRunning}
        isActive={
          phase === "work" || phase === "manualWorking" || isAutoRunning
        }
        activeSetIndex={
          phase === "work" || phase === "manualWorking" ? activeSetIndex : null
        }
      />

      <WorkoutTimer
        phase={phase}
        secondsLeft={secondsLeft}
        totalDuration={totalDuration}
        statusHint={statusHint}
      />

      <div className={styles.navBar}>
        {isWorkoutCompleted ? (
          <button
            type="button"
            onClick={handleResetProgress}
            className={styles.mainActionBtn}>
            Закончить тренировку
          </button>
        ) : isManualMode ? (
          <button
            type="button"
            disabled={isManualResting}
            onClick={handleManualAction}
            className={`${styles.mainActionBtn} ${
              phase === "manualWorking" ? styles.mainActionBtnStop : ""
            }`}>
            {phase === "manualWorking" ? "Закончить подход" : "Начать подход"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAutoToggle}
            className={`${styles.mainActionBtn} ${
              isAutoRunning ? styles.mainActionBtnStop : ""
            }`}>
            {isAutoRunning ? "Приостановить тренировку" : "Начать тренировку"}
          </button>
        )}
      </div>

      <WorkoutSettingsModal
        isOpen={isSettingsOpen}
        exercises={dayExercises}
        config={timingConfig}
        onChangeConfig={handleSaveConfig}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
