export interface TrainingLog {
  id: string;
  name: string;
  description: string;
  trainingDate: number;
  exerciseMenuList: ExerciseMenu[];
}

export interface ExerciseMenu {
  exerciseId: string;
  load: number;
  reps: number;
  sets: number;
}
