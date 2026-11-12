import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addExercise } from "../../redux/exercises/operations";
import { ExerciseCard } from "../../components/ExerciseCard/ExerciseCard";
import type { NewExercise } from "../../types/exercise";

const ALL_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const initialFormState: NewExercise = {
  day: "Понедельник",
  dayTitle: "Грудь и Трицепс",
  muscleGroup: "Грудь",
  order: 1,
  name: "",
  targetMuscles: "",
  sets: 3,
  reps: 12,
  weight: "",
  howToDo: "",
  handsMode: "",
  palmPosition: "",
  breathing: "",
};

export const ExercisesPage = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector(
    (state) => state.exercises,
  );

  const [formData, setFormData] = useState<NewExercise>(initialFormState);
  const [selectedDay, setSelectedDay] = useState<string>("Все");
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await dispatch(addExercise(formData));
    setFormData((prev) => ({
      ...initialFormState,
      day: prev.day,
      dayTitle: prev.dayTitle,
      order: prev.order + 1,
    }));
    setIsFormOpen(false);
  };

  const filteredExercises = items
    .filter((item) => (selectedDay === "Все" ? true : item.day === selectedDay))
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}>
        <h2>Моя программа упражнений</h2>
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          style={{
            padding: "10px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}>
          {isFormOpen ? "Закрыть форму" : "+ Добавить упражнение"}
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "10px",
            padding: "15px",
            border: "1px solid #28a745",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
          <h3>Новое упражнение</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              style={{ padding: "8px" }}>
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
              placeholder="Тема дня (Грудь и Трицепс)"
              style={{ padding: "8px", flex: 1 }}
            />
            <input
              name="muscleGroup"
              value={formData.muscleGroup}
              onChange={handleChange}
              placeholder="Группа мышц"
              style={{ padding: "8px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Название упражнения *"
              required
              style={{ padding: "8px", flex: 2 }}
            />
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="№"
              title="Порядок в тренировке"
              style={{ padding: "8px", width: "65px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <label>
              Подходы:{" "}
              <input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                min={1}
                style={{ padding: "8px", width: "65px" }}
              />
            </label>
            <label>
              Повторы:{" "}
              <input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                min={1}
                style={{ padding: "8px", width: "65px" }}
              />
            </label>
            <input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Рабочий вес (например, 50 кг)"
              style={{ padding: "8px", flex: 1 }}
            />
          </div>

          <input
            name="targetMuscles"
            value={formData.targetMuscles}
            onChange={handleChange}
            placeholder="Целевые мышцы (например, Верх груди)"
            style={{ padding: "8px" }}
          />
          <textarea
            name="howToDo"
            value={formData.howToDo}
            onChange={handleChange}
            placeholder="Как выполнять (техника)"
            rows={2}
            style={{ padding: "8px" }}
          />
          <input
            name="handsMode"
            value={formData.handsMode}
            onChange={handleChange}
            placeholder="Хват / режим рук (например, Широкий хват)"
            style={{ padding: "8px" }}
          />
          <input
            name="palmPosition"
            value={formData.palmPosition}
            onChange={handleChange}
            placeholder="Положение ладоней (например, Прямой хват)"
            style={{ padding: "8px" }}
          />
          <input
            name="breathing"
            value={formData.breathing}
            onChange={handleChange}
            placeholder="Дыхание (например, Выдох на усилии)"
            style={{ padding: "8px" }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}>
            Сохранить в базу
          </button>
        </form>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}>
        {["Все", ...ALL_DAYS].map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              border: "1px solid #28a745",
              backgroundColor: selectedDay === day ? "#28a745" : "transparent",
              color: selectedDay === day ? "#fff" : "#28a745",
              cursor: "pointer",
            }}>
            {day}
          </button>
        ))}
      </div>

      {isLoading && <p>Загрузка упражнений...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {!isLoading && filteredExercises.length === 0 ? (
        <p style={{ color: "#666" }}>
          Пока нет упражнений. Нажмите «+ Добавить упражнение», чтобы создать
          первое.
        </p>
      ) : (
        filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))
      )}
    </div>
  );
};
