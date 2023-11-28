import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import { TrainingTemplateConverter } from '@/converter/trainingTemplate';
import { firestore } from '@/firebase/client';
import { TrainingTemplate } from '@/types/trainingTemplate';
import { trainingTemplateSeedList } from '@/seed/trainingTemplate';

export const fetchTrainingTemplateList = async (userId: string) => {
  const _trainingTemplateRef = collection(firestore, `users/${userId}/trainingTemplates`).withConverter(
    TrainingTemplateConverter,
  );
  const _trainingTemplateSnapshot = await getDocs(_trainingTemplateRef);

  const _trainingTemplateList = _trainingTemplateSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _trainingTemplateList;
};

export const createTrainingTemplate = async (userId: string, trainingTemplate: TrainingTemplate) => {
  const _trainingTemplateRef = collection(firestore, `users/${userId}/trainingTemplates`).withConverter(
    TrainingTemplateConverter,
  );
  await addDoc(_trainingTemplateRef, trainingTemplate);
};

export const updateTrainingTemplate = async (userId: string, trainingTemplate: TrainingTemplate) => {
  const _trainingTemplateRef = doc(firestore, `users/${userId}/trainingTemplates/${trainingTemplate.id}`).withConverter(
    TrainingTemplateConverter,
  );
  await setDoc(_trainingTemplateRef, trainingTemplate);
};

export const deleteTrainingTemplate = async (userId: string, trainingTemplateId: string) => {
  const _trainingTemplateRef = doc(firestore, `users/${userId}/trainingTemplates/${trainingTemplateId}`);
  await deleteDoc(_trainingTemplateRef);
};

export const insertSeedTrainingTemplate = async (userId: string) => {
  for (const trainingTemplate of trainingTemplateSeedList) {
    const _trainingTemplateRef = doc(
      firestore,
      `users/${userId}/trainingTemplates/${trainingTemplate.id}`,
    ).withConverter(TrainingTemplateConverter);
    await setDoc(_trainingTemplateRef, trainingTemplate);
  }
};
