export interface Exercise {
  id: string;
  name: string;
  loadType: 'weight' | 'distance' | 'time';
  currentLoad: number;
  currentReps: number;
  currentSets: number;
  currentTrainingDate: number;
  imagePath: string;
  bodyPartsIdList: string[];
  description: string;
}
