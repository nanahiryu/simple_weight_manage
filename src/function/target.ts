import { addDoc, collection, doc, getDocs, setDoc } from '@firebase/firestore';

import { TargetConverter } from '@/converter/target';
import { firestore } from '@/firebase/client';
import { Target } from '@/types/target';

export const fetchTargetList = async (userId: string) => {
  const _targetRef = collection(firestore, `users/${userId}/targets`).withConverter(TargetConverter);
  const _targetSnapshot = await getDocs(_targetRef);
  const _targetList = _targetSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _targetList;
};

export const createTarget = async (userId: string, target: Target) => {
  const _targetRef = collection(firestore, `users/${userId}/targets`).withConverter(TargetConverter);
  await addDoc(_targetRef, target);
};

export const updateTarget = async (userId: string, target: Target) => {
  const _targetRef = doc(firestore, `users/${userId}/targets/${target.id}`).withConverter(TargetConverter);
  await setDoc(_targetRef, target);
};
