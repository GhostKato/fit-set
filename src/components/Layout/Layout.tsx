import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logoutUser } from "../../services/authOps";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import type { UserProfile } from "../../types/user";
import styles from "./Layout.module.css";

interface LayoutProps {
  user: UserProfile;
}

export const Layout = ({ user }: LayoutProps) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logoutUser();
  };

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
            <span className={styles.userName}>{user.name || user.email}</span>
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
