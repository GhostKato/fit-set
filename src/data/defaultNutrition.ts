import type { LanguageCode } from "../context/LanguageContext";
import type { NewNutritionItem } from "../types/nutrition";

const DEFAULT_NUTRITION_BY_LANG: Record<LanguageCode, NewNutritionItem[]> = {
  ua: [
    // SIMPLE CARBS
    {
      category: "simple_carbs",
      title: "Піца",
      portion: "2 шматочки.",
      note: "На свята в обід (складні вуглеводи та жири тоді 0 г).",
      order: 1,
    },
    {
      category: "simple_carbs",
      title: "Роли",
      portion: "8 штук.",
      note: "На свята в обід (складні вуглеводи та жири тоді 0 г).",
      order: 2,
    },

    // COMPLEX CARBS
    {
      category: "complex_carbs",
      title: "Гречка",
      portion: "120–130 г (4 ст. л. без гірки, готової).",
      note: "Для сніданку та обіду.",
      order: 3,
    },
    {
      category: "complex_carbs",
      title: "Вівсянка (тривалого варіння, із цільного зерна, не пластівці).",
      portion: "120–130 г готової.",
      note: "Для сніданку.",
      order: 4,
    },
    {
      category: "complex_carbs",
      title: "Правильний суп",
      portion: "",
      note: "Легкий курячий бульйон + овочі.",
      order: 5,
    },
    {
      category: "complex_carbs",
      title: "Без складних вуглеводів",
      portion: "0 г.",
      note: "Якщо жирна їжа, сирний десерт, соус з йогуртом або в обід прості вуглеводи.",
      order: 6,
    },

    // PROTEIN
    {
      category: "protein",
      title: "Курка",
      portion: "100–110 г (шматок з долоню без пальців).",
      note: "З духовки, варена або консервована у власному соку.",
      order: 7,
    },
    {
      category: "protein",
      title: "Риба",
      portion: "100–110 г (шматок з долоню без пальців).",
      note: "З духовки, варена або консервована у власному соку.",
      order: 8,
    },
    {
      category: "protein",
      title: "Курячі білки",
      portion: "4 шт.",
      note: "Без жовтка.",
      order: 9,
    },

    // FATS
    {
      category: "fats",
      title: "Без жирів",
      portion: "0 г.",
      note: "Якщо жирна їжа, сирний десерт, соус з йогуртом або в обід прості вуглеводи.",
      order: 10,
    },
    {
      category: "fats",
      title: "Оливкова олія Extra Virgin",
      portion: "10 г (1 ст. л.) на сніданок / 5 г (1 ч. л.) на обід.",
      note: "Рослинна, нерафінована.",
      order: 11,
    },
    {
      category: "fats",
      title: "Курячі жовтки",
      portion: "2 шт. на сніданок / 1 шт. на обід.",
      note: "Без білків.",
      order: 12,
    },
    {
      category: "fats",
      title: "Оливкова олія Extra Virgin + 1 жовток",
      portion: "5 г (1 ч. л.) + 1 шт.",
      note: "",
      order: 13,
    },

    // FIBER
    {
      category: "fiber",
      title: "Свіжі овочі (огірки, морква, редис та листя салату)",
      portion: "150–200 г (розмір 2 кулаків)",
      note: "",
      order: 14,
    },
    {
      category: "fiber",
      title: "Гриби",
      portion: "100–150 г (4–5 ст. л. з гіркою).",
      note: "У духовці або на сковорідці.",
      order: 15,
    },
    {
      category: "fiber",
      title: "Консервований зелений горошок або кукурудза (без цукру)",
      portion: "4–5 ст. л. (у суп або до м'яса).",
      note: "Тоді кашу в цей прийом не їмо.",
      order: 16,
    },

    // SAUCES
    {
      category: "sauce",
      title: "Томатний соус",
      portion: "За смаком",
      note: "Не можна тільки на вечерю. 2 ст. л. томатної пасти (суворо без цукру та рослинної олії у складі!), стевія, 2–3 ст. л. теплої води (для регулювання густоти), спеції за смаком: сушений або свіжий часник, базилік, орегано, копчена паприка, дрібка перцю.",
      order: 17,
    },
    {
      category: "sauce",
      title: "Білий часниковий соус",
      portion: "За смаком",
      note: "Не можна, якщо жирна їжа, сирний десерт або в обід прості вуглеводи.",
      order: 18,
    },
    {
      category: "sauce",
      title: "Ніжний рожевий соус",
      portion: "За смаком",
      note: "Не можна, якщо жирна їжа, сирний десерт або в обід прості вуглеводи.",
      order: 19,
    },

    // DESSERTS
    {
      category: "dessert",
      title:
        "Один фрукт (яблуко, половина грейпфрута, ківі, 3–4 ягоди великої полуниці)",
      portion: "1 шт. (одразу після їжі)",
      note: "",
      order: 20,
    },
    {
      category: "dessert",
      title:
        "Сирний десерт (кисломолочний сир до 5% + білий йогурт 1.6% + стевія + 1 ч. л. кориці + ківі)",
      portion:
        "120–130 г сиру (4 ст. л. без гірки) + 30–40 г йогурту (2 ст. л.)",
      note: "Одразу після їжі. Не можна, якщо жирна їжа, соус з йогуртом або в обід прості вуглеводи.",
      order: 21,
    },
    {
      category: "dessert",
      title: "Чай + стевія + 2 кубики чорного шоколаду від 70%",
      portion: "2 кубики (одразу після їжі)",
      note: "",
      order: 22,
    },
    {
      category: "dessert",
      title:
        "Чай + стевія + 2 печива «Марія» або 1 вівсяне (без цукру та білого борошна)",
      portion: "1–2 шт. (одразу після їжі)",
      note: "",
      order: 23,
    },
  ],
  ru: [
    // SIMPLE CARBS
    {
      category: "simple_carbs",
      title: "Пицца",
      portion: "2 кусочка.",
      note: "По праздникам в обед (сложные углеводы и жиры тогда 0 г).",
      order: 1,
    },
    {
      category: "simple_carbs",
      title: "Роллы",
      portion: "8 штук.",
      note: "По праздникам в обед (сложные углеводы и жиры тогда 0 г).",
      order: 2,
    },

    // COMPLEX CARBS
    {
      category: "complex_carbs",
      title: "Гречка",
      portion: "120–130 г (4 с. л. без горки, готовой).",
      note: "Для завтрака и обеда.",
      order: 3,
    },
    {
      category: "complex_carbs",
      title: "Овсянка (длительной варки, из цельного зерна, не хлопья).",
      portion: "120–130 г готовой.",
      note: "Для завтрака.",
      order: 4,
    },
    {
      category: "complex_carbs",
      title: "Правильный суп",
      portion: "",
      note: "Легкий куриный бульон + овощи.",
      order: 5,
    },
    {
      category: "complex_carbs",
      title: "Без сложных углеводов",
      portion: "0 г.",
      note: "Если жирная еда, творожный десерт, соус с йогуртом, в обед простые углеводы.",
      order: 6,
    },

    // PROTEIN
    {
      category: "protein",
      title: "Курица",
      portion: "100–110 г (кусок с ладонь без пальцев).",
      note: "Из духовки, вареная или консервированная в собственном соку.",
      order: 7,
    },
    {
      category: "protein",
      title: "Рыба",
      portion: "100–110 г (кусок с ладонь без пальцев).",
      note: "Из духовки, вареная или консервированная в собственном соку.",
      order: 8,
    },
    {
      category: "protein",
      title: "Куриные белки",
      portion: "4 шт.",
      note: "Без желтка.",
      order: 9,
    },

    // FATS
    {
      category: "fats",
      title: "Без жиров",
      portion: "0 г.",
      note: "Если жирная еда, творожный десерт, соус с йогуртом или в обед простые углеводы.",
      order: 10,
    },
    {
      category: "fats",
      title: "Оливковое масло Extra Virgin",
      portion: "10 г (1 с. л.) на завтрак / 5 г (1 ч. л.) на обед.",
      note: "Растительное, нерафинированное.",
      order: 11,
    },
    {
      category: "fats",
      title: "Куриные желтки",
      portion: "2 шт. на завтрак / 1 шт. на обед.",
      note: "Без белков.",
      order: 12,
    },
    {
      category: "fats",
      title: "Оливковое масло Extra Virgin + 1 желток",
      portion: "5 г (1 ч. л.) + 1 шт.",
      note: "",
      order: 13,
    },

    // FIBER
    {
      category: "fiber",
      title: "Свежие овощи (огурцы, морковь, редис и листья салата)",
      portion: "150–200 г (размер 2 кулаков)",
      note: "",
      order: 14,
    },
    {
      category: "fiber",
      title: "Грибы",
      portion: "100–150 г (4–5 с. л. с горкой.)",
      note: "В духовке или на сковородке.",
      order: 15,
    },
    {
      category: "fiber",
      title: "Консервированный зеленый горошек или кукуруза (без сахара)",
      portion: "4–5 с. л. (в суп или к мясу).",
      note: "Тогда кашу в этот прием не едим.",
      order: 16,
    },

    // SAUCES
    {
      category: "sauce",
      title: "Томатный соус",
      portion: "По вкусу",
      note: "Нельзя только на ужин. 2 ст. л. томатной пасты (строго без сахара и растительного масла в составе!), стевия, 2–3 ст. л. теплой воды (для регулирования густоты), специи по вкусу: сушеный или свежий чеснок, базилик, орегано, копченая паприка, щепотка перца.",
      order: 17,
    },
    {
      category: "sauce",
      title: "Белый чесночный соус",
      portion: "По вкусу",
      note: "Нельзя, если жирная еда, творожный десерт или в обед простые углеводы.",
      order: 18,
    },
    {
      category: "sauce",
      title: "Нежный розовый соус",
      portion: "По вкусу",
      note: "Нельзя, если жирная еда, творожный десерт или в обед простые углеводы.",
      order: 19,
    },

    // DESSERTS
    {
      category: "dessert",
      title:
        "Один фрукт (яблоко, половина грейпфрута, киви, 3–4 ягоды крупной клубники)",
      portion: "1 шт. (сразу после еды)",
      note: "",
      order: 20,
    },
    {
      category: "dessert",
      title:
        "Творожный десерт (творог до 5% + белый йогурт 1.6% + стевия + 1 ч. л. корицы + киви)",
      portion:
        "120–130 г творога (4 с. л. без горки) + 30–40 г йогурта (2 с. л.)",
      note: "Сразу после еды. Нельзя, если жирная еда, соус с йогуртом или в обед простые углеводы.",
      order: 21,
    },
    {
      category: "dessert",
      title: "Чай + стевия + 2 кубика черного шоколада от 70%",
      portion: "2 кубика (сразу после еды)",
      note: "",
      order: 22,
    },
    {
      category: "dessert",
      title:
        "Чай + стевия + 2 печенья «Мария» или 1 овсяное (без сахара и белой муки)",
      portion: "1–2 шт. (сразу после еды)",
      note: "",
      order: 23,
    },
  ],
  en: [
    // SIMPLE CARBS
    {
      category: "simple_carbs",
      title: "Pizza",
      portion: "2 slices.",
      note: "On holidays for lunch (complex carbs and fats are 0 g then).",
      order: 1,
    },
    {
      category: "simple_carbs",
      title: "Sushi rolls",
      portion: "8 pieces.",
      note: "On holidays for lunch (complex carbs and fats are 0 g then).",
      order: 2,
    },

    // COMPLEX CARBS
    {
      category: "complex_carbs",
      title: "Buckwheat",
      portion: "120–130 g (4 level tbsp, cooked).",
      note: "For breakfast and lunch.",
      order: 3,
    },
    {
      category: "complex_carbs",
      title: "Oatmeal (steel-cut / whole grain, not instant flakes)",
      portion: "120–130 g cooked.",
      note: "For breakfast.",
      order: 4,
    },
    {
      category: "complex_carbs",
      title: "Light chicken & vegetable soup",
      portion: "",
      note: "Light chicken broth + vegetables.",
      order: 5,
    },
    {
      category: "complex_carbs",
      title: "No complex carbs",
      portion: "0 g.",
      note: "When eating fatty food, cottage cheese dessert, yogurt sauce, or simple carbs at lunch.",
      order: 6,
    },

    // PROTEIN
    {
      category: "protein",
      title: "Chicken",
      portion: "100–110 g (palm-sized piece excluding fingers).",
      note: "Baked, boiled, or canned in its own juice.",
      order: 7,
    },
    {
      category: "protein",
      title: "Fish",
      portion: "100–110 g (palm-sized piece excluding fingers).",
      note: "Baked, boiled, or canned in its own juice.",
      order: 8,
    },
    {
      category: "protein",
      title: "Egg whites",
      portion: "4 pcs.",
      note: "Without yolks.",
      order: 9,
    },

    // FATS
    {
      category: "fats",
      title: "No added fats",
      portion: "0 g.",
      note: "When eating fatty food, cottage cheese dessert, yogurt sauce, or simple carbs at lunch.",
      order: 10,
    },
    {
      category: "fats",
      title: "Extra Virgin Olive Oil",
      portion: "10 g (1 tbsp) at breakfast / 5 g (1 tsp) at lunch.",
      note: "Cold-pressed, unrefined.",
      order: 11,
    },
    {
      category: "fats",
      title: "Egg yolks",
      portion: "2 pcs at breakfast / 1 pc at lunch.",
      note: "Without egg whites.",
      order: 12,
    },
    {
      category: "fats",
      title: "Extra Virgin Olive Oil + 1 egg yolk",
      portion: "5 g (1 tsp) + 1 pc.",
      note: "",
      order: 13,
    },

    // FIBER
    {
      category: "fiber",
      title: "Fresh vegetables (cucumbers, carrots, radish, lettuce)",
      portion: "150–200 g (size of 2 fists)",
      note: "",
      order: 14,
    },
    {
      category: "fiber",
      title: "Mushrooms",
      portion: "100–150 g (4–5 heaped tbsp).",
      note: "Oven-baked or pan-seared.",
      order: 15,
    },
    {
      category: "fiber",
      title: "Canned green peas or sweet corn (sugar-free)",
      portion: "4–5 tbsp (in soup or with meat).",
      note: "Skip porridge in this meal if chosen.",
      order: 16,
    },

    // SAUCES
    {
      category: "sauce",
      title: "Tomato sauce",
      portion: "To taste",
      note: "Avoid at dinner only. 2 tbsp tomato paste (strictly no sugar or vegetable oil in ingredients!), stevia, 2–3 tbsp warm water (to adjust thickness), spices to taste: dried or fresh garlic, basil, oregano, smoked paprika, pinch of pepper.",
      order: 17,
    },
    {
      category: "sauce",
      title: "White garlic sauce",
      portion: "To taste",
      note: "Avoid if eating fatty food, cottage cheese dessert, or simple carbs at lunch.",
      order: 18,
    },
    {
      category: "sauce",
      title: "Mild pink sauce",
      portion: "To taste",
      note: "Avoid if eating fatty food, cottage cheese dessert, or simple carbs at lunch.",
      order: 19,
    },

    // DESSERTS
    {
      category: "dessert",
      title:
        "One fruit (apple, half grapefruit, kiwi, or 3–4 large strawberries)",
      portion: "1 pc (right after a meal)",
      note: "",
      order: 20,
    },
    {
      category: "dessert",
      title:
        "Cottage cheese dessert (low-fat cottage cheese up to 5% + plain yogurt 1.6% + stevia + 1 tsp cinnamon + kiwi)",
      portion:
        "120–130 g cottage cheese (4 level tbsp) + 30–40 g yogurt (2 tbsp)",
      note: "Right after a meal. Avoid if eating fatty food, yogurt sauce, or simple carbs at lunch.",
      order: 21,
    },
    {
      category: "dessert",
      title: "Tea + stevia + 2 squares of dark chocolate (70%+)",
      portion: "2 squares (right after a meal)",
      note: "",
      order: 22,
    },
    {
      category: "dessert",
      title:
        "Tea + stevia + 2 Maria biscuits or 1 oatmeal cookie (no sugar or white flour)",
      portion: "1–2 pcs (right after a meal)",
      note: "",
      order: 23,
    },
  ],
};

export const getDefaultNutritionItems = (
  lang: LanguageCode = "ua",
): NewNutritionItem[] =>
  DEFAULT_NUTRITION_BY_LANG[lang] ?? DEFAULT_NUTRITION_BY_LANG.ua;
