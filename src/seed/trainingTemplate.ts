import { TrainingTemplate } from '@/types/trainingTemplate';

import { exerciseSeedList } from './exercise';

export const trainingTemplateSeedList: TrainingTemplate[] = [
  {
    id: 'armTraining',
    name: '腕のトレーニング',
    description: '腕のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('arm'))
      .map((exercise) => exercise.id),
  },
  {
    id: 'chestTraining',
    name: '胸のトレーニング',
    description: '胸のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('chest'))
      .map((exercise) => exercise.id),
  },
  {
    id: 'legTraining',
    name: '脚のトレーニング',
    description: '脚のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('leg'))
      .map((exercise) => exercise.id),
  },
  {
    id: 'backTraining',
    name: '背中のトレーニング',
    description: '背中のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('back'))
      .map((exercise) => exercise.id),
  },
  {
    id: 'shoulderTraining',
    name: '肩のトレーニング',
    description: '肩のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('shoulder'))
      .map((exercise) => exercise.id),
  },
  {
    id: 'stomachTraining',
    name: '腹筋のトレーニング',
    description: '腹筋のトレーニングです。',
    exerciseIdList: exerciseSeedList
      .filter((exercise) => exercise.bodyPartsIdList.includes('stomach'))
      .map((exercise) => exercise.id),
  },
];
