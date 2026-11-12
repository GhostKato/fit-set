import { NavLink, Outlet } from "react-router-dom";
import { logoutUser } from "../../services/authOps";
import { MusicPlayer } from "../MusicPlayer/MusicPlayer";
import type { UserProfile } from "../../types/user";

interface LayoutProps {
  user: UserProfile;
}

export const Layout = ({ user }: LayoutProps) => {
  return (
    <div style={{ paddingBottom: "160px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          borderBottom: "1px solid #eee",
          flexWrap: "wrap",
          gap: "10px",
        }}>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Fit<span style={{ color: "#28a745" }}>Set</span>
        </div>

        <nav style={{ display: "flex", gap: "15px" }}>
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/workout">Тренировка</NavLink>
          <NavLink to="/exercises">Упражнения</NavLink>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>
            {user.name || user.email}
          </span>
          <button
            type="button"
            onClick={logoutUser}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}>
            Выйти
          </button>
        </div>
      </header>

      <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Outlet />
      </main>

      <MusicPlayer />
    </div>
  );
};
