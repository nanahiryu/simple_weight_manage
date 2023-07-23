import { Target } from '@/types/target';

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  targetList: Target[];
};
