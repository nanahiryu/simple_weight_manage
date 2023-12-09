'use client';

import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { MdArrowBack, MdOutlineAdd, MdSearch } from 'react-icons/md';
import { FieldErrors, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

import { fetchBodyPartList } from '@/function/bodyPart';
import { fetchExerciseList } from '@/function/exercise';
import { fetchTrainingTemplateList } from '@/function/trainingTemplate';
import { userAtom } from '@/globalState/user';
import { BodyPart } from '@/types/bodyPart';
import { Exercise } from '@/types/exercise';
import { TrainingTemplate } from '@/types/trainingTemplate';
import { PrimaryButton } from '@/components/buttons';
import { createTrainingLog, findTrainingLogListByDate, updateTrainingLog } from '@/function/trainingLog';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useSuccessToast } from '@/hooks/useSuccessToast';
import TrainingTemplateCard from '@/components/trainingTemplateCard';

import ExerciseMenuCard from './_components/exerciseMenuCard';
import EditRow from '../_components/EditRow';
import EditRowInput from '../_components/EditRowInput';

export interface ExerciseMenuForm {
  exerciseId: string;
  load: number | undefined;
  reps: number | undefined;
  sets: number | undefined;
}

export interface TrainingLogForm {
  id: string;
  name: string;
  description: string;
  exerciseMenuList: ExerciseMenuForm[];
}

