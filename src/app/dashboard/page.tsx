'use client';

import { Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';
import { fetchTargetList } from '@/function/target';
import { Target } from '@/types/target';
import { formatDateNumToString } from '@/function/day';

import { ChartField } from './chartField';

const DashBoardPage = () => {
  const user = useAtomValue(userAtom);
  const [weightTarget, setWeightTarget] = useState<Target | undefined>(undefined);
  const [fatPercentageTarget, setFatPercentageTarget] = useState<Target | undefined>(undefined);

  const fetchDisplayData = async () => {
    if (!user) return;
    const _targetList = await fetchTargetList(user.id);
    const _weightTarget = _targetList.find((target) => target.type === 'weight');
    const _fatPercentageTarget = _targetList.find((target) => target.type === 'fatPercentage');
    setWeightTarget(_weightTarget);
    setFatPercentageTarget(_fatPercentageTarget);
  };

  useEffect(() => {
    void fetchDisplayData();
  }, [user]);

  return (
    <Flex direction="column" w="70%" py="60px" gap="40px">
      <Flex gap="40px">
        <CardBase direction="column" w="full" h="200px">
          <Text fontSize="lg" fontWeight="semibold">
            体重
          </Text>
          <TargetField target={weightTarget} />
        </CardBase>
        <CardBase direction="column" w="full" h="200px">
          <Text fontSize="lg" fontWeight="semibold">
            体脂肪率
          </Text>
          <TargetField target={fatPercentageTarget} />
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

const TargetField = ({ target }: { target?: Target }) => {
  if (!target) {
    return (
      <Flex align="center" justify="center" h="full">
        <Text fontSize="lg" fontWeight="semibold">
          目標を設定しましょう
        </Text>
      </Flex>
    );
  }

  return (
    <Flex p="12px" direction="column" height="full">
      <Text fontSize="lg" fontWeight="semibold" color="gray.600">
        {formatDateNumToString(target.deadlineDate, '/')}までに
      </Text>
      <Flex align="center" justify="center" height="full">
        <Flex align="end" gap="12px">
          <Text fontSize="6xl" fontWeight="bold" color="teal.400" lineHeight="none">
            {target.targetValue}
          </Text>
          <Text fontSize="2xl" fontWeight="semibold" color="gray.600">
            {target.type === 'weight' ? 'kg' : '％'}
            {target.isUpper ? 'まで増やす！' : 'まで落とす！'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
