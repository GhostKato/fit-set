import { useState, type SubmitEvent } from "react";
import { loginUser, registerUser } from "../../services/authOps";
import { useLanguage, type LanguageCode } from "../../context/LanguageContext";
import styles from "./AuthPage.module.css";

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
];

export const AuthPage = () => {
  const { language, setLanguage, t } = useLanguage();
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
      setError(t.authError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.langBar} role="group" aria-label={t.languageAria}>
        {LANGUAGES.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={language === item.code}
            className={`${styles.langBtn} ${
              language === item.code ? styles.langBtnActive : ""
            }`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.brand}>
          Fit<span className={styles.brandAccent}>Set</span>
        </div>

        <h2 className={styles.title}>
          {isRegister ? t.authCreateTitle : t.authLoginTitle}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <input
              type="text"
              placeholder={t.authNamePlaceholder}
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
              placeholder={t.authPasswordPlaceholder}
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
              {showPassword ? t.authHidePassword : t.authShowPassword}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}>
            {isLoading
              ? t.authLoading
              : isRegister
                ? t.authCreateBtn
                : t.authLoginBtn}
          </button>
        </form>

        <button
          type="button"
          onClick={handleToggleMode}
          disabled={isLoading}
          className={styles.switchBtn}>
          {isRegister ? t.authSwitchToLogin : t.authSwitchToRegister}
        </button>
      </div>
    </div>
  );
};
