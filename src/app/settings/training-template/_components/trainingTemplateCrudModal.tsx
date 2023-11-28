import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  UseCheckboxProps,
  useCheckbox,
  useCheckboxGroup,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { MdSearch } from 'react-icons/md';
import { IconType } from 'react-icons';
import { useForm } from 'react-hook-form';

import { userAtom } from '@/globalState/user';
import { TrainingTemplate } from '@/types/trainingTemplate';
import { EditModal, EditModalRow, EditModalRowInput } from '@/components/modal';
import { fetchBodyPartList } from '@/function/bodyPart';
import { fetchExerciseList } from '@/function/exercise';
import { BodyPart } from '@/types/bodyPart';
import { Exercise } from '@/types/exercise';
import { createTrainingTemplate, deleteTrainingTemplate, updateTrainingTemplate } from '@/function/trainingTemplate';
import { useErrorToast } from '@/hooks/useErrorToast';

interface TrainingTemplateCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'create' | 'edit';
  prevTrainingTemplate?: TrainingTemplate | null;
  refetchTrainingTemplateList: () => Promise<void>;
}

const TrainingTemplateCrudModal = (props: TrainingTemplateCrudModalProps) => {
  const { isOpen, onClose, type, prevTrainingTemplate, refetchTrainingTemplateList } = props;
  const user = useAtomValue(userAtom);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>('all');
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
  const [allExerciseList, setAllExerciseList] = useState<Exercise[]>([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState<Exercise[]>([]);
  const [searchedExerciseList, setSearchedExerciseList] = useState<Exercise[]>([]);

  const errorToast = useErrorToast();

  const { register, watch, reset, setValue, getValues } = useForm<TrainingTemplate>({
    defaultValues: {
      name: '',
      description: '',
      exerciseIdList: [],
    },
  });

  const { getCheckboxProps, setValue: setValueCheckBoxGroup } = useCheckboxGroup({
    onChange: (value) => {
      setValue('exerciseIdList', value as string[]);
    },
  });

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

  const resetFilter = () => {
    setSelectedBodyPartId('all');
    setSearchText('');
  };

  const onRegisterTrainingTemplate = async () => {
    if (!user) return;
    const data = getValues();
    try {
      if (type === 'create') {
        const _newTrainingTemplate = {
          id: '',
          name: data.name,
          description: data.description,
          exerciseIdList: data.exerciseIdList,
        } as TrainingTemplate;
        await createTrainingTemplate(user.id, _newTrainingTemplate);
      } else if (type === 'edit' && prevTrainingTemplate) {
        const _updatedTrainingTemplate = {
          ...prevTrainingTemplate,
          name: data.name,
          description: data.description,
          exerciseIdList: data.exerciseIdList,
        } as TrainingTemplate;
        await updateTrainingTemplate(user.id, _updatedTrainingTemplate);
      }
      await refetchTrainingTemplateList();
      onClose();
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  };

  const onDeleteTrainingTemplate = async () => {
    if (!user) return;
    try {
      if (!window.confirm('本当に削除しますか？')) return;
      if (!prevTrainingTemplate) return;
      await deleteTrainingTemplate(user.id, prevTrainingTemplate.id);
      await refetchTrainingTemplateList();
      onClose();
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    void refetchExerciseList();
    void refetchBodyPartList();
  }, [user]);

  useEffect(() => {
    filterExerciseList(allExerciseList, selectedBodyPartId);
  }, [selectedBodyPartId, allExerciseList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchExerciseList(filteredExerciseList, searchText);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchText, filteredExerciseList]);

  useEffect(() => {
    if (!prevTrainingTemplate) {
      reset({
        name: '',
        description: '',
        exerciseIdList: [],
      });
      setValueCheckBoxGroup([]);
      return;
    }
    const { name, description, exerciseIdList } = prevTrainingTemplate;
    reset({
      name,
      description,
      exerciseIdList,
    });
    setValueCheckBoxGroup(exerciseIdList);
  }, [prevTrainingTemplate]);

  useEffect(() => {
    resetFilter();
  }, [isOpen]);

  return (
    <EditModal
      title={type === 'create' ? 'トレーニング種目作成' : 'トレーニング種目編集'}
      onRegister={() => void onRegisterTrainingTemplate()}
      onDelete={type === 'create' ? undefined : () => void onDeleteTrainingTemplate()}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
    >
      <EditModalRow label="種目名">
        <Flex w="300px">
          <EditModalRowInput w="full" {...register('name')} />
        </Flex>
      </EditModalRow>
      <EditModalRow label="説明">
        <Flex w="300px">
          <EditModalRowInput w="full" {...register('description')} />
        </Flex>
      </EditModalRow>
      <EditModalRow label="トレーニング種目">
        <Flex direction="column" gap="12px" maxW="560px" py="12px">
          <Flex gap="8px" wrap="wrap">
            {watch('exerciseIdList').map((exerciseId) => (
              <Flex key={exerciseId} px="8px" borderRadius="md" bg="teal.400">
                <Text fontSize="md" fontWeight="normal" color="white">
                  {allExerciseList.find((exercise) => exercise.id === exerciseId)?.name}
                </Text>
              </Flex>
            ))}
          </Flex>
          <Flex gap="24px" w="full">
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
            {searchedExerciseList.map((exercise) => {
              const checkbox = getCheckboxProps({ value: exercise.id });
              return (
                <CustomCheckbox key={exercise.id} {...checkbox}>
                  {exercise.name}
                </CustomCheckbox>
              );
            })}
          </Flex>
        </Flex>
      </EditModalRow>
    </EditModal>
  );
};

export default TrainingTemplateCrudModal;

interface CustomCheckboxProps extends UseCheckboxProps {
  children: React.ReactNode;
}

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { state, getInputProps } = useCheckbox(props);
  return (
    <Flex
      as="label"
      px="8px"
      border="1px"
      borderColor="teal.400"
      borderRadius="md"
      bg={state.isChecked ? 'teal.400' : 'white'}
      _hover={{
        cursor: 'pointer',
      }}
    >
      <Input {...getInputProps()} hidden />
      <Text fontSize="md" fontWeight="normal" color={state.isChecked ? 'white' : 'teal.400'}>
        {props.children}
      </Text>
    </Flex>
  );
};
