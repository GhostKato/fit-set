import type { LanguageCode } from "../context/LanguageContext";
import { translateShortDay } from "../i18n";
import type { WeekDay } from "../types/exercise";

export const WEEK_DAYS: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const isSpecificWeekDay = (day?: string): day is WeekDay =>
  Boolean(day && WEEK_DAYS.includes(day as WeekDay));

export const getOrderForContext = (
  orders: Partial<Record<WeekDay, number>>,
  days: WeekDay[],
  activeDay?: string,
): number => {
  if (isSpecificWeekDay(activeDay) && orders[activeDay] !== undefined) {
    return orders[activeDay] ?? 1;
  }
  const firstDay = days[0];
  return firstDay && orders[firstDay] !== undefined
    ? (orders[firstDay] ?? 1)
    : 1;
};

export const areAllOrdersEqual = (
  orders: Partial<Record<WeekDay, number>>,
  days: WeekDay[],
): boolean => {
  if (days.length <= 1) return true;
  const firstVal = orders[days[0]] ?? 1;
  return days.every((d) => (orders[d] ?? firstVal) === firstVal);
};

export const formatCardOrder = (
  orders: Partial<Record<WeekDay, number>>,
  days: WeekDay[],
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