const TrainingLogEditPage = () => {
  const user = useAtomValue(userAtom);
  const [trainingTemplateList, setTrainingTemplateList] = useState<TrainingTemplate[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>('all');
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
  const [allExerciseList, setAllExerciseList] = useState<Exercise[]>([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState<Exercise[]>([]);
  const [searchedExerciseList, setSearchedExerciseList] = useState<Exercise[]>([]);
  const [type, setType] = useState<'create' | 'edit'>('create');
  const [tabIndex, setTabIndex] = useState<number>(0);

  const searchParams = useSearchParams();
  const trainingDate = searchParams.get('trainingDate');

  const errorToast = useErrorToast();
  const successToast = useSuccessToast();

  const router = useRouter();

  const useFormMethods = useForm<TrainingLogForm>({
    defaultValues: {
      id: '',
      name: '',
      description: '',
      exerciseMenuList: [],
    },
  });

  const {
    register,
    setError,
    handleSubmit,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useFormMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exerciseMenuList',
  });

  const refetchTrainingLog = async () => {
    if (!user) return;
    const _trainingLog = await findTrainingLogListByDate(user.id, Number(trainingDate));
    if (!_trainingLog) return;
    reset({
      id: _trainingLog.id,
      name: _trainingLog.name,
      description: _trainingLog.description,
      exerciseMenuList: _trainingLog.exerciseMenuList,
    });
    setType('edit');
  };

  const refetchTrainingTemplateList = async () => {
    if (!user) return;
    const _trainingTemplateList = await fetchTrainingTemplateList(user.id);
    setTrainingTemplateList(_trainingTemplateList);
  };

  const refetchBodyPartList = async () => {
    if (!user) return;
    const _bodyPartList = await fetchBodyPartList(user.id);
    setBodyPartList(_bodyPartList);
  };

  const refetchExerciseList = async () => {
    if (!user) return;
    const _exerciseList = await fetchExerciseList(user.id);
    setAllExerciseList(_exerciseList);
  };

  const filterExerciseList = (exerciseList: Exercise[], bodyPartId: string) => {
    if (bodyPartId === 'all') {
      setFilteredExerciseList(exerciseList);
      return;
    }
    const _filteredExerciseList = exerciseList.filter((exercise) => exercise.bodyPartsIdList.includes(bodyPartId));
    setFilteredExerciseList(_filteredExerciseList);
  };

  const searchExerciseList = (exerciseList: Exercise[], text: string) => {
    if (!text) {
      setSearchedExerciseList(filteredExerciseList);
    } else {
      // TODO: あいまい検索
      const _searchedExerciseList = exerciseList.filter((exercise) => exercise.name.includes(text));
      setSearchedExerciseList(_searchedExerciseList);
    }
  };

  const onClickAddExercise = (exerciseId: string) => {
    const exerciseMenu = {
      exerciseId: exerciseId,
      load: undefined,
      reps: undefined,
      sets: undefined,
    } as ExerciseMenuForm;
    append(exerciseMenu);
  };

  const validateIsNaN = (data: TrainingLogForm) => {
    let errorFlag = false;
    data.exerciseMenuList.forEach((exerciseMenu, index) => {
      if (isNaN(exerciseMenu.load as number)) {
        setError(`exerciseMenuList.${index}.load`, {
          type: 'manual',
          message: '負荷には数値を入力してください。',
        });
        errorFlag = true;
      }
      if (isNaN(exerciseMenu.reps as number)) {
        setError(`exerciseMenuList.${index}.reps`, {
          type: 'manual',
          message: '回数には数値を入力してください。',
        });
        errorFlag = true;
      }
      if (isNaN(exerciseMenu.sets as number)) {
        setError(`exerciseMenuList.${index}.sets`, {
          type: 'manual',
          message: 'セットには数値を入力してください。',
        });
        errorFlag = true;
      }
    });
    return errorFlag;
  };

  const onSubmitError = () => {
    const data = getValues();
    data.exerciseMenuList.forEach((exerciseMenu, index) => {
      if (isNaN(exerciseMenu.load as number)) {
        setError(`exerciseMenuList.${index}.load`, {
          type: 'manual',
          message: '負荷には数値を入力してください。',
        });
      }
      if (isNaN(exerciseMenu.reps as number)) {
        setError(`exerciseMenuList.${index}.reps`, {
          type: 'manual',
          message: '回数には数値を入力してください。',
        });
      }
      if (isNaN(exerciseMenu.sets as number)) {
        setError(`exerciseMenuList.${index}.sets`, {
          type: 'manual',
          message: 'セットには数値を入力してください。',
        });
      }
    });
    errorToast({
      title: 'エラーが発生しました',
      description: 'データの保存に失敗しました。',
    });
  };

  const onSubmitTraningLog = handleSubmit(async () => {
    if (!user) return;
    const data = getValues();
    try {
      // data.exerciseMenuListのisNaNバリデーション
      // setErrorしてからthrow error
      const errorFlag = validateIsNaN(data);
      if (errorFlag) {
        throw new Error('入力に誤りがあります。');
      }

      const _newTrainingLog = {
        id: '',
        name: data.name,
        description: data.description,
        trainingDate: Number(trainingDate),
        exerciseMenuList: data.exerciseMenuList.map((exerciseMenu) => ({
          exerciseId: exerciseMenu.exerciseId,
          load: exerciseMenu.load as number,
          reps: exerciseMenu.reps as number,
          sets: exerciseMenu.sets as number,
        })),
      };
      if (type === 'edit') {
        _newTrainingLog.id = data.id;
        await updateTrainingLog(user.id, _newTrainingLog);
      }
      if (type === 'create') {
        await createTrainingLog(user.id, _newTrainingLog);
      }
      successToast({
        title: '保存完了',
        description: 'トレーニングログを保存しました。',
      });
      router.push('/training');
    } catch (e) {
      errorToast({
        title: 'エラーが発生しました',
        description: 'データの保存に失敗しました。',
      });
    }
  }, onSubmitError);

  const copyTemplate = (title: string, exerciseList: Exercise[]) => {
    const _exerciseMenuList = exerciseList.map((exercise) => ({
      exerciseId: exercise.id,
      load: exercise.currentLoad,
      reps: exercise.currentReps,
      sets: exercise.currentSets,
    }));
    reset({
      name: title,
      exerciseMenuList: _exerciseMenuList,
    });
    setTabIndex(0);
  };

  // 各種fetch
  useEffect(() => {
    void refetchExerciseList();
    void refetchBodyPartList();
    void refetchTrainingTemplateList();
  }, [user]);

  // trainingDateが変更されたらtrainingLogをfetch
  useEffect(() => {
    if (!trainingDate) return;
    void refetchTrainingLog();
  }, [trainingDate, user]);

  // bodyPartIdが変更されたらexerciseListをfilter
  useEffect(() => {
    filterExerciseList(allExerciseList, selectedBodyPartId);
  }, [selectedBodyPartId, allExerciseList]);

  // search用
  useEffect(() => {
    const timer = setTimeout(() => {
      searchExerciseList(filteredExerciseList, searchText);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchText, filteredExerciseList]);

  const errorList = errors.exerciseMenuList as unknown as FieldErrors<ExerciseMenuForm>[];

  return (
    <Flex py="40px" px="40px" gap="20px" w="90%" h="full" direction="column">
      <Tabs index={tabIndex} onChange={setTabIndex} colorScheme="teal">
        <Flex align="center" gap="20px">
          <Icon
            as={MdArrowBack as IconType}
            boxSize="24px"
            color="gray.400"
            _hover={{
              cursor: 'pointer',
              color: 'black',
              transition: 'all 0.4s',
            }}
            onClick={() => void router.push('/training')}
          />
          <TabList w="full">
            <Tab>トレーニングログ編集</Tab>
            <Tab>テンプレートからコピー</Tab>
          </TabList>
          <PrimaryButton onClick={() => void onSubmitTraningLog()}>保存</PrimaryButton>
        </Flex>
        <TabPanels>
          <TabPanel>
            <Flex w="full" justify="center" gap="8px">
              <Flex w="50%" direction="column" gap="8px">
                <EditRow label="トレーニング名">
                  <EditRowInput w="full" {...register('name', { required: true })} />
                </EditRow>
                <EditRow label="説明">
                  <EditRowInput w="full" {...register('description')} />
                </EditRow>
                <EditRow label="トレーニング種目の追加">
                  <Flex direction="column" gap="12px" maxW="600px" py="12px">
                    <Flex gap="24px" w="full" wrap="wrap">
                      <Flex align="center" gap="8px">
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">
                          部位
                        </Text>
                        <Select onChange={(e) => setSelectedBodyPartId(e.target.value)} w="160px">
                          <option key="all" value="all">
                            全て
                          </option>
                          {bodyPartList.map((content) => (
                            <option key={content.id} value={content.id}>
                              {content.name}
                            </option>
                          ))}
                        </Select>
                      </Flex>
                      <Flex align="center" gap="8px">
                        <Text fontSize="sm" fontWeight="medium" color="gray.600">
                          あいまい検索
                        </Text>
                        <InputGroup w="200px">
                          <InputLeftElement boxSize="32px">
                            <Icon as={MdSearch as IconType} boxSize="24px" />
                          </InputLeftElement>
                          <Input
                            size="sm"
                            borderRadius="md"
                            w="280px"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                          />
                        </InputGroup>
                      </Flex>
                    </Flex>
                    <Flex wrap="wrap" gap="8px">
                      {searchedExerciseList.map((exercise) => (
                        <Flex
                          key={exercise.id}
                          as="button"
                          pl="4px"
                          pr="8px"
                          border="1px"
                          borderColor="teal.400"
                          borderRadius="md"
                          bg="white"
                          color="teal.400"
                          fontWeight="normal"
                          align="center"
                          _hover={{
                            cursor: 'pointer',
                            bg: 'teal.400',
                            color: 'white',
                          }}
                          onClick={() => onClickAddExercise(exercise.id)}
                        >
                          <Icon as={MdOutlineAdd as IconType} boxSize="20px" />
                          {exercise.name}
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>
                </EditRow>
              </Flex>
              <Flex w="50%">
                <EditRow label="トレーニング種目">
                  <FormProvider {...useFormMethods}>
                    <VStack overflowY="auto" spacing="0">
                      {fields.map((exerciseMenu, index) => (
                        <ExerciseMenuCard
                          key={index}
                          exerciseMenu={exerciseMenu}
                          index={index}
                          remove={remove}
                          errors={errorList?.[index]}
                        />
                      ))}
                    </VStack>
                  </FormProvider>
                </EditRow>
              </Flex>
            </Flex>
          </TabPanel>
          <TabPanel>
            <VStack spacing="12px">
              {trainingTemplateList.map((trainingTemplate) => (
                <TrainingTemplateCard
                  key={trainingTemplate.id}
                  name={trainingTemplate.name}
                  exerciseIdList={trainingTemplate.exerciseIdList}
                  onClickCopy={copyTemplate}
                />
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default TrainingLogEditPage;
