'use client';

import { Button, Flex, Spacer, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useForm } from 'react-hook-form';

import { WeighLog } from '@/types/weighLog';
import { fetchWeighLogList, updateWeighLog } from '@/function/weighLog';
import { userAtom } from '@/globalState/user';
import { formatDateNumToString } from '@/function/day';
import { CardBase } from '@/components/card';
import { EditModal, EditModalRow, EditModalRowInput } from '@/components/modal';

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
  }, []);

  useEffect(() => {
    filterDisplayWeighLogs(weighLogs, selectedMonth);
  }, [weighLogs, selectedMonth]);

  return (
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
      </Flex>
    </Flex>
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
  const { handleSubmit, register, reset } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      weight: weighLog.weight,
      fatPercentage: weighLog.fatPercentage,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;
    const _newWeighLog = {
      ...weighLog,
      weight: data.weight,
      fatPercentage: data.fatPercentage,
    };
    await updateWeighLog(user.id, _newWeighLog);
    await fetchWeighLogsData();
    onClose();
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
