import { NavLink, Outlet } from "react-router-dom";
import { logoutUser } from "../../services/authOps";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import type { UserProfile } from "../../types/user";
import styles from "./Layout.module.css";

interface LayoutProps {
  user: UserProfile;
}

export const Layout = ({ user }: LayoutProps) => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            Fit<span className={styles.brandAccent}>Set</span>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/" end className={getNavLinkClass}>
              Главная
            </NavLink>
            <NavLink to="/workout" className={getNavLinkClass}>
              Тренировка
            </NavLink>
            <NavLink to="/exercises" className={getNavLinkClass}>
              Упражнения
            </NavLink>
          </nav>

          <div className={styles.userBlock}>
            <span className={styles.userName}>{user.name || user.email}</span>
            <button
              type="button"
              onClick={logoutUser}
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
    </div>
  );
};
