import { useState, type FormEvent } from "react";
import { loginUser, registerUser } from "../../services/authOps";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await registerUser(name, email, password);
      } else {
        await loginUser(email, password);
      }
    } catch {
      setError(
        "Ошибка входа: проверьте email, пароль (минимум 6 символов) или интернет.",
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "60px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {isRegister ? "Регистрация в Fit Set" : "Вход в Fit Set"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {isRegister && (
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "10px" }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <input
          type="password"
          placeholder="Пароль (от 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

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
          {isRegister ? "Создать аккаунт" : "Войти"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsRegister((prev) => !prev)}
        style={{
          marginTop: "15px",
          width: "100%",
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
        }}>
        {isRegister
          ? "Уже есть аккаунт? Войти"
          : "Нет аккаунта? Зарегистрироваться"}
      </button>
    </div>
  );
};
