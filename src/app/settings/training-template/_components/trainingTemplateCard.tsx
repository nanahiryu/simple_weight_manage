import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';
import { fetchExerciseList } from '@/function/exercise';
import { Exercise } from '@/types/exercise';

interface TrainingTemplateCardProps {
  name: string;
  exerciseIdList: string[];
  onClick: () => void;
}

const TrainingTemplateCard = (props: TrainingTemplateCardProps) => {
  const { name, exerciseIdList, onClick } = props;
  const user = useAtomValue(userAtom);
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);

  const refetchExerciseList = async () => {
    if (!user) return;
    const _exerciseList = await fetchExerciseList(user.id);
    const _includesExerciseList = _exerciseList.filter((exercise) => exerciseIdList.includes(exercise.id));
    setExerciseList(_includesExerciseList);
  };

  useEffect(() => {
    void refetchExerciseList();
  }, [user, exerciseIdList]);

  return (
    <CardBase
      p="20px"
      w="full"
      direction="column"
      gap="8px"
      onClick={onClick}
      _hover={{
        cursor: 'pointer',
        boxShadow: 'sm',
        transition: 'all 0.5s',
      }}
    >
      <Flex>
        <Text fontSize="lg" fontWeight="semibold">
          {name}
        </Text>
      </Flex>
      <Flex gap="8px" wrap="wrap">
        {exerciseList.map((exercise) => (
          <Flex key={exercise.id} px="8px" borderRadius="md" bg="teal.400">
            <Text fontSize="md" fontWeight="normal" color="white">
              {exercise.name}
            </Text>
          </Flex>
        ))}
      </Flex>
    </CardBase>
  );
};

export default TrainingTemplateCard;
