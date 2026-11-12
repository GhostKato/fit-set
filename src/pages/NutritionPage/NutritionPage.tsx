import { useNavigate } from "react-router-dom";
import styles from "./NutritionPage.module.css";

export const NutritionPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.badge}>В разработке</span>
        <h1 className={styles.title}>Раздел «Питание» скоро откроется</h1>
        <p className={styles.text}>
          Здесь появится конструктор рациона для завтрака, обеда и ужина,
          подсчет калорий каждой позиции и рецепты фирменных соусов.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={styles.backBtn}>
          Вернуться на главную
        </button>
      </div>
    </div>
  );
};
