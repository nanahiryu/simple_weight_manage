'use client';

import { Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';

import { ChartField } from './chartField';

const DashBoardPage = () => {
  const user = useAtomValue(userAtom);
  return (
    <Flex direction="column" w="70%" py="60px" gap="40px">
      <Flex gap="40px">
        <CardBase w="full" h="200px">
          <Text fontSize="lg" fontWeight="semibold">
            体重
          </Text>
        </CardBase>
        <CardBase w="full" h="200px">
          <Text fontSize="lg" fontWeight="semibold">
            体脂肪率
          </Text>
        </CardBase>
      </Flex>
      <CardBase w="full" justify="center" direction="column">
        <Text fontSize="lg" fontWeight="semibold">
          推移グラフ
        </Text>
        <ChartField />
      </CardBase>
    </Flex>
  );
};

export default DashBoardPage;
