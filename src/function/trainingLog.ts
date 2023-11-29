import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import { TrainingLogConverter } from '@/converter/trainingLog';
import { firestore } from '@/firebase/client';
import { TrainingLog } from '@/types/trainingLog';

export const fetchTrainingLogList = async (userId: string): Promise<TrainingLog[]> => {
  const _trainingLogRef = collection(firestore, `users/${userId}/trainingLogs`).withConverter(TrainingLogConverter);
  const _trainingLogSnapshot = await getDocs(_trainingLogRef);
  const _trainingLogList = _trainingLogSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _trainingLogList;
};

export const createTrainingLog = async (userId: string, trainingLog: TrainingLog) => {
  const _trainingLogRef = collection(firestore, `users/${userId}/trainingLogs`).withConverter(TrainingLogConverter);
  await addDoc(_trainingLogRef, trainingLog);
};

export const updateTrainingLog = async (userId: string, trainingLog: TrainingLog) => {
  const _trainingLogRef = doc(firestore, `users/${userId}/trainingLogs/${trainingLog.id}`).withConverter(
    TrainingLogConverter,
  );
  await setDoc(_trainingLogRef, trainingLog);
};

export const deleteTrainingLog = async (userId: string, trainingLogId: string) => {
  const _trainingLogRef = doc(firestore, `users/${userId}/trainingLogs/${trainingLogId}`);
  await deleteDoc(_trainingLogRef);
};
