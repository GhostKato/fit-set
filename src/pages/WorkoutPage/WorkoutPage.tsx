import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { RestTimer } from "../../components/RestTimer/RestTimer";

export const WorkoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDay = searchParams.get("day") || "Понедельник";

  const dayExercises = useAppSelector((state) =>
    state.exercises.items
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.order - b.order),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>(
    {},
  );

  if (dayExercises.length === 0) {
    return (
      <div>
        <h2>На {selectedDay} упражнений пока нет</h2>
        <button
          type="button"
          onClick={() => navigate("/exercises")}
          style={{ padding: "10px 16px", cursor: "pointer" }}>
          Добавить упражнения
        </button>
      </div>
    );
  }

  const currentExercise = dayExercises[currentIndex];
  const currentSetsState =
    completedSets[currentExercise.id] ||
    Array(currentExercise.sets).fill(false);

  const toggleSet = (setIndex: number) => {
    const updated = [...currentSetsState];
    updated[setIndex] = !updated[setIndex];
    setCompletedSets((prev) => ({
      ...prev,
      [currentExercise.id]: updated,
    }));
  };

  const isLastExercise = currentIndex === dayExercises.length - 1;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}>
        <span style={{ fontWeight: "bold", color: "#28a745" }}>
          {selectedDay} • Упражнение {currentIndex + 1} из {dayExercises.length}
        </span>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ padding: "6px 12px", cursor: "pointer" }}>
          Завершить
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
        }}>
        <span style={{ fontSize: "13px", color: "#666" }}>
          {currentExercise.muscleGroup}
        </span>
        <h2 style={{ margin: "6px 0 12px 0" }}>{currentExercise.name}</h2>

        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#28a745",
            marginBottom: "15px",
          }}>
          {currentExercise.sets} подх. × {currentExercise.reps} повт. • Вес:{" "}
          {currentExercise.weight || "Свой вес"}
        </p>

        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "8px" }}>Отметьте выполненные подходы:</h4>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {currentSetsState.map((isDone, idx) => (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  border: "1px solid #28a745",
                  borderRadius: "6px",
                  backgroundColor: isDone ? "#28a745" : "transparent",
                  color: isDone ? "#fff" : "#333",
                  cursor: "pointer",
                }}>
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleSet(idx)}
                  style={{ cursor: "pointer" }}
                />
                Подход {idx + 1}
              </label>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
            borderTop: "1px solid #eee",
            paddingTop: "12px",
          }}>
          {currentExercise.targetMuscles && (
            <p>
              <strong>Мышцы:</strong> {currentExercise.targetMuscles}
            </p>
          )}
          {currentExercise.howToDo && (
            <p>
              <strong>Техника:</strong> {currentExercise.howToDo}
            </p>
          )}
          {currentExercise.handsMode && (
            <p>
              <strong>Хват:</strong> {currentExercise.handsMode}
            </p>
          )}
          {currentExercise.palmPosition && (
            <p>
              <strong>Ладони:</strong> {currentExercise.palmPosition}
            </p>
          )}
          {currentExercise.breathing && (
            <p>
              <strong>Дыхание:</strong> {currentExercise.breathing}
            </p>
          )}
        </div>
      </div>

      <RestTimer />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}>
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          style={{
            padding: "10px 18px",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}>
          ← Назад
        </button>

        {isLastExercise ? (
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            Завершить тренировку
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
            Следующее упражнение →
          </button>
        )}
      </div>
    </div>
  );
};
