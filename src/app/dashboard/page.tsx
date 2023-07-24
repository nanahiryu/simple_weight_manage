'use client';

import { Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';

const DashBoardPage = () => {
  const user = useAtomValue(userAtom);
  return (
    <Flex direction="column" w="70%" py="60px" gap="40px">
      <Flex gap="40px">
        <CardBase w="full" h="200px">
          <Text>体重</Text>
        </CardBase>
        <CardBase w="full" h="200px">
          <Text>体脂肪率</Text>
        </CardBase>
      </Flex>
      <CardBase w="full" h="400px">
        <Text>グラフ</Text>
      </CardBase>
    </Flex>
  );
};

export default DashBoardPage;
