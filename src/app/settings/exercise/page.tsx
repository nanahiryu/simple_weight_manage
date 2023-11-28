'use client';

import {
  Center,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { MdAdd, MdSearch } from 'react-icons/md';
import { IconType } from 'react-icons';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Exercise } from '@/types/exercise';
import { PrimaryButton } from '@/components/buttons';
import { userAtom } from '@/globalState/user';
import { fetchExerciseList, insertSeedExercise } from '@/function/exercise';
import { BodyPart } from '@/types/bodyPart';
import { fetchBodyPartList } from '@/function/bodyPart';

import ExerciseCard from './_components/ExerciseCard';
import ExerciseCrudModal from './_components/ExerciseCrudModal';

const ExerciseSettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>('all');
  const [allExerciseList, setAllExerciseList] = useState<Exercise[]>([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState<Exercise[]>([]);
  const [searchedExerciseList, setSearchedExerciseList] = useState<Exercise[]>([]);
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);
  const [type, setType] = useState<'create' | 'edit'>('create');
  const [prevExercise, setPrevExercise] = useState<Exercise | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const isEmulating = process.env.NEXT_PUBLIC_ENV === 'local';

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

  const onClickAddSeedExercise = async () => {
    if (!user) return;
    await insertSeedExercise(user.id);
    await refetchExerciseList();
  };

  const onClickCreateExercise = () => {
    setType('create');
    setPrevExercise(null);
    onOpen();
  };

  const onClickEditExercise = (exercise: Exercise) => {
    setType('edit');
    setPrevExercise(exercise);
    onOpen();
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

  return (
    <>
      <Flex direction="column" px="40px" gap="20px" w="full" h="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="semibold">
            トレーニング種目
          </Text>
          <Spacer />
          <Flex gap="8px">
            {isEmulating && (
              <PrimaryButton onClick={() => void onClickAddSeedExercise()} gap="8px">
                <Icon as={MdAdd as IconType} boxSize="20px" />
                <Text fontSize="sm">シード追加</Text>
              </PrimaryButton>
            )}
            <PrimaryButton onClick={onClickCreateExercise} gap="8px">
              <Icon as={MdAdd as IconType} boxSize="20px" />
              <Text fontSize="sm">追加</Text>
            </PrimaryButton>
          </Flex>
        </Flex>
        <Flex gap="24px" w="full">
          <Flex align="center" gap="8px">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              部位
            </Text>
            <Select onChange={(e) => setSelectedBodyPartId(e.target.value)} w="200px">
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
            <InputGroup w="280px">
              <InputLeftElement>
                <Icon as={MdSearch as IconType} boxSize="24px" />
              </InputLeftElement>
              <Input w="280px" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            </InputGroup>
          </Flex>
        </Flex>
        <Flex w="full" h="full" wrap="wrap" gap="20px">
          {searchedExerciseList.length !== 0 ? (
            searchedExerciseList.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                title={exercise.name}
                imagePath={exercise.imagePath}
                loadType={exercise.loadType}
                load={exercise.currentLoad}
                reps={exercise.currentReps}
                sets={exercise.currentSets}
                bodyPartsIdList={exercise.bodyPartsIdList}
                onClick={() => onClickEditExercise(exercise)}
              />
            ))
          ) : (
            <Center w="full" px="40px" py="120px">
              <Text fontSize="lg" fontWeight="semibold">
                データがありません
              </Text>
            </Center>
          )}
        </Flex>
      </Flex>
      <ExerciseCrudModal
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        exerciseList={allExerciseList}
        refetchExerciseList={refetchExerciseList}
        prevExercise={prevExercise}
      />
    </>
  );
};

export default ExerciseSettingsPage;
