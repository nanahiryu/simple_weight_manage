'use client';

import { Flex, Icon, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';
import { IconType } from 'react-icons';
import React, { useEffect, useState } from 'react';

import { CardBase } from '@/components/card';
import { bodyPartSeedList } from '@/seed/bodyParts';
import { Exercise } from '@/types/exercise';
import { exerciseSeedList } from '@/seed/exercise';

import ExerciseCard from './_components/ExerciseCard';

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

  return (
    <Flex py="60px" px="40px" gap="40px" w="90%" h="full">
      <Flex direction="column" gap="12px">
        <InputGroup>
          <InputLeftElement>
            <Icon as={MdSearch as IconType} boxSize="24px" />
          </InputLeftElement>
          <Input w="280px" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </InputGroup>
        <CardBase w="280px" minH="200px" h="fit-content" justify="start" direction="column" py="20px" gap="8px">
          {/* FIXME: bodyPartsのcreate機能を作ったらseedから置き換える */}
          {bodyPartSeedList.map((content) => (
            <Flex
              key={content.id}
              onClick={() => setSelectedBodyPartId(content.id)}
              w="full"
              color={selectedBodyPartId === content.id ? 'teal.400' : 'black'}
              _hover={{
                cursor: 'pointer',
                color: 'teal.300',
              }}
            >
              <Text fontSize="lg" fontWeight="semibold">
                {content.name}
              </Text>
            </Flex>
          ))}
        </CardBase>
      </Flex>
      <Flex w="70%" h="full" wrap="wrap" gap="20px">
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
  );
};

export default TrainingPage;
