'use client';

import { Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Header } from '@/components/header';
import { CardBase } from '@/components/card';

const routerContents = [
  {
    path: '/settings/target',
    name: '目標設定',
  },
  {
    path: '/settings/weigh-logs',
    name: '体重・体脂肪率リスト',
  },
  {
    path: '/settings/body-part',
    name: 'トレーニング部位',
  },
  {
    path: '/settings/exercise',
    name: 'トレーニング種目',
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Flex pt="72px" direction="column" align="center">
        <Flex py="60px" px="40px" gap="40px" w="90%">
          <CardBase w="320px" h="fit-content" justify="start" direction="column" py="20px" gap="8px">
            {routerContents.map((content) => (
              <Link key={content.path} href={content.path}>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  _hover={{
                    cursor: 'pointer',
                    color: 'teal.400',
                  }}
                >
                  {content.name}
                </Text>
              </Link>
            ))}
          </CardBase>
          {children}
        </Flex>
      </Flex>
    </>
  );
}
