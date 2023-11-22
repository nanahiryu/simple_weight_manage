'use client';

import { Flex, Icon, Input, InputGroup, InputLeftElement, Select, Text, useDisclosure } from '@chakra-ui/react';
import { MdAdd, MdSearch } from 'react-icons/md';
import { IconType } from 'react-icons';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Exercise } from '@/types/exercise';
import { PrimaryButton } from '@/components/buttons';
import { userAtom } from '@/globalState/user';
import { fetchExerciseList } from '@/function/exercise';
import { BodyPart } from '@/types/bodyPart';
import { fetchBodyPartList } from '@/function/bodyPart';

import ExerciseCard from './_components/ExerciseCard';
import ExerciseCreateModal from './_components/ExerciseCreateModal';

const ExerciseSettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>('arm');
  const [allExerciseList, setAllExerciseList] = useState<Exercise[]>([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState<Exercise[]>([]);
  const [searchedExerciseList, setSearchedExerciseList] = useState<Exercise[]>([]);
  const [bodyPartList, setBodyPartList] = useState<BodyPart[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
        <Flex justify="space-between">
          <Text fontSize="2xl" fontWeight="semibold">
            トレーニング種目
          </Text>
          <PrimaryButton onClick={onOpen} gap="8px">
            <Icon as={MdAdd as IconType} boxSize="20px" />
            <Text fontSize="sm">追加</Text>
          </PrimaryButton>
        </Flex>
        <Flex gap="24px" w="full">
          <Flex align="center" gap="8px">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              部位
            </Text>
            <Select onChange={(e) => setSelectedBodyPartId(e.target.value)} w="200px">
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
          {searchedExerciseList.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.name}
              imagePath={exercise.imagePath}
              loadType={exercise.loadType}
              load={exercise.currentLoad}
              reps={exercise.currentReps}
              sets={exercise.currentSets}
              bodyPartsIdList={exercise.bodyPartsIdList}
            />
          ))}
        </Flex>
      </Flex>
      <ExerciseCreateModal
        isOpen={isOpen}
        onClose={onClose}
        exerciseList={allExerciseList}
        refetchExerciseList={refetchExerciseList}
      />
    </>
  );
};

export default ExerciseSettingsPage;
