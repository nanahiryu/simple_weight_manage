'use client';

import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { YearMonth, YearMonthPaging } from '@/components/paging';

const TrainingPage = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState<YearMonth>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  return (
    <Flex py="40px" px="40px" gap="40px" w="90%" h="full" direction="column">
      <Flex>
        <Text fontSize="2xl" fontWeight="semibold">
          トレーニングログ
        </Text>
      </Flex>
      <Flex w="full" direction="column" align="center">
        <YearMonthPaging yearMonth={selectedYearMonth} setYearMonth={setSelectedYearMonth} />
        <Flex></Flex>
      </Flex>
    </Flex>
  );
};

export default TrainingPage;
