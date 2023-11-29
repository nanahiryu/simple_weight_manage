'use client';

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';
import { IconType } from 'react-icons';

import { WeighLog } from '@/types/weighLog';
import { createWeighLog, fetchWeighLogList, updateWeighLog } from '@/function/weighLog';
import { userAtom } from '@/globalState/user';
import { formatDateNumToString } from '@/function/day';
import { CardBase } from '@/components/card';
import { EditModal, EditModalRow, EditModalRowInput } from '@/components/modal';
import { useSuccessToast } from '@/hooks/useSuccessToast';
import { useLoading } from '@/hooks/useLoading';
import { useErrorToast } from '@/hooks/useErrorToast';

import { YearMonthPaging } from './_components/paging';

export interface YearMonth {
  year: number;
  month: number;
}

const LogsSettingsPage = () => {
  const user = useAtomValue(userAtom);
  const [selectedMonth, setSelectedMonth] = useState<YearMonth>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [weighLogs, setWeightLogs] = useState<WeighLog[]>([]);
  const [displayWeighLogs, setDisplayWeighLogs] = useState<WeighLog[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchWeighLogsData = async () => {
    if (!user) return;
    const _weighLogs = await fetchWeighLogList(user.id);
    console.log('weighLogs', _weighLogs);
    setWeightLogs(_weighLogs);
  };

  const filterDisplayWeighLogs = (weighLogs: WeighLog[], yearMonth: YearMonth) => {
    const _filteredWeighLogs = weighLogs.filter((weighLog) => {
      const _date = new Date(weighLog.weighDate);
      return _date.getFullYear() === yearMonth.year && _date.getMonth() + 1 === yearMonth.month;
    });
    const _sortedWeighLogs = _filteredWeighLogs.sort((a, b) => {
      return a.weighDate - b.weighDate;
    });
    setDisplayWeighLogs(_sortedWeighLogs);
  };

  useEffect(() => {
    void fetchWeighLogsData();
  }, [user]);

  useEffect(() => {
    filterDisplayWeighLogs(weighLogs, selectedMonth);
  }, [weighLogs, selectedMonth]);

  return (
    <>
      <Flex direction="column" gap="20px" w="full">
        <Flex>
          <Text fontSize="2xl" fontWeight="semibold">
            体重・体脂肪率リスト
          </Text>
        </Flex>
        <Flex direction="column" gap="20px" align="center">
          <YearMonthPaging yearMonth={selectedMonth} setYearMonth={setSelectedMonth} />
          <VStack w="full" spacing="12px">
            {displayWeighLogs.length !== 0 ? (
              displayWeighLogs.map((weighLog) => (
                <LogCard key={weighLog.id} weighLog={weighLog} fetchWeighLogsData={fetchWeighLogsData} />
              ))
            ) : (
              <Flex p="40px">
                <Text fontSize="lg" fontWeight="semibold">
                  データがありません
                </Text>
              </Flex>
            )}
          </VStack>
          <Flex
            w="full"
            align="center"
            justify="start"
            gap="4px"
            color="gray.500"
            onClick={onOpen}
            _hover={{
              cursor: 'pointer',
              color: 'teal.400',
            }}
          >
            <Icon as={MdAdd as IconType} />
            <Text fontSize="sm" fontWeight="normal">
              データを追加
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <CreateLogModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMonth={selectedMonth}
        fetchWeighLogsData={fetchWeighLogsData}
      />
    </>
  );
};

export default LogsSettingsPage;

interface LogCardProps {
  weighLog: WeighLog;
  fetchWeighLogsData: () => Promise<void>;
}

const LogCard = (props: LogCardProps) => {
  const { weighLog, fetchWeighLogsData } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <CardBase key={weighLog.id} w="full" align="center" justify="start" gap="36px">
        <Text fontSize="md" fontWeight="semibold" w="120px">
          {formatDateNumToString(weighLog.weighDate, '/')}
        </Text>
        <Flex gap="0" w="110px" justify="space-between">
          <Text fontSize="md" fontWeight="normal">
            体重:
          </Text>
          <Flex gap="4px">
            <Text fontSize="md" fontWeight="semibold">
              {weighLog.weight}
            </Text>
            <Text fontSize="md" fontWeight="normal">
              kg
            </Text>
          </Flex>
        </Flex>

        <Flex gap="0" w="130px" justify="space-between">
          <Text fontSize="md" fontWeight="normal">
            体脂肪率:
          </Text>
          <Flex gap="4px">
            <Text fontSize="md" fontWeight="semibold">
              {weighLog.fatPercentage}
            </Text>
            <Text fontSize="md" fontWeight="normal">
              %
            </Text>
          </Flex>
        </Flex>

        <Spacer />
        <Button colorScheme="teal" size="sm" onClick={onOpen}>
          編集
        </Button>
      </CardBase>
      {/* modal */}
      <EditLogModal isOpen={isOpen} onClose={onClose} weighLog={weighLog} fetchWeighLogsData={fetchWeighLogsData} />
    </>
  );
};

