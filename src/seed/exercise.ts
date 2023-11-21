import { Exercise } from '@/types/exercise';

const weightTrainingExerciseBase: Exercise = {
  id: '',
  name: '',
  loadType: 'weight',
  currentLoad: 30,
  currentReps: 10,
  currentSets: 3,
  currentTrainingDate: 0,
  imagePath: 'https://www.fpsa.org/wp-content/uploads/training-concept-image-1.jpg',
  bodyPartsIdList: [],
  description: 'トレーニングに関するメモ',
};

const aerobicExerciseBase: Exercise = {
  id: '',
  name: '',
  loadType: 'distance',
  currentLoad: 10,
  currentReps: 1,
  currentSets: 1,
  currentTrainingDate: 0,
  imagePath: 'https://www.fpsa.org/wp-content/uploads/training-concept-image-1.jpg',
  bodyPartsIdList: ['aerobic'],
  description: 'トレーニングに関するメモ',
};

export const exerciseList: Exercise[] = [
  {
    ...weightTrainingExerciseBase,
    id: 'benchPress',
    name: 'ベンチプレス',
    bodyPartsIdList: ['arm', 'chest'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'squat',
    name: 'スクワット',
    bodyPartsIdList: ['leg'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'deadLift',
    name: 'デッドリフト',
    bodyPartsIdList: ['back'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'shoulderPress',
    name: 'ショルダープレス',
    bodyPartsIdList: ['arm', 'shoulder'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'dumbbellCurl',
    name: 'ダンベルカール',
    bodyPartsIdList: ['arm'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'tricepsExtension',
    name: 'トライセプスエクステンション',
    bodyPartsIdList: ['arm'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'pullUp',
    name: 'プルアップ',
    bodyPartsIdList: ['arm', 'back'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'pushUp',
    name: 'プッシュアップ',
    bodyPartsIdList: ['arm', 'shoulder', 'chest'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'sitUp',
    name: '腹筋',
    bodyPartsIdList: ['stomach'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'dumbbellFly',
    name: 'ダンベルフライ',
    bodyPartsIdList: ['arm', 'chest'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'dumbbellShoulderPress',
    name: 'ダンベルショルダープレス',
    bodyPartsIdList: ['arm', 'shoulder'],
  },
  {
    ...weightTrainingExerciseBase,
    id: 'dumbbellSquat',
    name: 'ダンベルスクワット',
    bodyPartsIdList: ['leg'],
  },
  {
    ...aerobicExerciseBase,
    id: 'run',
    name: 'ランニング',
    bodyPartsIdList: ['aerobic'],
  },
];
