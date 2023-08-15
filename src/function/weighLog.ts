import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { firestore } from '@/firebase/client';
import { WeighLogConverter } from '@/converter/weighLog';
import { WeighLog } from '@/types/weighLog';

export const fetchWeighLogList = async (userId: string) => {
  const _weighLogRef = collection(firestore, `users/${userId}/weighLogs`).withConverter(WeighLogConverter);
  const _weighLogSnapshot = await getDocs(_weighLogRef);

  const _weighLogList = _weighLogSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _weighLogList;
};

export const createWeighLog = async (userId: string, weighLog: WeighLog) => {
  const _weighLogRef = collection(firestore, `users/${userId}/weighLogs`).withConverter(WeighLogConverter);
  await addDoc(_weighLogRef, weighLog);
};

export const updateWeighLog = async (userId: string, weighLog: WeighLog) => {
  const _weighLogRef = doc(firestore, `users/${userId}/weighLogs/${weighLog.id}`).withConverter(WeighLogConverter);
  await setDoc(_weighLogRef, weighLog);
};
