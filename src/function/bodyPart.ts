import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { BodyPartConverter } from '@/converter/bodyPart';
import { firestore } from '@/firebase/client';
import { BodyPart } from '@/types/bodyPart';
import { bodyPartSeedList } from '@/seed/bodyParts';

export const fetchBodyPartList = async (userId: string) => {
  const _bodyPartRef = collection(firestore, `users/${userId}/bodyParts`).withConverter(BodyPartConverter);
  const _bodyPartSnapshot = await getDocs(_bodyPartRef);

  const _bodyPartList = _bodyPartSnapshot.docs.map((doc) => {
    return doc.data();
  });
  return _bodyPartList;
};

export const createBodyPart = async (userId: string, bodyPart: BodyPart) => {
  const _bodyPartRef = collection(firestore, `users/${userId}/bodyParts`).withConverter(BodyPartConverter);
  await addDoc(_bodyPartRef, bodyPart);
};

export const updateBodyPart = async (userId: string, bodyPart: BodyPart) => {
  const _bodyPartRef = doc(firestore, `users/${userId}/bodyParts/${bodyPart.id}`).withConverter(BodyPartConverter);
  await setDoc(_bodyPartRef, bodyPart);
};

export const insertSeedBodyPart = async (userId: string) => {
  for (const bodyPart of bodyPartSeedList) {
    const _bodyPartRef = doc(firestore, `users/${userId}/bodyParts/${bodyPart.id}`).withConverter(BodyPartConverter);
    await setDoc(_bodyPartRef, bodyPart);
  }
};
