import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { listenToAuthChanges } from "./services/authOps";
import { useAppDispatch } from "./redux/hooks";
import { fetchExercises } from "./redux/exercises/operations";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Layout } from "./components/Layout/Layout";
import type { UserProfile } from "./types/user";
import { ExercisesPage } from "./pages/ExercisesPage/ExercisesPage";
import { WorkoutPage } from "./pages/WorkoutPage/WorkoutPage";

export default function App() {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(
      (currentUser) => {
        setUser(currentUser);
        setIsCheckingAuth(false);
        dispatch(fetchExercises());
      },
      () => {
        setUser(null);
        setIsCheckingAuth(false);
      },
    );

    return () => unsubscribe();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Загрузка Fit Set...
      </p>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<div>Главная страница (выбор дня недели)</div>} />
        <Route path="workout" element={<WorkoutPage />} />
        <Route path="exercises" element={<ExercisesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
