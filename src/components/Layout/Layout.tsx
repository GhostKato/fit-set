import { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { logoutUser } from "../../services/authOps";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage, type LanguageCode } from "../../context/LanguageContext";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { StatusToggle } from "../StatusToggle/StatusToggle";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import type { UserProfile } from "../../types/user";
import styles from "./Layout.module.css";

interface LayoutProps {
  user: UserProfile;
}

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
];

export const Layout = ({ user }: LayoutProps) => {
  const { isAuto, theme, setIsAuto, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logoutUser();
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            Fit<span className={styles.brandAccent}>Set</span>
          </Link>

          <nav className={styles.nav}>
            <NavLink to="/workout" className={getNavLinkClass}>
              {t.navWorkout}
            </NavLink>
            <NavLink to="/exercises" className={getNavLinkClass}>
              {t.navExercises}
            </NavLink>
            <NavLink to="/nutrition" className={getNavLinkClass}>
              {t.navNutrition}
            </NavLink>
          </nav>

          <div className={styles.userBlock}>
            <div ref={userMenuRef} className={styles.userMenuWrapper}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-expanded={isUserMenuOpen}
                className={`${styles.userNameBtn} ${
                  isUserMenuOpen ? styles.userNameBtnOpen : ""
                }`}>
                <span className={styles.userName}>
                  {user.name || user.email}
                </span>
                <ChevronDown
                  size={15}
                  className={`${styles.userChevron} ${
                    isUserMenuOpen ? styles.userChevronOpen : ""
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div
                  className={styles.userDropdown}
                  role="dialog"
                  aria-label={t.settingsAria}>
                  <div className={styles.themeTitle}>{t.themeTitle}</div>

                  <div className={styles.themeRow}>
                    <div className={styles.themeRowInfo}>
                      <span className={styles.themeRowLabel}>
                        {t.themeAuto}
                      </span>
                      <span className={styles.themeRowHint}>
                        {t.themeAutoHint}
                      </span>
                    </div>
                    <StatusToggle
                      checked={isAuto}
                      onChange={setIsAuto}
                      size="sm"
                      title={isAuto ? t.themeAutoOnTitle : t.themeAutoOffTitle}
                    />
                  </div>

                  <div className={styles.themeDivider} />

                  <div className={styles.themeRow}>
                    <div className={styles.themeRowInfo}>
                      <span className={styles.themeRowLabel}>
                        {t.themeDark}
                      </span>
                      <span className={styles.themeRowHint}>
                        {isAuto
                          ? t.themeDarkAutoHint
                          : theme === "dark"
                            ? t.themeDarkOnHint
                            : t.themeDarkOffHint}
                      </span>
                    </div>
                    <StatusToggle
                      checked={theme === "dark"}
                      disabled={isAuto}
                      onChange={(isDark) => setTheme(isDark ? "dark" : "light")}
                      size="sm"
                      title={
                        isAuto
                          ? t.themeDarkAutoTitle
                          : theme === "dark"
                            ? t.themeDarkTitle
                            : t.themeLightTitle
                      }
                    />
                  </div>

                  <div className={styles.themeDivider} />

                  <div
                    className={styles.langGroup}
                    role="group"
                    aria-label={t.languageAria}>
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
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className={styles.logoutBtn}>
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <MusicPlayer />

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title={t.logoutConfirmTitle}
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};
