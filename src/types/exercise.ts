export const LOAD_TYPE = {
  weight: '重量',
  distance: '距離',
  time: '時間',
};

export type LoadType = keyof typeof LOAD_TYPE;

export const LoadTypeList = Object.entries(LOAD_TYPE).map(([name, displayName]) => ({
  name: name as LoadType,
  displayName,
}));

export const displayLoadType = (name: string): (typeof LOAD_TYPE)[LoadType] | '' => {
  const loadType = LoadTypeList.find((loadType) => loadType.name === name);
  if (loadType) return loadType.displayName;
  return '';
};

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
