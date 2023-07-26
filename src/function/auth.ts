import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../firebase/client';

export const loginWithGoogle = (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  } catch (e) {
    const error = e as Error;
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const _userCredential = await signInWithEmailAndPassword(auth, email, password);
    return _userCredential;
  } catch (e) {
    const error = e as Error;
    throw error;
  }
};

// サインアップ
export const signupWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const _userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return _userCredential;
  } catch (e) {
    const error = e as Error;
    throw error;
  }
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};
