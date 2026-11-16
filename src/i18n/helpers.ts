import type { LanguageCode } from "../context/LanguageContext";

const DAY_LABELS: Record<string, Record<LanguageCode, string>> = {
  Понедельник: { ua: "Понеділок", ru: "Понедельник", en: "Monday" },
  Вторник: { ua: "Вівторок", ru: "Вторник", en: "Tuesday" },
  Среда: { ua: "Середа", ru: "Среда", en: "Wednesday" },
  Четверг: { ua: "Четвер", ru: "Четверг", en: "Thursday" },
  Пятница: { ua: "П'ятниця", ru: "Пятница", en: "Friday" },
  Суббота: { ua: "Субота", ru: "Суббота", en: "Saturday" },
  Воскресенье: { ua: "Неділя", ru: "Воскресенье", en: "Sunday" },
};

const SHORT_DAY_LABELS: Record<string, Record<LanguageCode, string>> = {
  Понедельник: { ua: "Пн", ru: "Пн", en: "Mon" },
  Вторник: { ua: "Вт", ru: "Вт", en: "Tue" },
  Среда: { ua: "Ср", ru: "Ср", en: "Wed" },
  Четверг: { ua: "Чт", ru: "Чт", en: "Thu" },
  Пятница: { ua: "Пт", ru: "Пт", en: "Fri" },
  Суббота: { ua: "Сб", ru: "Сб", en: "Sat" },
  Воскресенье: { ua: "Нд", ru: "Вс", en: "Sun" },
};

const MEAL_LABELS: Record<string, Record<LanguageCode, string>> = {
  Завтрак: { ua: "Сніданок", ru: "Завтрак", en: "Breakfast" },
  Обед: { ua: "Обід", ru: "Обід", en: "Lunch" },
  Ужин: { ua: "Вечеря", ru: "Ужин", en: "Dinner" },
};

const CATEGORY_LABELS: Record<string, Record<LanguageCode, string>> = {
  "Простые углеводы": {
    ua: "Прості вуглеводи",
    ru: "Простые углеводы",
    en: "Simple Carbs",
  },
  "Сложные углеводы": {
    ua: "Складні вуглеводи",
    ru: "Сложные углеводы",
    en: "Complex Carbs",
  },
  Белок: { ua: "Білок", ru: "Белок", en: "Protein" },
  Жиры: { ua: "Жири", ru: "Жиры", en: "Fats" },
  Клетчатка: { ua: "Клітковина", ru: "Клетчатка", en: "Fiber" },
  Соус: { ua: "Соус", ru: "Соус", en: "Sauce" },
  Коктейли: { ua: "Коктейлі", ru: "Коктейли", en: "Shakes" },
  Десерт: { ua: "Десерт", ru: "Десерт", en: "Dessert" },
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
      Понедельник: "понеділок",
      Вторник: "вівторок",
      Среда: "середу",
      Четверг: "четвер",
      Пятница: "п'ятницю",
      Суббота: "суботу",
      Воскресенье: "неділю",
    };
    return map[day] ?? translateDay(day, lang).toLowerCase();
  }
  const mapRu: Record<string, string> = {
    Среда: "среду",
    Пятница: "пятницу",
    Суббота: "субботу",
  };
  return mapRu[day] ?? day.toLowerCase();
};

export const translateMeal = (meal: string, lang: LanguageCode): string =>
  MEAL_LABELS[meal]?.[lang] ?? meal;

export const translateCategory = (
  category: string,
  lang: LanguageCode,
): string => CATEGORY_LABELS[category]?.[lang] ?? category;
