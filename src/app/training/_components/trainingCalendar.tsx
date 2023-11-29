import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { TrainingLog } from '@/types/trainingLog';
import { YearMonth } from '@/components/paging';

interface CalendarProps {
  yearMonth: YearMonth;
  trainingLogList?: TrainingLog[];
}

const TrainingCalendar = (props: CalendarProps) => {
  const { yearMonth, trainingLogList } = props;

  const [dayjsOfMonth, setDayjsOfMonth] = useState<Dayjs[][]>([]);

  useEffect(() => {
    const _daysOfMonth = [];
    const _firstD = new Date(yearMonth.year, yearMonth.month - 1, 1);
    const _firstDay = dayjs(_firstD);
    const _firstDayOfCalendar = _firstDay.subtract(_firstDay.day(), 'day');
    for (let i = 0; i < 5; i++) {
      const _week = [];
      for (let j = 0; j < 7; j++) {
        _week.push(_firstDayOfCalendar.add(i * 7 + j, 'day'));
      }
      _daysOfMonth.push(_week);
    }
    setDayjsOfMonth(_daysOfMonth);
  }, [yearMonth]);

  return (
    <Flex direction="column" w="90%" border="1px" borderColor="gray.400">
      {dayjsOfMonth.map((dayjsOfWeek) => {
        return (
          <Flex key={`${dayjsOfWeek[0].toISOString()}-week`} w="full">
            {dayjsOfWeek.map((dayjsOfDay) => {
              return (
                <DayBox
                  key={dayjsOfDay.toISOString()}
                  dayjsOfDay={dayjsOfDay}
                  yearMonth={yearMonth}
                  trainingLogList={trainingLogList}
                />
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default TrainingCalendar;

interface DayBoxProps {
  dayjsOfDay: Dayjs;
  yearMonth: YearMonth;
  trainingLogList?: TrainingLog[];
}

const DayBox = (props: DayBoxProps) => {
  const { dayjsOfDay, yearMonth, trainingLogList } = props;
  const [todayTrainingLogList, setTodayTrainingLogList] = useState<TrainingLog[]>([]);

  const calcDayColor = (dayjs: Dayjs) => {
    if (dayjs.month() !== yearMonth.month - 1) {
      return 'gray.400';
    }
    if (dayjs.day() === 0) {
      return 'red.400';
    }
    if (dayjs.day() === 6) {
      return 'blue.400';
    }
    return 'gray.600';
  };

  useEffect(() => {
    if (trainingLogList) {
      const _todayTrainingLogList = trainingLogList.filter((trainingLog) => {
        const _dayjsOfTrainingDay = dayjs(trainingLog.trainingDate);
        return dayjsOfDay.isSame(_dayjsOfTrainingDay);
      });
      setTodayTrainingLogList(_todayTrainingLogList);
    }
  }, []);

  return (
    <Flex minW="0" h="100px" w="full" border="1px" borderColor="gray.400" py="4px" px="8px" direction="column">
      <Text color={calcDayColor(dayjsOfDay)} fontSize="lg" fontWeight="bold">
        {dayjsOfDay.format('D')}
      </Text>
      <Flex overflow="hidden" direction="column">
        {todayTrainingLogList &&
          todayTrainingLogList.map((trainingLog) => (
            <Text isTruncated key={trainingLog.id} fontSize="sm">
              {trainingLog.name}
            </Text>
          ))}
      </Flex>
    </Flex>
  );
};