interface EditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  weighLog: WeighLog;
  fetchWeighLogsData: () => Promise<void>;
}

const EditLogModal = (props: EditLogModalProps) => {
  const { isOpen, onClose, weighLog, fetchWeighLogsData } = props;
  const user = useAtomValue(userAtom);
  const { isLoading, startLoading, endLoading } = useLoading();
  const { handleSubmit, register, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      weight: weighLog.weight,
      fatPercentage: weighLog.fatPercentage,
    },
  });
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user) return;
      startLoading();
      const _newWeighLog = {
        ...weighLog,
        weight: data.weight,
        fatPercentage: data.fatPercentage,
      };
      successToast({
        title: '編集完了',
        description: '体重・体脂肪率の編集が完了しました',
      });
      await updateWeighLog(user.id, _newWeighLog);
      await fetchWeighLogsData();
      onClose();
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    } finally {
      endLoading();
    }
  });

  useEffect(() => {
    reset({
      weight: weighLog.weight,
      fatPercentage: weighLog.fatPercentage,
    });
  }, [isOpen]);

  return (
    <EditModal isOpen={isOpen} onClose={onClose} title="体重・体脂肪率の編集" onRegister={() => void onSubmit()}>
      <EditModalRow label="体重">
        <EditModalRowInput defaultValue={weighLog.weight} {...register('weight')} placeholder="50 (kg)" />
      </EditModalRow>
      <EditModalRow label="体脂肪率">
        <EditModalRowInput defaultValue={weighLog.fatPercentage} {...register('fatPercentage')} placeholder="12 (%)" />
      </EditModalRow>
    </EditModal>
  );
};

interface CreateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: YearMonth;
  fetchWeighLogsData: () => Promise<void>;
}

const CreateLogModal = (props: CreateLogModalProps) => {
  const { isOpen, onClose, selectedMonth, fetchWeighLogsData } = props;
  const user = useAtomValue(userAtom);
  const defaultDate = formatDateNumToString(new Date(selectedMonth.year, selectedMonth.month - 1).getTime());
  const { isLoading, startLoading, endLoading } = useLoading();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      weighDate: defaultDate,
      weight: null,
      fatPercentage: null,
    },
  });
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!user) return;
      startLoading();
      const _weighDate = new Date(data.weighDate).getTime();
      const _newWeighLog = {
        id: '',
        weight: data.weight ?? 0,
        fatPercentage: data.fatPercentage ?? 0,
        weighDate: _weighDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      // 同じ日付で登録されているデータがあるか確認する
      // 存在すれば上書き, 存在しなければ新規作成する
      const _weighLogList = await fetchWeighLogList(user.id);
      const _sameDayWeighLog = _weighLogList.find((weighLog) => weighLog.weighDate === _weighDate);
      if (_sameDayWeighLog) {
        if (!window.confirm('同じ日付で登録されているデータがあります。上書きしますか？')) return;

        const _updatedWeighLog = {
          ..._newWeighLog,
          id: _sameDayWeighLog.id,
          createdAt: _sameDayWeighLog.createdAt,
        };
        await updateWeighLog(user.id, _updatedWeighLog);
      } else {
        await createWeighLog(user.id, _newWeighLog);
      }
      successToast({
        title: '登録完了',
        description: '体重・体脂肪率の登録が完了しました',
      });
      await fetchWeighLogsData();
      onClose();
    } catch (e) {
      const error = e as Error;
      errorToast({
        title: 'エラーが発生しました',
        description: error.message,
      });
    } finally {
      endLoading();
    }
  });

  useEffect(() => {
    reset({
      weighDate: defaultDate,
      weight: null,
      fatPercentage: null,
    });
  }, [isOpen]);

  return (
    <EditModal isOpen={isOpen} onClose={onClose} title="体重・体脂肪率の追加" onRegister={() => void onSubmit()}>
      <FormControl isInvalid={!!errors.weighDate}>
        <EditModalRow label="日付">
          <EditModalRowInput type="date" size="md" variant="outline" {...register('weighDate')} />
          {errors.weighDate && <FormErrorMessage>{errors.weighDate.message}</FormErrorMessage>}
        </EditModalRow>
      </FormControl>
      <FormControl isInvalid={!!errors.weight}>
        <EditModalRow label="体重">
          <EditModalRowInput {...register('weight')} placeholder="50 (kg)" />
          {errors.weight && <FormErrorMessage>{errors.weight.message}</FormErrorMessage>}
        </EditModalRow>
      </FormControl>
      <FormControl isInvalid={!!errors.fatPercentage}>
        <EditModalRow label="体脂肪率">
          <EditModalRowInput {...register('fatPercentage')} placeholder="12 (%)" />
          {errors.fatPercentage && <FormErrorMessage>{errors.fatPercentage.message}</FormErrorMessage>}
        </EditModalRow>
      </FormControl>
    </EditModal>
  );
};
