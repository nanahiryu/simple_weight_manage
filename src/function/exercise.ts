import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { firestore } from '@/firebase/client';
import { ExerciseConverter } from '@/converter/exercise';
import { Exercise } from '@/types/exercise';
import { exerciseSeedList } from '@/seed/exercise';

export const fetchExerciseList = async (userId: string) => {
  const _exerciseRef = collection(firestore, `users/${userId}/exercises`).withConverter(ExerciseConverter);
  const _exerciseSnapshot = await getDocs(_exerciseRef);

  const _exerciseList = _exerciseSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _exerciseList;
};

export const createExercise = async (userId: string, exercise: Exercise) => {
  const _exerciseRef = collection(firestore, `users/${userId}/exercises`).withConverter(ExerciseConverter);
  await addDoc(_exerciseRef, exercise);
};

export const updateExercise = async (userId: string, exercise: Exercise) => {
  const _exerciseRef = doc(firestore, `users/${userId}/exercises`).withConverter(ExerciseConverter);
  await setDoc(_exerciseRef, exercise);
};

export const insertSeedExercise = async (userId: string) => {
  for (const exercise of exerciseSeedList) {
    const _exerciseRef = doc(firestore, `users/${userId}/exercises/${exercise.id}`).withConverter(ExerciseConverter);
    await setDoc(_exerciseRef, exercise);
  }
};
