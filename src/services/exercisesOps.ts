import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Exercise, NewExercise } from "../types/exercise";
import { DEFAULT_EXERCISES } from "../data/defaultExercises";

export const fetchUserExercises = async (): Promise<Exercise[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const q = query(collection(db, "exercises"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<Exercise, "id">),
  }));
};

export const createExercise = async (data: NewExercise): Promise<Exercise> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Пользователь не авторизован");

  const newDoc = { ...data, userId };
  const docRef = await addDoc(collection(db, "exercises"), newDoc);
  return { id: docRef.id, ...newDoc };
};

export const updateExercise = async (
  id: string,
  fields: Partial<NewExercise>,
): Promise<void> => {
  const docRef = doc(db, "exercises", id);
  await updateDoc(docRef, fields);
};

export const deleteExercise = async (id: string): Promise<void> => {
  const docRef = doc(db, "exercises", id);
  await deleteDoc(docRef);
};

export const seedDefaultExercisesToDb = async (): Promise<Exercise[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Пользователь не авторизован");

  const batch = writeBatch(db);
  const createdItems: Exercise[] = [];

  DEFAULT_EXERCISES.forEach((item) => {
    const docRef = doc(collection(db, "exercises"));
    const fullItem = { ...item, userId };
    batch.set(docRef, fullItem);
    createdItems.push({ id: docRef.id, ...fullItem });
  });

  await batch.commit();
  return createdItems;
};
