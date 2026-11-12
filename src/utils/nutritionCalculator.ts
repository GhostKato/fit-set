export interface ItemMacros {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

interface MacroPer100g {
  keywords: string[];
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

const FOOD_DATABASE: MacroPer100g[] = [
  {
    keywords: ["гречк", "греча"],
    calories: 313,
    protein: 12.6,
    fats: 3.3,
    carbs: 62,
  },
  { keywords: ["рис"], calories: 344, protein: 6.7, fats: 0.7, carbs: 78.9 },
  {
    keywords: ["овсян", "геркулес"],
    calories: 342,
    protein: 12.3,
    fats: 6.1,
    carbs: 59.5,
  },
  {
    keywords: ["макарон", "паста", "спагетти"],
    calories: 344,
    protein: 10.4,
    fats: 1.1,
    carbs: 71.5,
  },
  { keywords: ["картоф"], calories: 77, protein: 2, fats: 0.4, carbs: 16.3 },
  {
    keywords: ["курин", "куриц", "филе", "грудк"],
    calories: 113,
    protein: 23.6,
    fats: 1.9,
    carbs: 0.4,
  },
  { keywords: ["индейк"], calories: 115, protein: 21.6, fats: 2.2, carbs: 0 },
  { keywords: ["говядин"], calories: 187, protein: 18.9, fats: 12.4, carbs: 0 },
  {
    keywords: ["яйц", "яиц"],
    calories: 157,
    protein: 12.7,
    fats: 11.5,
    carbs: 0.7,
  },
  { keywords: ["творог"], calories: 121, protein: 17.2, fats: 5, carbs: 1.8 },
  {
    keywords: ["лосос", "семг", "форел", "рыб"],
    calories: 208,
    protein: 20,
    fats: 13,
    carbs: 0,
  },
  { keywords: ["тунец"], calories: 132, protein: 29, fats: 1, carbs: 0 },
  {
    keywords: ["орех", "миндал", "грецк", "кешью", "фундук"],
    calories: 600,
    protein: 18,
    fats: 53,
    carbs: 15,
  },
  { keywords: ["авокадо"], calories: 160, protein: 2, fats: 14.7, carbs: 1.8 },
  {
    keywords: ["масло", "оливков"],
    calories: 884,
    protein: 0,
    fats: 100,
    carbs: 0,
  },
  { keywords: ["банан"], calories: 96, protein: 1.5, fats: 0.5, carbs: 21 },
  { keywords: ["яблок"], calories: 47, protein: 0.4, fats: 0.4, carbs: 9.8 },
  {
    keywords: [
      "овощ",
      "огур",
      "помидор",
      "томат",
      "салат",
      "капуст",
      "брокколи",
    ],
    calories: 25,
    protein: 1.5,
    fats: 0.2,
    carbs: 4.5,
  },
  { keywords: ["протеин"], calories: 380, protein: 78, fats: 5, carbs: 6 },
  { keywords: ["молок"], calories: 52, protein: 2.8, fats: 2.5, carbs: 4.7 },
  {
    keywords: ["кефир", "йогурт"],
    calories: 56,
    protein: 3,
    fats: 2.5,
    carbs: 4,
  },
  {
    keywords: ["хлеб", "хлебц"],
    calories: 250,
    protein: 8,
    fats: 2,
    carbs: 48,
  },
];

const parseGrams = (portion: string): number => {
  if (!portion) return 0;

  const normalized = portion.toLowerCase().replace(",", ".");
  const rangeMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/,
  );
  if (rangeMatch) {
    return (Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2;
  }

  const singleMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!singleMatch) return 0;

  const value = Number(singleMatch[1]);
  if (normalized.includes("шт") || normalized.includes("яйц")) {
    return value * 55;
  }
  if (normalized.includes("ст. л") || normalized.includes("ложк")) {
    return value * 15;
  }

  return value;
};

export const calculateItemMacros = (
  title: string,
  portion: string,
): ItemMacros | null => {
  const grams = parseGrams(portion);
  if (!grams) return null;

  const lowerTitle = title.toLowerCase();
  const matched = FOOD_DATABASE.find((entry) =>
    entry.keywords.some((kw) => lowerTitle.includes(kw)),
  );

  if (!matched) return null;

  const factor = grams / 100;
  return {
    calories: Math.round(matched.calories * factor),
    protein: Math.round(matched.protein * factor * 10) / 10,
    fats: Math.round(matched.fats * factor * 10) / 10,
    carbs: Math.round(matched.carbs * factor * 10) / 10,
  };
};
