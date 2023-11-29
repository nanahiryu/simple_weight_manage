'use client';

import { Center, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { IconType } from 'react-icons';

import { YearMonth } from '../page';

export interface YearMonthPagingProps {
  yearMonth: YearMonth;
  setYearMonth: React.Dispatch<React.SetStateAction<YearMonth>>;
}

export const YearMonthPaging = (props: YearMonthPagingProps) => {
  const { yearMonth, setYearMonth } = props;
  const addMonth = (yearMonth: YearMonth) => {
    if (yearMonth.month < 12) {
      return { year: yearMonth.year, month: yearMonth.month + 1 };
    } else {
      return { year: yearMonth.year + 1, month: 1 };
    }
  };
  const subtractMonth = (yearMonth: YearMonth) => {
    if (yearMonth.month > 1) {
      return { year: yearMonth.year, month: yearMonth.month - 1 };
    } else {
      return { year: yearMonth.year - 1, month: 12 };
    }
  };
  return (
    <HStack h="full" gap="2">
      <Flex gap="0" h="full" align="center">
        <Center
          w="28px"
          h="full"
          _hover={{ bg: 'bg.body', cursor: 'pointer' }}
          onClick={() => setYearMonth((yearMonth) => subtractMonth(yearMonth))}
        >
          <Icon boxSize="8" as={MdArrowLeft as IconType} />
        </Center>
        <Text fontWeight="semibold" fontSize="xl" color="text.lightBlack">
          {`${yearMonth.year} / ${yearMonth.month}`}
        </Text>
        <Center
          w="28px"
          h="full"
          _hover={{ bg: 'bg.body', cursor: 'pointer' }}
          onClick={() => setYearMonth((yearMonth) => addMonth(yearMonth))}
        >
          <Icon boxSize="8" as={MdArrowRight as IconType} />
        </Center>
      </Flex>
    </HStack>
  );
};
