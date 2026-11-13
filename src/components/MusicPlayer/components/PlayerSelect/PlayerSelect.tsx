import { useState, useRef, useEffect } from "react";
import styles from "./PlayerSelect.module.css";

export interface PlayerSelectOption {
  value: string;
  label: string;
}

interface PlayerSelectProps {
  value: string;
  options: PlayerSelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  topActionLabel?: string;
  onTopAction?: () => void;
}

export const PlayerSelect = ({
  value,
  options,
  placeholder = "Выбрать...",
  onChange,
  topActionLabel,
  onTopAction,
}: PlayerSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (selectRef.current && target && !selectRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className={styles.wrapper}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        aria-expanded={isOpen}>
        <span className={styles.label}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {topActionLabel && onTopAction && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onTopAction();
              }}
              className={`${styles.option} ${styles.optionAction}`}>
              {topActionLabel}
            </button>
          )}

          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`${styles.option} ${
                  isSelected ? styles.optionSelected : ""
                }`}>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
