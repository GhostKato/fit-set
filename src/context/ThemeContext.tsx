import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  isAuto: boolean;
  theme: ThemeMode;
  setIsAuto: (nextAuto: boolean) => void;
  setTheme: (nextTheme: ThemeMode) => void;
}

const STORAGE_AUTO_KEY = "fitset_theme_auto";
const STORAGE_THEME_KEY = "fitset_theme_manual";

const getTimeBasedTheme = (): ThemeMode => {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "light" : "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isAuto, setIsAutoState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_AUTO_KEY);
    return saved === null ? true : saved === "true";
  });

  const [manualTheme, setManualTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    return saved === "dark" || saved === "light" ? saved : getTimeBasedTheme();
  });

  const [autoTheme, setAutoTheme] = useState<ThemeMode>(getTimeBasedTheme);

  useEffect(() => {
    if (!isAuto) return;

    const syncByTime = () => setAutoTheme(getTimeBasedTheme());
    syncByTime();

    const intervalId = window.setInterval(syncByTime, 30_000);
    return () => window.clearInterval(intervalId);
  }, [isAuto]);

  const activeTheme: ThemeMode = isAuto ? autoTheme : manualTheme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  const handleSetIsAuto = (nextAuto: boolean) => {
    if (!nextAuto) {
      setManualTheme(activeTheme);
      localStorage.setItem(STORAGE_THEME_KEY, activeTheme);
    } else {
      setAutoTheme(getTimeBasedTheme());
    }
    setIsAutoState(nextAuto);
    localStorage.setItem(STORAGE_AUTO_KEY, String(nextAuto));
  };

  const handleSetTheme = (nextTheme: ThemeMode) => {
    if (isAuto) return;
    setManualTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        isAuto,
        theme: activeTheme,
        setIsAuto: handleSetIsAuto,
        setTheme: handleSetTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme должен использоваться внутри ThemeProvider");
  }
  return ctx;
};
