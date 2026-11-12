import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import type { UserProfile } from "../../types/user";
import styles from "./HomePage.module.css";

interface HomePageProps {
  user: UserProfile;
}

const DAYS_BY_GET_DAY = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const WEEK_ORDER = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const HomePage = ({ user }: HomePageProps) => {
  const navigate = useNavigate();
  const exercises = useAppSelector((state) => state.exercises.items);

  const todayName = DAYS_BY_GET_DAY[new Date().getDay()];

  const activeDays = useMemo(() => {
    const uniqueDays = Array.from(new Set(exercises.map((item) => item.day)));
    return uniqueDays.sort(
      (a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b),
    );
  }, [exercises]);

  const todayExercises = useMemo(() => {
    return exercises.filter((item) => item.day === todayName);
  }, [exercises, todayName]);

  const handleStartWorkout = (day: string) => {
    navigate(`/workout?day=${encodeURIComponent(day)}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>Привет, {user.name || "Спортсмен"}!</h1>
      <p className={styles.dateText}>
        Сегодня: <strong>{todayName}</strong>
      </p>

      {todayExercises.length > 0 ? (
        <div className={styles.todayCard}>
          <span className={styles.badge}>ТРЕНИРОВКА СЕГОДНЯ</span>

          <h2 className={styles.todayTitle}>
            {todayName} — {todayExercises.at(0)?.dayTitle || "Тренировка"}
          </h2>

          <p className={styles.todayInfo}>
            Запланировано упражнений: <strong>{todayExercises.length}</strong>
          </p>

          <button
            type="button"
            onClick={() => handleStartWorkout(todayName)}
            className={styles.startBtn}>
            Начать сегодняшнюю тренировку
          </button>
        </div>
      ) : (
        <div className={styles.restCard}>
          <h3 className={styles.restTitle}>
            Сегодня день отдыха и восстановления
          </h3>
          <p className={styles.restText}>
            На {todayName.toLowerCase()} тренировок нет. Отдыхайте и набирайтесь
            сил перед следующим занятием.
          </p>
        </div>
      )}

      <h3 className={styles.sectionTitle}>Ваше расписание на неделю</h3>

      {activeDays.length === 0 ? (
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>
            У вас пока нет добавленных упражнений.
          </p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            className={styles.addBtn}>
            Добавить упражнения
          </button>
        </div>
      ) : (
        <div className={styles.scheduleGrid}>
          {activeDays.map((day) => {
            const dayExercises = exercises.filter((item) => item.day === day);
            const customTitle = dayExercises.at(0)?.dayTitle || "Тренировка";
            const isToday = day === todayName;

            return (
              <div
                key={day}
                className={`${styles.dayCard} ${
                  isToday ? styles.dayCardToday : ""
                }`}>
                <h4 className={styles.dayTitle}>
                  {day} —{" "}
                  <span className={styles.dayAccent}>{customTitle}</span>
                  {isToday && (
                    <span className={styles.todayTag}>(Сегодня)</span>
                  )}
                </h4>
                <p className={styles.dayCount}>
                  Упражнений в программе: <strong>{dayExercises.length}</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
