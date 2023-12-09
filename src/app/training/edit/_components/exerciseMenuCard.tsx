import { Flex, FormControl, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { FieldErrors, UseFieldArrayRemove, useFormContext } from 'react-hook-form';

import { findExerciseById } from '@/function/exercise';
import { userAtom } from '@/globalState/user';
import { Exercise } from '@/types/exercise';
import { EditButton } from '@/components/buttons';
import { displayLoadTypeUnit } from '@/constants/loadType';

import { ExerciseMenuForm } from '../page';
import EditRowInput from '../../_components/EditRowInput';

interface ExerciseMenuCardProps {
  exerciseMenu: ExerciseMenuForm;
  index: number;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<ExerciseMenuForm>;
}

const ExerciseMenuCard = (props: ExerciseMenuCardProps) => {
  const { exerciseMenu, index, remove, errors } = props;
  const user = useAtomValue(userAtom);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  const { register } = useFormContext();

  const refetchExercise = async () => {
    if (!user) return;
    const _exerciseList = await findExerciseById(user.id, exerciseMenu.exerciseId);
    setExercise(_exerciseList);
  };

  useEffect(() => {
    void refetchExercise();
    console.log(index, exerciseMenu.exerciseId);
  }, [exerciseMenu, index]);

  return (
    <Flex w="full" py="8px" gap="8px" direction="column">
      <Flex align="center" gap="8px">
        <Text minW="max-content" fontSize="md" fontWeight="bold" color="text.lightblack">
          {exercise?.name}
        </Text>
        <EditButton
          buttonType="delete"
          onClick={() => {
            remove(index);
          }}
        />
      </Flex>
      <Flex w="full" gap="20px" wrap="wrap">
        <Flex align="center" gap="4px">
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            負荷
          </Text>
          <FormControl isInvalid={!!errors?.load} w="fit-content">
            <EditRowInput
              w="80px"
              size="sm"
              {...register(`exerciseMenuList.${index}.load`, {
                required: true,
                min: 0.001,
              })}
            />
          </FormControl>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {displayLoadTypeUnit(exercise?.loadType ?? '')}
          </Text>
        </Flex>
        <Flex align="center" gap="4px">
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            回数
          </Text>
          <FormControl isInvalid={!!errors?.reps} w="fit-content">
            <EditRowInput
              w="80px"
              size="sm"
              {...register(`exerciseMenuList.${index}.reps`, {
                required: true,
                min: 1,
              })}
            />
          </FormControl>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            回
          </Text>
        </Flex>
        <Flex align="center" gap="4px">
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            セット
          </Text>
          <FormControl isInvalid={!!errors?.sets} w="fit-content">
            <EditRowInput
              w="80px"
              size="sm"
              {...register(`exerciseMenuList.${index}.sets`, {
                required: true,
                min: 1,
              })}
            />
          </FormControl>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            回
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ExerciseMenuCard;
