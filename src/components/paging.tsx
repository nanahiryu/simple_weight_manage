'use client';

import { Center, Flex, HStack, Text } from '@chakra-ui/react';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';

export interface PagingProps {
  page: number;
  pageLength: number;
  setPage: (page: number) => void;
}

export const Paging = (props: PagingProps) => {
  const { page, pageLength, setPage } = props;
  return (
    <HStack h="full" gap="2">
      <Text fontWeight="semibold" fontSize="12px" color="text.lightBlack">
        {`${page} / ${pageLength} ページ`}
      </Text>
      <Flex gap="0" h="full">
        <Center
          w="28px"
          h="full"
          _hover={{ bg: 'bg.body', cursor: 'pointer' }}
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          <MdArrowLeft />
        </Center>
        <Center
          w="28px"
          h="full"
          _hover={{ bg: 'bg.body', cursor: 'pointer' }}
          onClick={() => {
            if (page < pageLength) {
              setPage(page + 1);
            }
          }}
        >
          <MdArrowRight />
        </Center>
      </Flex>
    </HStack>
  );
};
