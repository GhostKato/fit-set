import { useState, useRef, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { logoutUser } from "../../services/authOps";
import { useTheme } from "../../context/ThemeContext";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { StatusToggle } from "../StatusToggle/StatusToggle";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import type { UserProfile } from "../../types/user";
import styles from "./Layout.module.css";

interface LayoutProps {
  user: UserProfile;
}

export const Layout = ({ user }: LayoutProps) => {
  const { isAuto, theme, setIsAuto, setTheme } = useTheme();
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
              Тренировка
            </NavLink>
            <NavLink to="/exercises" className={getNavLinkClass}>
              Упражнения
            </NavLink>
            <NavLink to="/nutrition" className={getNavLinkClass}>
              Питание
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
                  aria-label="Настройки темы">
                  <div className={styles.themeTitle}>Тема оформления</div>

                  <div className={styles.themeRow}>
                    <div className={styles.themeRowInfo}>
                      <span className={styles.themeRowLabel}>
                        Авто по времени
                      </span>
                      <span className={styles.themeRowHint}>
                        День 07:00 – 20:00
                      </span>
                    </div>
                    <StatusToggle
                      checked={isAuto}
                      onChange={setIsAuto}
                      size="sm"
                      title={
                        isAuto
                          ? "Автосмена темы включена"
                          : "Автосмена темы выключена"
                      }
                    />
                  </div>

                  <div className={styles.themeDivider} />

                  <div className={styles.themeRow}>
                    <div className={styles.themeRowInfo}>
                      <span className={styles.themeRowLabel}>Ночная тема</span>
                      <span className={styles.themeRowHint}>
                        {isAuto
                          ? "Доступно при выкл. авто"
                          : theme === "dark"
                            ? "Включена ночная"
                            : "Включена дневная"}
                      </span>
                    </div>
                    <StatusToggle
                      checked={theme === "dark"}
                      disabled={isAuto}
                      onChange={(isDark) => setTheme(isDark ? "dark" : "light")}
                      size="sm"
                      title={
                        isAuto
                          ? "Сначала выключите автосмену темы"
                          : theme === "dark"
                            ? "Ночная тема"
                            : "Дневная тема"
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className={styles.logoutBtn}>
              Выйти
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
        title="Выйти из аккаунта?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};
