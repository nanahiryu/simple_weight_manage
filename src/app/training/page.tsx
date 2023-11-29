'use client';

import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import dayjs from 'dayjs';

import { YearMonth, YearMonthPaging } from '@/components/paging';
import { TrainingLog } from '@/types/trainingLog';

import TrainingCalendar from './_components/trainingCalendar';

const trainingLogSeedList: TrainingLog[] = [
  {
    id: '1',
    name: '腕のトレーニング',
    description: '腕のトレーニングです。',
    trainingDate: dayjs('2023-11-01').valueOf(),
    exerciseMenuList: [
      {
        exerciseId: 'benchPress',
        load: 100,
        reps: 10,
        sets: 3,
      },
      {
        exerciseId: 'dumbbellCurl',
        load: 100,
        reps: 10,
        sets: 3,
      },
    ],
  },
  {
    id: '2',
    name: '背中のトレーニング part2',
    description: '背中のトレーニングです。',
    trainingDate: dayjs('2023-11-02').valueOf(),
    exerciseMenuList: [
      {
        exerciseId: 'deadLift',
        load: 100,
        reps: 10,
        sets: 3,
      },
      {
        exerciseId: 'pullUp',
        load: 100,
        reps: 10,
        sets: 3,
      },
    ],
  },
];

const TrainingPage = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  return (
    <Flex py="40px" px="40px" gap="20px" w="90%" h="full" direction="column">
      <Flex>
        <Text fontSize="2xl" fontWeight="semibold">
          トレーニングログ
        </Text>
      </Flex>
      <Flex w="full" direction="column" align="center" gap="12px">
        <YearMonthPaging yearMonth={selectedYearMonth} setYearMonth={setSelectedYearMonth} />
        <TrainingCalendar yearMonth={selectedYearMonth} trainingLogList={trainingLogSeedList} />
      </Flex>
    </Flex>
  );
};

export default TrainingPage;
