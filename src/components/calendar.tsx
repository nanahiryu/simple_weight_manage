import { Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { YearMonth } from './paging';

interface CalendarProps {
  yearMonth: YearMonth;
}

const Calendar = (props: CalendarProps) => {
  const { yearMonth } = props;

  const [dayjsOfMonth, setDayjsOfMonth] = useState<Dayjs[][]>([]);

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
          <Flex key={`${dayjsOfWeek[0].toISOString()}-week`} w="full" justify="space-between">
            {dayjsOfWeek.map((dayjsOfDay) => {
              return (
                <Flex
                  key={dayjsOfDay.toISOString()}
                  h="100px"
                  w="full"
                  border="1px"
                  borderColor="gray.400"
                  py="4px"
                  px="8px"
                >
                  <Text color={calcDayColor(dayjsOfDay)} fontSize="lg" fontWeight="bold">
                    {dayjsOfDay.format('D')}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default Calendar;
