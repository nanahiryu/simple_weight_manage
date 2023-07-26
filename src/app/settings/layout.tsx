'use client';

import { Flex, Text } from '@chakra-ui/react';

import { Header } from '@/components/header';
import { CardBase } from '@/components/card';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Flex pt="72px" direction="column" align="center">
        <Flex py="60px" px="40px" gap="40px" w="80%">
          <CardBase w="25%" justify="center" direction="column" py="20px">
            <Text fontSize="lg" fontWeight="semibold">
              目標設定
            </Text>
          </CardBase>
          {children}
        </Flex>
      </Flex>
    </>
  );
}
