import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { listenToAuthChanges } from "./services/authOps";
import { useAppDispatch } from "./redux/hooks";
import { fetchExercises } from "./redux/exercises/operations";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Layout } from "./components/Layout/Layout";
import { Loader } from "./components/Loader/Loader";
import type { UserProfile } from "./types/user";
import { HomePage } from "./pages/HomePage/HomePage";
import { WorkoutPage } from "./pages/WorkoutPage/WorkoutPage";
import { ExercisesPage } from "./pages/ExercisesPage/ExercisesPage";
import { NutritionPage } from "./pages/NutritionPage/NutritionPage";

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
    return <Loader forceShow />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      <Loader />
      <Routes>
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<HomePage user={user} />} />
          <Route path="workout" element={<WorkoutPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="nutrition" element={<NutritionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
