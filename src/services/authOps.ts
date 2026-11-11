import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import type { UserProfile } from "../types/user";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
): Promise<UserProfile> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  return { uid: user.uid, email: user.email, name };
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<UserProfile> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { uid: user.uid, email: user.email, name: user.displayName };
};

export const listenToAuthChanges = (
  onFound: (user: UserProfile) => void,
  onMissing: () => void,
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      onFound({ uid: user.uid, email: user.email, name: user.displayName });
    } else {
      onMissing();
    }
  });
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};
