import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { WeighLog } from '@/types/weighLog';

export const WeighLogConverter: FirestoreDataConverter<WeighLog> = {
  toFirestore(weighLog: WeighLog): DocumentData {
    return {
      id: weighLog.id,
      weight: weighLog.weight,
      fatPercentage: weighLog.fatPercentage,
      weighDate: weighLog.weighDate,
      createdAt: weighLog.createdAt,
      updatedAt: weighLog.updatedAt,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: data.id as string,
      weight: data.weight as number,
      fatPercentage: data.fatPercentage as number,
      weighDate: data.weighDate as number,
      createdAt: data.createdAt as number,
      updatedAt: data.updatedAt as number,
    };
  },
};
