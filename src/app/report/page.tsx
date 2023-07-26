'use client';

import { Button, Flex, FormControl, FormErrorMessage, Input, Text, VStack } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { userAtom } from '@/globalState/user';
import { formatDateNumToString } from '@/function/day';
import { createWeighLog, fetchWeighLogList } from '@/function/weighLog';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useSuccessToast } from '@/hooks/useSuccessToast';

const ReportPage = () => {
  const user = useAtomValue(userAtom);
  const defaultDate = formatDateNumToString(Date.now());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      weighDate: defaultDate,
      weight: null,
      fatPercentage: null,
    },
  });
  const errorToast = useErrorToast();
  const successToast = useSuccessToast();
  const router = useRouter();
  const fetchDisplayData = async () => {
    if (!user) return;
    const _weighLogList = await fetchWeighLogList(user.id);
    console.log(_weighLogList);
  };
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user) return;
      const _weighDate = new Date(data.weighDate).getTime();
      const _newWeightLog = {
        id: '',
        weight: data.weight ?? 0,
        fatPercentage: data.fatPercentage ?? 0,
        weighDate: _weighDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await createWeighLog(user.id, _newWeightLog);
      successToast({
        title: '登録完了',
        description: '体重・体脂肪率の登録が完了しました',
      });
      router.push('/dashboard');
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    }
  });
  useEffect(() => {
    void fetchDisplayData();
  }, [user]);
  return (
    <Flex direction="column" w="50%" py="60px" gap="60px">
      <Text fontSize="2xl" fontWeight="semibold">
        体重・体脂肪率入力
      </Text>
      <Flex align="center" direction="column">
        <VStack w="full" spacing="40px">
          <FormControl as={Flex} direction="column" w="full" isInvalid={!!errors.weighDate}>
            <Text fontSize="lg" fontWeight="normal">
              計測した日付
            </Text>
            <Input type="date" size="md" variant="outline" {...register('weighDate')} />
            {errors.weighDate && <FormErrorMessage>{errors.weighDate.message}</FormErrorMessage>}
          </FormControl>
          <FormControl as={Flex} direction="column" w="full" isInvalid={!!errors.weight}>
            <Text fontSize="lg" fontWeight="normal">
              体重(kg)
            </Text>
            <Input
              size="md"
              variant="outline"
              {...register('weight', {
                required: '体重を入力してください',
                valueAsNumber: true || '数値を入力してください',
                min: { value: 1, message: '1以上の値を入力してください' },
              })}
            />
            {errors.weight && <FormErrorMessage>{errors.weight.message}</FormErrorMessage>}
          </FormControl>
          <FormControl as={Flex} direction="column" w="full" isInvalid={!!errors.fatPercentage}>
            <Text fontSize="lg" fontWeight="normal">
              体脂肪率(%)
            </Text>
            <Input
              size="md"
              variant="outline"
              {...register('fatPercentage', {
                required: '体脂肪率を入力してください',
                valueAsNumber: true || '数値を入力してください',
                min: { value: 1, message: '1以上の値を入力してください' },
              })}
            />
            {errors.fatPercentage && <FormErrorMessage>{errors.fatPercentage.message}</FormErrorMessage>}
          </FormControl>
          <Button w="full" colorScheme="teal" onClick={() => void onSubmit()}>
            送信
          </Button>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ReportPage;
