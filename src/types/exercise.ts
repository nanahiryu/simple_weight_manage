import { LoadType } from '@/constants/loadType';

export interface Exercise {
  id: string;
  name: string;
  loadType: LoadType;
  currentLoad: number;
  currentReps: number;
  currentSets: number;
  currentTrainingDate: number;
  imagePath: string;
  bodyPartsIdList: string[];
  description: string;
}
