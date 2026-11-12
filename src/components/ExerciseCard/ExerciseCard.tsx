import { useState, type ChangeEvent } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { editExercise, removeExercise } from "../../redux/exercises/operations";
import type { Exercise, NewExercise } from "../../types/exercise";

interface ExerciseCardProps {
  exercise: Exercise;
}

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<NewExercise>({
    day: exercise.day,
    dayTitle: exercise.dayTitle,
    muscleGroup: exercise.muscleGroup,
    order: exercise.order,
    name: exercise.name,
    targetMuscles: exercise.targetMuscles,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    howToDo: exercise.howToDo,
    handsMode: exercise.handsMode,
    palmPosition: exercise.palmPosition,
    breathing: exercise.breathing,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "sets" || name === "reps" || name === "order"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = async () => {
    await dispatch(editExercise({ id: exercise.id, fields: formData }));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        style={{
          border: "2px solid #007bff",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "12px",
        }}>
        <h4>Редактирование упражнения</h4>
        <div style={{ display: "grid", gap: "8px" }}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название"
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <select name="day" value={formData.day} onChange={handleChange}>
              {ALL_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              name="dayTitle"
              value={formData.dayTitle}
              onChange={handleChange}
              placeholder="Тема дня"
            />
            <input
              name="muscleGroup"
              value={formData.muscleGroup}
              onChange={handleChange}
              placeholder="Группа мышц"
            />
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Порядок"
              style={{ width: "70px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="number"
              name="sets"
              value={formData.sets}
              onChange={handleChange}
              placeholder="Подходы"
            />
            <input
              type="number"
              name="reps"
              value={formData.reps}
              onChange={handleChange}
              placeholder="Повторы"
            />
            <input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Вес (например, 40 кг)"
            />
          </div>
          <input
            name="targetMuscles"
            value={formData.targetMuscles}
            onChange={handleChange}
            placeholder="Целевые мышцы"
          />
          <textarea
            name="howToDo"
            value={formData.howToDo}
            onChange={handleChange}
            placeholder="Техника выполнения"
            rows={2}
          />
          <input
            name="handsMode"
            value={formData.handsMode}
            onChange={handleChange}
            placeholder="Хват / режим рук"
          />
          <input
            name="palmPosition"
            value={formData.palmPosition}
            onChange={handleChange}
            placeholder="Положение ладоней"
          />
          <input
            name="breathing"
            value={formData.breathing}
            onChange={handleChange}
            placeholder="Дыхание"
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Сохранить
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            style={{ padding: "8px 14px", cursor: "pointer" }}>
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "12px",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "10px",
        }}>
        <div>
          <span style={{ fontSize: "12px", color: "#666" }}>
            {exercise.day} • {exercise.muscleGroup} • №{exercise.order}
          </span>
          <h3 style={{ margin: "4px 0" }}>{exercise.name}</h3>
          <p style={{ fontWeight: "bold", color: "#28a745", margin: "4px 0" }}>
            {exercise.sets} подх. × {exercise.reps} повт. | Вес:{" "}
            {exercise.weight || "Свой вес"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            style={{ padding: "6px 10px", cursor: "pointer" }}>
            Изменить
          </button>
          <button
            type="button"
            onClick={() => dispatch(removeExercise(exercise.id))}
            style={{
              padding: "6px 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}>
            Удалить
          </button>
        </div>
      </div>

      {exercise.targetMuscles && (
        <p style={{ fontSize: "14px", margin: "6px 0" }}>
          <strong>Мышцы:</strong> {exercise.targetMuscles}
        </p>
      )}
      {exercise.howToDo && (
        <p style={{ fontSize: "14px", margin: "6px 0" }}>
          <strong>Техника:</strong> {exercise.howToDo}
        </p>
      )}
      {exercise.handsMode && (
        <p style={{ fontSize: "14px", margin: "4px 0" }}>
          <strong>Хват:</strong> {exercise.handsMode}
        </p>
      )}
      {exercise.palmPosition && (
        <p style={{ fontSize: "14px", margin: "4px 0" }}>
          <strong>Ладони:</strong> {exercise.palmPosition}
        </p>
      )}
      {exercise.breathing && (
        <p style={{ fontSize: "14px", margin: "4px 0" }}>
          <strong>Дыхание:</strong> {exercise.breathing}
        </p>
      )}
    </div>
  );
};
