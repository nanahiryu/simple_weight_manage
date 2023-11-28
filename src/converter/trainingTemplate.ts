import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { TrainingTemplate } from './../types/trainingTemplate';
export const TrainingTemplateConverter: FirestoreDataConverter<TrainingTemplate> = {
  toFirestore(trainingTemplate: TrainingTemplate): DocumentData {
    const _newDoc: Partial<TrainingTemplate> = { ...trainingTemplate };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name as string,
      description: data.description as string,
      exerciseIdList: data.exerciseIdList as string[],
    };
  },
};
