import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { TRANSLATIONS, type TranslationDict } from "../i18n";

export type LanguageCode = "en" | "ua" | "ru";

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (nextLang: LanguageCode) => void;
  t: TranslationDict;
}

const STORAGE_LANG_KEY = "fitset_language";

const HTML_LANG_MAP: Record<LanguageCode, string> = {
  ua: "uk",
  ru: "ru",
  en: "en",
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === "en" || saved === "ua" || saved === "ru") {
      return saved;
    }
    return "ua";
  });

  useEffect(() => {
    document.documentElement.setAttribute("lang", HTML_LANG_MAP[language]);
  }, [language]);

  const handleSetLanguage = (nextLang: LanguageCode) => {
    setLanguageState(nextLang);
    localStorage.setItem(STORAGE_LANG_KEY, nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: TRANSLATIONS[language],
      }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguage должен использоваться внутри LanguageProvider",
    );
  }
  return ctx;
};
