'use client';

import { Flex } from '@chakra-ui/react';

import { Header } from '@/components/header';

export default function DashBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Flex pt="72px" direction="column" align="center">
        {children}
      </Flex>
    </>
  );
}
