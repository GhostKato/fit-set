import type { LanguageCode } from "../context/LanguageContext";

const DAY_LABELS: Record<string, Record<LanguageCode, string>> = {
  monday: { ua: "Понеділок", ru: "Понедельник", en: "Monday" },
  tuesday: { ua: "Вівторок", ru: "Вторник", en: "Tuesday" },
  wednesday: { ua: "Середа", ru: "Среда", en: "Wednesday" },
  thursday: { ua: "Четвер", ru: "Четверг", en: "Thursday" },
  friday: { ua: "П'ятниця", ru: "Пятница", en: "Friday" },
  saturday: { ua: "Субота", ru: "Суббота", en: "Saturday" },
  sunday: { ua: "Неділя", ru: "Воскресенье", en: "Sunday" },
};

const SHORT_DAY_LABELS: Record<string, Record<LanguageCode, string>> = {
  monday: { ua: "Пн", ru: "Пн", en: "Mon" },
  tuesday: { ua: "Вт", ru: "Вт", en: "Tue" },
  wednesday: { ua: "Ср", ru: "Ср", en: "Wed" },
  thursday: { ua: "Чт", ru: "Чт", en: "Thu" },
  friday: { ua: "Пт", ru: "Пт", en: "Fri" },
  saturday: { ua: "Сб", ru: "Сб", en: "Sat" },
  sunday: { ua: "Нд", ru: "Вс", en: "Sun" },
};

const MEAL_LABELS: Record<string, Record<LanguageCode, string>> = {
  breakfast: { ua: "Сніданок", ru: "Завтрак", en: "Breakfast" },
  lunch: { ua: "Обід", ru: "Обед", en: "Lunch" },
  dinner: { ua: "Вечеря", ru: "Ужин", en: "Dinner" },
};

const CATEGORY_LABELS: Record<string, Record<LanguageCode, string>> = {
  simple_carbs: {
    ua: "Прості вуглеводи",
    ru: "Простые углеводы",
    en: "Simple Carbs",
  },
  complex_carbs: {
    ua: "Складні вуглеводи",
    ru: "Сложные углеводы",
    en: "Complex Carbs",
  },
  protein: { ua: "Білок", ru: "Белок", en: "Protein" },
  fats: { ua: "Жири", ru: "Жиры", en: "Fats" },
  fiber: { ua: "Клітковина", ru: "Клетчатка", en: "Fiber" },
  sauce: { ua: "Соус", ru: "Соус", en: "Sauce" },
  shakes: { ua: "Коктейлі", ru: "Коктейли", en: "Shakes" },
  dessert: { ua: "Десерт", ru: "Десерт", en: "Dessert" },
};

export const translateDay = (day: string, lang: LanguageCode): string =>
  DAY_LABELS[day]?.[lang] ?? day;

export const translateShortDay = (day: string, lang: LanguageCode): string =>
  SHORT_DAY_LABELS[day]?.[lang] ?? day;

export const translateDayAccusative = (
  day: string,
  lang: LanguageCode,
): string => {
  if (lang === "en") return DAY_LABELS[day]?.en ?? day;
  if (lang === "ua") {
    const map: Record<string, string> = {
      monday: "понеділок",
      tuesday: "вівторок",
      wednesday: "середу",
      thursday: "четвер",
      friday: "п'ятницю",
      saturday: "суботу",
      sunday: "неділю",
    };
    return map[day] ?? translateDay(day, lang).toLowerCase();
  }
  const mapRu: Record<string, string> = {
    monday: "понедельник",
    tuesday: "вторник",
    wednesday: "среду",
    thursday: "четверг",
    friday: "пятницу",
    saturday: "субботу",
    sunday: "воскресенье",
  };
  return mapRu[day] ?? day;
};

export const translateMeal = (meal: string, lang: LanguageCode): string =>
  MEAL_LABELS[meal]?.[lang] ?? meal;

export const translateCategory = (
  category: string,
  lang: LanguageCode,
): string => CATEGORY_LABELS[category]?.[lang] ?? category;
