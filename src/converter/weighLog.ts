import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { WeighLog } from '@/types/weighLog';

export const WeighLogConverter: FirestoreDataConverter<WeighLog> = {
  toFirestore(weighLog: WeighLog): DocumentData {
    const _newDoc: Partial<WeighLog> = { ...weighLog };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      weight: data.weight as number,
      fatPercentage: data.fatPercentage as number,
      weighDate: data.weighDate as number,
      createdAt: data.createdAt as number,
      updatedAt: data.updatedAt as number,
    };
  },
};
