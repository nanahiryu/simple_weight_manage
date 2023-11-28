import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { BodyPart } from '@/types/bodyPart';

export const BodyPartConverter: FirestoreDataConverter<BodyPart> = {
  toFirestore(bodyPart: BodyPart): DocumentData {
    const _newDoc: Partial<BodyPart> = { ...bodyPart };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name as string,
      color: data.color as string,
    };
  },
};
