import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { Exercise } from '@/types/exercise';

export const ExerciseConverter: FirestoreDataConverter<Exercise> = {
  toFirestore(exercise: Exercise): DocumentData {
    const _newDoc: Partial<Exercise> = { ...exercise };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name as string,
      loadType: data.loadType as 'weight' | 'distance' | 'time',
      currentLoad: data.currentLoad as number,
      currentReps: data.currentReps as number,
      currentSets: data.currentSets as number,
      currentTrainingDate: data.currentTrainingDate as number,
      imagePath: data.imagePath as string,
      bodyPartsIdList: data.bodyPartsIdList as string[],
      description: data.description as string,
    };
  },
};
