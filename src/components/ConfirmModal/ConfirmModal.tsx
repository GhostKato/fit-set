import { useEffect, type MouseEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  subtitle,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true">
      <div className={styles.modal}>
        <h3 className={styles.title}>{title ?? t.confirmDeleteTitle}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.noBtn}>
            {t.confirmNo}
          </button>
          <button type="button" onClick={onConfirm} className={styles.yesBtn}>
            {t.confirmYes}
          </button>
        </div>
      </div>
    </div>
  );
};
