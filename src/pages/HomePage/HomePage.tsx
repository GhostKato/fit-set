import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import type { UserProfile } from "../../types/workout.types";

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
    <div>
      <h1 style={{ marginBottom: "6px" }}>
        Привет, {user.name || "Спортсмен"}!
      </h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Сегодня: <strong>{todayName}</strong>
      </p>

      {todayExercises.length > 0 ? (
        <div
          style={{
            backgroundColor: "#e9f7ef",
            border: "2px solid #28a745",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "28px",
          }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#28a745",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
              padding: "4px 10px",
              borderRadius: "12px",
              marginBottom: "10px",
            }}>
            ТРЕНИРОВКА СЕГОДНЯ
          </span>

          <h2 style={{ margin: "0 0 8px 0" }}>
            {todayName} — {todayExercises.at(0)?.dayTitle || "Тренировка"}
          </h2>

          <p style={{ margin: "0 0 16px 0", color: "#333" }}>
            Запланировано упражнений: <strong>{todayExercises.length}</strong>
          </p>

          <button
            type="button"
            onClick={() => handleStartWorkout(todayName)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}>
            Начать сегодняшнюю тренировку
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "28px",
          }}>
          <h3 style={{ margin: "0 0 6px 0" }}>
            Сегодня день отдыха и восстановления
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            На {todayName.toLowerCase()} тренировок нет. Отдыхайте и набирайтесь
            сил перед следующим занятием.
          </p>
        </div>
      )}

      <h3 style={{ marginBottom: "14px" }}>Ваше расписание на неделю</h3>

      {activeDays.length === 0 ? (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}>
          <p style={{ margin: "0 0 10px 0" }}>
            У вас пока нет добавленных упражнений.
          </p>
          <button
            type="button"
            onClick={() => navigate("/exercises")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>
            Добавить упражнения
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "14px" }}>
          {activeDays.map((day) => {
            const dayExercises = exercises.filter((item) => item.day === day);
            const customTitle = dayExercises.at(0)?.dayTitle || "Тренировка";
            const isToday = day === todayName;

            return (
              <div
                key={day}
                style={{
                  border: isToday ? "2px solid #28a745" : "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "16px",
                }}>
                <h4 style={{ margin: "0 0 6px 0" }}>
                  {day} —{" "}
                  <span style={{ color: "#28a745" }}>{customTitle}</span>{" "}
                  {isToday && (
                    <span style={{ fontSize: "12px", color: "#28a745" }}>
                      (Сегодня)
                    </span>
                  )}
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
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
