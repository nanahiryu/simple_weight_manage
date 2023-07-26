'use client';

import { Button, Flex, FormControl, Input, Select, Spacer, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';
import { createTarget, fetchTargetList, updateTarget } from '@/function/target';
import { formatDateNumToString } from '@/function/day';
import { Target } from '@/types/target';

const SettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [prevTargetList, setPrevTargetList] = useState<Target[]>([]);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      weightDeadline: formatDateNumToString(new Date().getTime()),
      weight: 0,
      weightIsUpper: false,
      fatPercentageDeadline: formatDateNumToString(new Date().getTime()),
      fatPercentage: 0,
      fatPercentageIsUpper: false,
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;
    const _weightTargetDeadline = new Date(data.weightDeadline).getTime();
    const _fatPercentageTargetDeadline = new Date(data.fatPercentageDeadline).getTime();
    const _newWeightTarget: Target = {
      id: '',
      type: 'weight',
      targetValue: data.weight,
      deadlineDate: _weightTargetDeadline,
      isUpper: data.weightIsUpper,
    };
    const _newFatPercentageTarget: Target = {
      id: '',
      type: 'fatPercentage',
      targetValue: data.fatPercentage,
      deadlineDate: _fatPercentageTargetDeadline,
      isUpper: data.fatPercentageIsUpper,
    };
    const _prevWeightTarget: Target | undefined = prevTargetList.find((target) => target.type === 'weight');
    const _prevFatPercentageTarget: Target | undefined = prevTargetList.find(
      (target) => target.type === 'fatPercentage',
    );
    // Weightの更新, 新規作成
    if (_prevWeightTarget) {
      // 更新
      if (window.confirm('体重の目標を更新しますか？')) {
        _newWeightTarget.id = _prevWeightTarget.id;
        await updateTarget(user.id, _newWeightTarget);
      }
    } else {
      // 新規作成
      await createTarget(user.id, _newWeightTarget);
    }
    // fatPercentageの更新, 新規作成
    if (_prevFatPercentageTarget) {
      // 更新
      if (window.confirm('体脂肪率の目標を更新しますか？')) {
        _newFatPercentageTarget.id = _prevFatPercentageTarget.id;
        await updateTarget(user.id, _newFatPercentageTarget);
      }
    } else {
      // 新規作成
      await createTarget(user.id, _newFatPercentageTarget);
    }
  });

  const fetchDisplayData = async () => {
    if (!user) return;
    const _targetList = await fetchTargetList(user.id);
    setPrevTargetList(_targetList);

    const _weightTarget = _targetList.find((target) => target.type === 'weight');
    const _fatPercentageTarget = _targetList.find((target) => target.type === 'fatPercentage');
    reset({
      weightDeadline: formatDateNumToString(_weightTarget?.deadlineDate ?? new Date().getTime()),
      weight: _weightTarget?.targetValue,
      weightIsUpper: _weightTarget?.isUpper,
      fatPercentageDeadline: formatDateNumToString(_fatPercentageTarget?.deadlineDate ?? new Date().getTime()),
      fatPercentage: _fatPercentageTarget?.targetValue,
      fatPercentageIsUpper: _fatPercentageTarget?.isUpper,
    });
  };

  useEffect(() => {
    void fetchDisplayData();
  }, [user]);

  return (
    <Flex direction="column" gap="20px" w="full">
      <Flex>
        <Text fontSize="2xl" fontWeight="semibold">
          目標設定
        </Text>
        <Spacer />
        <Button colorScheme="teal" onClick={() => void onSubmit()}>
          変更を保存
        </Button>
      </Flex>
      <Flex direction="column" gap="20px">
        <CardBase w="full" h="120px" direction="row">
          <Flex w="80px">
            <Text fontSize="lg" fontWeight="semibold">
              体重
            </Text>
          </Flex>
          <Spacer />
          <Flex align="center" gap="12px">
            <FormControl w="fit-content">
              <Input type="date" size="lg" bg="white" w="240px" variant="outline" {...register('weightDeadline')} />
            </FormControl>
            <Text fontSize="lg" fontWeight="normal" w="80px">
              までに
            </Text>
            <FormControl as={Flex} align="end" gap="8px" w="160px">
              <Input
                size="lg"
                fontSize="xl"
                bg="white"
                w="120px"
                variant="outline"
                {...register('weight', {
                  required: '体重を入力してください',
                  valueAsNumber: true || '数値を入力してください',
                  min: { value: 1, message: '1以上の値を入力してください' },
                })}
              />
              <Text fontSize="xl" fontWeight="semibold">
                kg
              </Text>
            </FormControl>
            <FormControl w="fit-content">
              <Select
                fontSize="lg"
                defaultValue={watch('weightIsUpper') ? 'true' : 'false'}
                onChange={(e) => {
                  setValue('weightIsUpper', e.target.value === 'true');
                }}
                w="120px"
                bg="white"
              >
                <option value={'true'}>以上</option>
                <option value={'false'}>以下</option>
              </Select>
            </FormControl>
          </Flex>
        </CardBase>
        <CardBase w="full" h="120px" direction="row">
          <Flex w="80px">
            <Text fontSize="lg" fontWeight="semibold">
              体脂肪率
            </Text>
          </Flex>
          <Spacer />
          <Flex align="center" gap="12px">
            <FormControl w="fit-content">
              <Input
                type="date"
                size="lg"
                bg="white"
                w="240px"
                variant="outline"
                {...register('fatPercentageDeadline')}
              />
            </FormControl>
            <Text fontSize="lg" fontWeight="normal" w="80px">
              までに
            </Text>
            <FormControl as={Flex} align="end" gap="8px" w="160px">
              <Input
                size="lg"
                fontSize="xl"
                bg="white"
                w="120px"
                variant="outline"
                {...register('fatPercentage', {
                  required: '体脂肪率を入力してください',
                  valueAsNumber: true || '数値を入力してください',
                  min: { value: 1, message: '1以上の値を入力してください' },
                })}
              />
              <Text fontSize="xl" fontWeight="semibold">
                ％
              </Text>
            </FormControl>
            <FormControl w="fit-content">
              <Select
                fontSize="lg"
                defaultValue={watch('fatPercentageIsUpper') ? 'true' : 'false'}
                onChange={(e) => {
                  setValue('fatPercentageIsUpper', e.target.value === 'true');
                }}
                w="120px"
                bg="white"
              >
                <option value={'true'}>以上</option>
                <option value={'false'}>以下</option>
              </Select>
            </FormControl>
          </Flex>
        </CardBase>
      </Flex>
    </Flex>
  );
};

export default SettingsPage;
