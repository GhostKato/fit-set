import type { LanguageCode } from "../context/LanguageContext";
import { translateShortDay } from "../i18n";

const WEEK_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const isSpecificWeekDay = (day?: string): day is string =>
  Boolean(day && WEEK_DAYS.includes(day));

export const getOrderForContext = (
  orders: Record<string, number>,
  days: string[],
  activeDay?: string,
): number => {
  if (isSpecificWeekDay(activeDay) && orders[activeDay] !== undefined) {
    return orders[activeDay];
  }
  const firstDay = days[0];
  return firstDay && orders[firstDay] !== undefined ? orders[firstDay] : 1;
};

export const areAllOrdersEqual = (
  orders: Record<string, number>,
  days: string[],
): boolean => {
  if (days.length <= 1) return true;
  const firstVal = orders[days[0]] ?? 1;
  return days.every((d) => (orders[d] ?? firstVal) === firstVal);
};

export const formatCardOrder = (
  orders: Record<string, number>,
  days: string[],
  activeDay?: string,
  lang: LanguageCode = "ua",
): string => {
  if (isSpecificWeekDay(activeDay)) {
    return `№${orders[activeDay] ?? 1}`;
  }

  if (days.length === 1 || areAllOrdersEqual(orders, days)) {
    const firstDay = days[0];
    return `№${firstDay ? (orders[firstDay] ?? 1) : 1}`;
  }

  return days
    .map((d) => `${translateShortDay(d, lang)} №${orders[d] ?? 1}`)
    .join(", ");
};
