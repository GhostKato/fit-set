import { useState, type FormEvent } from "react";
import { loginUser, registerUser } from "../../services/authOps";
import styles from "./AuthPage.module.css";

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
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.brand}>
          Fit<span className={styles.brandAccent}>Set</span>
        </div>

        <h2 className={styles.title}>
          {isRegister ? "Создание аккаунта" : "Вход в личный кабинет"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Пароль (от 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            {isRegister ? "Создать аккаунт" : "Войти"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsRegister((prev) => !prev)}
          className={styles.switchBtn}>
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
};
