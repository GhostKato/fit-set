import { useState, type SubmitEvent } from "react";
import { loginUser, registerUser } from "../../services/authOps";
import styles from "./AuthPage.module.css";

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await registerUser(name.trim(), email.trim(), password);
      } else {
        await loginUser(email.trim(), password);
      }
    } catch {
      setError(
        "Ошибка входа: проверьте email, пароль (минимум 6 символов) или подключение к интернету.",
      );
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={styles.input}
          />

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль (от 6 символов)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={`${styles.input} ${styles.passwordInput}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={styles.togglePasswordBtn}
              tabIndex={-1}>
              {showPassword ? "Скрыть" : "Показать"}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}>
            {isLoading
              ? "Загрузка..."
              : isRegister
                ? "Создать аккаунт"
                : "Войти"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleToggleMode}
          disabled={isLoading}
          className={styles.switchBtn}>
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
};
