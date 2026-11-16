import { useAppSelector } from "../../redux/hooks";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./Loader.module.css";

interface LoaderProps {
  inline?: boolean;
  forceShow?: boolean;
}

export const Loader = ({ inline = false, forceShow = false }: LoaderProps) => {
  const { t } = useLanguage();
  const isGlobalLoading = useAppSelector(
    (state) => state.loader.pendingCount > 0,
  );

  if (inline) {
    return (
      <div
        className={styles.inlineWrapper}
        role="status"
        aria-label={t.loadingAria}>
        <div className={`${styles.spinner} ${styles.spinnerSmall}`} />
      </div>
    );
  }

  if (!forceShow && !isGlobalLoading) return null;

  return (
    <div className={styles.overlay} role="status" aria-label={t.loadingAria}>
      <div className={styles.spinner} />
    </div>
  );
};
