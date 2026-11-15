import type { Exercise } from "../types/exercise";

export const getMostFrequentDayTitle = (
  exercises: Exercise[],
  fallback = "Тренировка",
): string => {
  const counts = new Map<string, number>();

  for (const item of exercises) {
    const title = item.dayTitle?.trim();
    if (!title) continue;
    counts.set(title, (counts.get(title) ?? 0) + 1);
  }

  let bestTitle = fallback;
  let maxCount = 0;

  for (const [title, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      bestTitle = title;
    }
  }

  return bestTitle;
};
