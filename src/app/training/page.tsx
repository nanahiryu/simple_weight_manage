'use client';

import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { Exercise } from '@/types/exercise';
import { exerciseSeedList } from '@/seed/exercise';

const TrainingPage = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedBodyPartId, setSelectedBodyPartId] = useState<string>('arm');
  const [allExerciseList, setAllExerciseList] = useState<Exercise[]>([]);
  const [filteredExerciseList, setFilteredExerciseList] = useState<Exercise[]>([]);
  const [searchedExerciseList, setSearchedExerciseList] = useState<Exercise[]>([]);

  const filterExerciseList = (exerciseList: Exercise[], bodyPartId: string) => {
    const _filteredExerciseList = exerciseList.filter((exercise) => exercise.bodyPartsIdList.includes(bodyPartId));
    setFilteredExerciseList(_filteredExerciseList);
  };

  const searchExerciseList = (exerciseList: Exercise[], text: string) => {
    if (!text) {
      setSearchedExerciseList(filteredExerciseList);
    } else {
      const _searchedExerciseList = exerciseList.filter((exercise) => exercise.name.includes(text));
      setSearchedExerciseList(_searchedExerciseList);
    }
  };

  useEffect(() => {
    setAllExerciseList(exerciseSeedList);
  }, [exerciseSeedList]);

  useEffect(() => {
    filterExerciseList(allExerciseList, selectedBodyPartId);
  }, [selectedBodyPartId, allExerciseList]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchExerciseList(filteredExerciseList, searchText);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchText, filteredExerciseList]);

  return <Flex py="60px" px="40px" gap="40px" w="90%" h="full"></Flex>;
};

export default TrainingPage;
