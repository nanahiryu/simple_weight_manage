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

export const displayLoadTypeUnit = (name: string): string => {
  switch (name) {
    case 'weight':
      return 'kg';
    case 'distance':
      return 'km';
    case 'time':
      return 'min';
    default:
      return '';
  }
};
