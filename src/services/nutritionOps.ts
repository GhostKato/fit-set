import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type {
  NutritionItem,
  NewNutritionItem,
  MealSchedule,
  DailyMealSelection,
} from "../types/nutrition";
import { DEFAULT_NUTRITION_ITEMS } from "../data/defaultNutrition";

const COLLECTION_NAME = "nutrition";
const DAILY_COLLECTION = "dailyNutrition";
const SCHEDULE_COLLECTION = "nutritionSchedule";

export const DEFAULT_MEAL_SCHEDULE: MealSchedule = {
  Завтрак: "8.00 – 9.00",
  Обед: "13.00 – 14.00",
  Ужин: "18.00 – 19.00",
};

export const EMPTY_DAILY_SELECTION: DailyMealSelection = {
  Завтрак: [],
  Обед: [],
  Ужин: [],
};

const getTodayDocId = (userId: string) => {
  const today = new Date().toISOString().split("T");
  return `${userId}_${today}`;
};

export const getNutritionFromDb = async (): Promise<NutritionItem[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", user.uid),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<NutritionItem, "id">),
  }));
};

export const addNutritionToDb = async (
  newItem: NewNutritionItem,
): Promise<NutritionItem> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const itemWithUser = {
    ...newItem,
    userId: user.uid,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), itemWithUser);
  return {
    id: docRef.id,
    ...itemWithUser,
  };
};

export const updateNutritionInDb = async (
  id: string,
  fields: Partial<NewNutritionItem>,
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, fields);
};

export const deleteNutritionFromDb = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const seedDefaultNutritionToDb = async (): Promise<NutritionItem[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const batch = writeBatch(db);
  const createdItems: NutritionItem[] = [];

  DEFAULT_NUTRITION_ITEMS.forEach((item) => {
    const docRef = doc(collection(db, COLLECTION_NAME));
    const fullItem = { ...item, userId: user.uid };
    batch.set(docRef, fullItem);
    createdItems.push({ id: docRef.id, ...fullItem });
  });

  await batch.commit();
  return createdItems;
};

export const getTodaySelectionFromDb =
  async (): Promise<DailyMealSelection> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Пользователь не авторизован");

    const docRef = doc(db, DAILY_COLLECTION, getTodayDocId(user.uid));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as { selection?: DailyMealSelection };
      return {
        ...EMPTY_DAILY_SELECTION,
        ...(data.selection ?? {}),
      };
    }
    return EMPTY_DAILY_SELECTION;
  };

export const saveTodaySelectionToDb = async (
  selection: DailyMealSelection,
): Promise<DailyMealSelection> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const docRef = doc(db, DAILY_COLLECTION, getTodayDocId(user.uid));
  await setDoc(docRef, {
    userId: user.uid,
    date: new Date().toISOString().split("T"),
    selection,
  });

  return selection;
};

export const getMealScheduleFromDb = async (): Promise<MealSchedule> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const docRef = doc(db, SCHEDULE_COLLECTION, user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as { schedule?: MealSchedule };
    return { ...DEFAULT_MEAL_SCHEDULE, ...(data.schedule ?? {}) };
  }
  return DEFAULT_MEAL_SCHEDULE;
};

export const saveMealScheduleToDb = async (
  schedule: MealSchedule,
): Promise<MealSchedule> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Пользователь не авторизован");

  const docRef = doc(db, SCHEDULE_COLLECTION, user.uid);
  await setDoc(docRef, {
    userId: user.uid,
    schedule,
  });

  return schedule;
};
