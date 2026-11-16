import { ua, type TranslationDict } from "./ua";
import { ru } from "./ru";
import { en } from "./en";
import type { LanguageCode } from "../context/LanguageContext";

export const TRANSLATIONS: Record<LanguageCode, TranslationDict> = {
  ua,
  ru,
  en,
};

export type { TranslationDict };
export {
  translateDay,
  translateShortDay,
  translateDayAccusative,
  translateMeal,
  translateCategory,
} from "./helpers";
