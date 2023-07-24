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
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const loginWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password).catch((error) => {
    console.error('ERROR', error);
  });
};

// サインアップ
export const signupWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  const _userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return _userCredential;
};

export const logout = (): Promise<void> => {
  return signOut(auth);
};
