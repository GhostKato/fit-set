import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import styles from "./CustomSelect.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value?: string;
  values?: string[];
  multiple?: boolean;
  options: readonly SelectOption[] | readonly string[];
  onChange?: (value: string) => void;
  onChangeMultiple?: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  title?: string;
}

export const CustomSelect = ({
  value = "",
  values = [],
  multiple = false,
  options,
  onChange,
  onChangeMultiple,
  placeholder = "Выберите...",
  className = "",
  title,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSingleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleToggleMulti = (optionValue: string) => {
    if (!onChangeMultiple) return;
    const exists = values.includes(optionValue);
    const nextValues = exists
      ? values.filter((v) => v !== optionValue)
      : normalizedOptions
          .map((o) => o.value)
          .filter((v) => v === optionValue || values.includes(v));
    onChangeMultiple(nextValues);
  };

  const handleSelectAll = () => {
    onChangeMultiple?.(normalizedOptions.map((opt) => opt.value));
  };

  const handleClearAll = () => {
    onChangeMultiple?.([]);
  };

  const getTriggerText = () => {
    if (!multiple) {
      return selectedOption ? selectedOption.label : placeholder;
    }
    if (values.length === 0) return placeholder;
    if (values.length === 1) {
      const singleOption = normalizedOptions.find(
        (opt) => opt.value === values,
      );
      return singleOption ? singleOption.label : values;
    }
    return `Выбрано дней: ${values.length}`;
  };

  return (
    <div
      ref={containerRef}
      title={title}
      className={`${styles.wrapper} ${
        multiple ? styles.wrapperMultiple : ""
      } ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}>
        <span className={styles.valueText}>{getTriggerText()}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <ul
          className={styles.dropdown}
          role="listbox"
          aria-multiselectable={multiple}>
          {multiple && (
            <>
              <li
                role="option"
                aria-selected={false}
                onClick={handleSelectAll}
                className={`${styles.option} ${styles.bulkOption}`}>
                <span>Выбрать все</span>
              </li>

              <li
                role="option"
                aria-selected={false}
                onClick={handleClearAll}
                className={`${styles.option} ${styles.bulkOption} ${styles.bulkDivider}`}>
                <span>Убрать все</span>
              </li>
            </>
          )}

          {normalizedOptions.map((opt) => {
            const isSelected = multiple
              ? values.includes(opt.value)
              : opt.value === value;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() =>
                  multiple
                    ? handleToggleMulti(opt.value)
                    : handleSingleSelect(opt.value)
                }
                className={`${styles.option} ${
                  isSelected ? styles.optionSelected : ""
                }`}>
                <span className={styles.optionLeft}>
                  {multiple && (
                    <span
                      className={`${styles.checkbox} ${
                        isSelected ? styles.checkboxChecked : ""
                      }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                  )}
                  <span className={styles.optionLabel}>{opt.label}</span>
                </span>
                {!multiple && isSelected && (
                  <span className={styles.checkIcon}>✓</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
