import { useLanguage } from "../../context/LanguageContext";
import styles from "./StatusToggle.module.css";

interface StatusToggleProps {
  checked: boolean;
  onChange: (nextValue: boolean) => void;
  size?: "sm" | "md";
  label?: string;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  title?: string;
  className?: string;
}

export const StatusToggle = ({
  checked,
  onChange,
  size = "sm",
  label,
  labelPosition = "right",
  disabled = false,
  title,
  className = "",
}: StatusToggleProps) => {
  const { t } = useLanguage();

  return (
    <label
      title={title ?? (checked ? t.statusActive : t.statusInactive)}
      className={`${styles.wrapper} ${
        disabled ? styles.wrapperDisabled : ""
      } ${className}`}>
      {label && labelPosition === "left" && (
        <span className={styles.label}>{label}</span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`${styles.track} ${styles[size]} ${
          checked ? styles.trackActive : styles.trackInactive
        }`}>
        <span
          className={`${styles.thumb} ${
            checked ? styles.thumbActive : styles.thumbInactive
          }`}
        />
      </button>

      {label && labelPosition === "right" && (
        <span className={styles.label}>{label}</span>
      )}
    </label>
  );
};
