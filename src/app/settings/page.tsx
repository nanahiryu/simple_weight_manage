'use client';

import { Button, Flex, FormControl, Input, Select, Spacer, Switch, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { userAtom } from '@/globalState/user';
import { CardBase } from '@/components/card';
import { createTarget, fetchTargetList, updateTarget } from '@/function/target';
import { formatDateNumToString } from '@/function/day';
import { Target } from '@/types/target';

const SettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [prevTargetList, setPrevTargetList] = useState<Target[]>([]);
  const [isWeightEditing, setIsWeightEditing] = useState<boolean>(true);
  const [isFatPercentageEditing, setIsFatPercentageEditing] = useState<boolean>(false);

  const useFormMethod = useForm({
    defaultValues: {
      weightDeadline: formatDateNumToString(new Date().getTime()),
      weight: 0,
      weightIsUpper: 'false',
      fatPercentageDeadline: formatDateNumToString(new Date().getTime()),
      fatPercentage: 0,
      fatPercentageIsUpper: 'false',
    },
  });

  const { handleSubmit, reset } = useFormMethod;

  // dataが変更された, または新規作成された場合はtrueを返す
  const isTargetChangedOrNew = (prevTarget: Target | undefined, newTarget: Target) => {
    if (!prevTarget) return true;
    return (
      prevTarget.targetValue !== newTarget.targetValue ||
      prevTarget.deadlineDate !== newTarget.deadlineDate ||
      prevTarget.isUpper !== newTarget.isUpper
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;
    const _weightTargetDeadline = new Date(data.weightDeadline).getTime();
    const _fatPercentageTargetDeadline = new Date(data.fatPercentageDeadline).getTime();
    const _newWeightTarget: Target = {
      id: '',
      type: 'weight',
      targetValue: data.weight,
      deadlineDate: _weightTargetDeadline,
      isUpper: data.weightIsUpper === 'true' ? true : false,
    };
    const _newFatPercentageTarget: Target = {
      id: '',
      type: 'fatPercentage',
      targetValue: data.fatPercentage,
      deadlineDate: _fatPercentageTargetDeadline,
      isUpper: data.fatPercentageIsUpper === 'true' ? true : false,
    };
    const _prevWeightTarget: Target | undefined = prevTargetList.find((target) => target.type === 'weight');
    const _prevFatPercentageTarget: Target | undefined = prevTargetList.find(
      (target) => target.type === 'fatPercentage',
    );

    // Weightの更新, 新規作成
    if (isWeightEditing && isTargetChangedOrNew(_prevWeightTarget, _newWeightTarget)) {
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
    }

    // fatPercentageの更新, 新規作成
    if (isFatPercentageEditing && isTargetChangedOrNew(_prevFatPercentageTarget, _newFatPercentageTarget)) {
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
      weightIsUpper: _weightTarget?.isUpper ? 'true' : 'false',
      fatPercentageDeadline: formatDateNumToString(_fatPercentageTarget?.deadlineDate ?? new Date().getTime()),
      fatPercentage: _fatPercentageTarget?.targetValue,
      fatPercentageIsUpper: _fatPercentageTarget?.isUpper ? 'true' : 'false',
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
        <Button
          colorScheme="teal"
          isDisabled={!isWeightEditing && !isFatPercentageEditing}
          onClick={() => void onSubmit()}
        >
          変更を保存
        </Button>
      </Flex>
      <FormProvider {...useFormMethod}>
        <Flex direction="column" gap="20px">
          <TargetCard
            isEditing={isWeightEditing}
            setIsEditing={setIsWeightEditing}
            dateInputName="weightDeadline"
            valueInputName="weight"
            isUpperInputName="weightIsUpper"
            targetTitle="体重"
            unitName="kg"
          />
          <TargetCard
            isEditing={isFatPercentageEditing}
            setIsEditing={setIsFatPercentageEditing}
            dateInputName="fatPercentageDeadline"
            valueInputName="fatPercentage"
            isUpperInputName="fatPercentageIsUpper"
            targetTitle="体脂肪率"
            unitName="%"
          />
        </Flex>
      </FormProvider>
    </Flex>
  );
};

export default SettingsPage;

interface TargetCardProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  dateInputName: string;
  valueInputName: string;
  isUpperInputName: string;
  targetTitle: string;
  unitName: string;
}

const TargetCard = (props: TargetCardProps) => {
  const { isEditing, setIsEditing, dateInputName, valueInputName, isUpperInputName, targetTitle, unitName } = props;
  const { register, watch, setValue } = useFormContext();
  return (
    <CardBase w="full" h="120px" direction="column">
      <Flex w="full" align="center">
        <Text fontSize="xl" fontWeight="semibold">
          {targetTitle}
        </Text>
        <Spacer />
        <Flex align="center">
          <Text fontSize="md" fontWeight="semibold" color={isEditing ? 'teal.400' : 'red.400'}>
            {isEditing ? '保存対象' : '保存対象外'}
          </Text>
          <Switch
            ml="20px"
            size="lg"
            colorScheme="teal"
            isChecked={isEditing}
            onChange={() => setIsEditing(!isEditing)}
          />
        </Flex>
      </Flex>
      <Spacer />
      <Flex align="center" gap="12px" justify="end">
        <FormControl w="fit-content">
          <Input
            type="date"
            size="lg"
            bg="white"
            w="240px"
            variant="outline"
            isDisabled={!isEditing}
            {...register(dateInputName)}
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
            isDisabled={!isEditing}
            {...register(valueInputName, {
              required: '体重を入力してください',
              valueAsNumber: true || '数値を入力してください',
              min: { value: 1, message: '1以上の値を入力してください' },
            })}
          />
          <Text fontSize="xl" fontWeight="semibold">
            {unitName}
          </Text>
        </FormControl>
        <FormControl w="fit-content">
          <Select
            size="lg"
            fontSize="lg"
            w="120px"
            bg="white"
            value={watch(isUpperInputName) as string}
            onChange={(e) => {
              setValue('weightIsUpper', e.target.value);
            }}
            isDisabled={!isEditing}
          >
            <option value={'true'}>以上</option>
            <option value={'false'}>以下</option>
          </Select>
        </FormControl>
      </Flex>
    </CardBase>
  );
};
