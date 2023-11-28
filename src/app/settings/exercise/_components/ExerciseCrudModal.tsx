import { Checkbox, CheckboxGroup, Flex, Select } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Controller, useForm } from 'react-hook-form';

import { Exercise } from '@/types/exercise';
import { EditModal, EditModalRow, EditModalRowInput } from '@/components/modal';
import { userAtom } from '@/globalState/user';
import { createExercise, updateExercise } from '@/function/exercise';
import { LoadType, LoadTypeList } from '@/constants/loadType';
import { fetchBodyPartList } from '@/function/bodyPart';
import { BodyPart } from '@/types/bodyPart';
import { useErrorToast } from '@/hooks/useErrorToast';

interface ExerciseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'create' | 'edit';
  exerciseList: Exercise[];
  refetchExerciseList: () => Promise<void>;
  prevExercise?: Exercise | null;
}

interface ExerciseCreateForm {
  name: string;
  description: string;
  loadType: LoadType;
  imagePath: string;
  bodyPartsIdList: string[];
}

const ExerciseCrudModal = (props: ExerciseCreateModalProps) => {
  const { isOpen, onClose, type, exerciseList, refetchExerciseList, prevExercise } = props;
  const user = useAtomValue(userAtom);
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);

  const { register, getValues, watch, reset, control } = useForm<ExerciseCreateForm>({
    defaultValues: {
      name: '',
      description: '',
      loadType: 'weight',
      imagePath: '',
      bodyPartsIdList: [],
    },
  });

  const errorToast = useErrorToast();

  const refetchBodyPartList = async () => {
    if (!user) return;
    const _bodyPartList = await fetchBodyPartList(user.id);
    setBodyPartList(_bodyPartList);
  };

  const onRegisterExercise = async () => {
    if (!user) return;
    try {
      const data = getValues();
      // nameの重複バリデーション
      const exclusiveExerciseList = exerciseList.filter((exercise) => exercise.id !== prevExercise?.id);
      const isDuplicate = exclusiveExerciseList.some((exercise) => exercise.name === data.name);
      if (isDuplicate) {
        throw new Error('同じ名前のトレーニング種目が既に登録されています。');
      }
      if (type === 'edit' && prevExercise) {
        const _updatedExercise = {
          ...prevExercise,
          name: data.name,
          description: data.description,
          bodyPartsIdList: data.bodyPartsIdList,
        } as Exercise;
        if (
          !confirm('トレーニング種目を編集するとテンプレートに登録されている種目の表記も変わります。よろしいですか？')
        )
          return;
        await updateExercise(user.id, _updatedExercise);
      } else if (type === 'create') {
        const _newExercise = {
          id: '',
          name: data.name,
          description: data.description,
          loadType: data.loadType,
          imagePath: 'https://www.fpsa.org/wp-content/uploads/training-concept-image-1.jpg',
          bodyPartsIdList: data.bodyPartsIdList,
          currentLoad: 0,
          currentReps: 0,
          currentSets: 0,
        } as Exercise;
        await createExercise(user.id, _newExercise);
      }
      await refetchExerciseList();
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
    void refetchBodyPartList();
  }, [user]);

  useEffect(() => {
    if (!prevExercise) return;
    reset({
      name: prevExercise.name,
      description: prevExercise.description,
      loadType: prevExercise.loadType,
      imagePath: prevExercise.imagePath,
      bodyPartsIdList: prevExercise.bodyPartsIdList,
    });
  }, [prevExercise]);

  return (
    <EditModal
      title={type === 'create' ? 'トレーニング種目作成' : 'トレーニング種目編集'}
      onRegister={() => void onRegisterExercise()}
      isOpen={isOpen}
      onClose={onClose}
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
      {type === 'create' && (
        <EditModalRow label="負荷の種類">
          <Flex w="300px">
            <Select {...register('loadType')}>
              {LoadTypeList.map((loadType) => (
                <option key={loadType.name} value={loadType.name}>
                  {loadType.displayName}
                </option>
              ))}
            </Select>
          </Flex>
        </EditModalRow>
      )}
      {/* TODO: file uploadの機能を作成 */}
      {/* <EditModalRow label="イメージ画像">
        <Flex w="300px">
          <EditModalRowInput w="full" {...register('imagePath')} />
        </Flex>
      </EditModalRow> */}
      <EditModalRow label="使用部位">
        <Flex w="300px">
          <Controller
            name="bodyPartsIdList"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                colorScheme="teal"
                onChange={(value) => field.onChange(value)}
                defaultValue={watch('bodyPartsIdList')}
              >
                <Flex wrap="wrap" gap="8px">
                  {bodyPartList.map((bodyPart) => (
                    <Checkbox key={bodyPart.id} value={bodyPart.id}>
                      {bodyPart.name}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            )}
          />
        </Flex>
      </EditModalRow>
    </EditModal>
  );
};

export default ExerciseCrudModal;
