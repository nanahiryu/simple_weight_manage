import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { ExerciseMenu, TrainingLog } from '@/types/trainingLog';
export const TrainingLogConverter: FirestoreDataConverter<TrainingLog> = {
  toFirestore(trainingLog: TrainingLog): DocumentData {
    const _newDoc: Partial<TrainingLog> = { ...trainingLog };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name as string,
      description: data.description as string,
      trainingDate: data.trainingDate as number,
      exerciseMenuList: data.exerciseMenuList as ExerciseMenu[],
    };
  },
};
