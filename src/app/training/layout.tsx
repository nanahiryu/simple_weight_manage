'use client';

import { Flex } from '@chakra-ui/react';

import { Header } from '@/components/header';

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Flex pt="72px" justify="center">
        {children}
      </Flex>
    </>
  );
}
