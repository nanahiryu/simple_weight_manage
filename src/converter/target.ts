import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { Target } from '@/types/target';

export const TargetConverter: FirestoreDataConverter<Target> = {
  toFirestore(target: Target): DocumentData {
    const _newDoc: Partial<Target> = { ...target };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type as 'weight' | 'fatPercentage',
      targetValue: data.targetValue as number,
      deadlineDate: data.deadlineDate as number,
      isUpper: data.isUpper as boolean,
    };
  },
};
