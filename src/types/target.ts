export type Target = {
  id: string;
  type: 'weight' | 'fatPercentage';
  targetValue: number;
  deadlineDate: number;
  isUpper: boolean;
};
