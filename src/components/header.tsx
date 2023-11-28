'use client';

import { Button, Flex, HStack, Icon, Spacer, Text } from '@chakra-ui/react';
import { MdFitnessCenter, MdOutlineSpaceDashboard, MdSettings } from 'react-icons/md';
import { FaWeight } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';

import { logout } from '@/function/auth';

export const Header = () => {
  return (
    <HStack position="fixed" zIndex="banner" w="full" minH="72px" px="100px" bg="teal.400" spacing="40px">
      <Link href="/dashboard">
        <Flex align="center" gap="8px">
          <Icon as={MdOutlineSpaceDashboard as IconType} boxSize="24px" color="white" />
          <Text fontSize="lg" fontWeight="bold" color="white">
            ダッシュボード
          </Text>
        </Flex>
      </Link>
      <Link href="/report">
        <Flex align="center" gap="8px">
          <Icon as={FaWeight as IconType} boxSize="20px" color="white" />
          <Text fontSize="lg" fontWeight="bold" color="white">
            体重・体脂肪率入力
          </Text>
        </Flex>
      </Link>
      <Link href="/training">
        <Flex align="center" gap="8px">
          <Icon as={MdFitnessCenter as IconType} boxSize="24px" color="white" />
          <Text fontSize="lg" fontWeight="bold" color="white">
            トレーニング
          </Text>
        </Flex>
      </Link>
      <Link href="/settings/target">
        <Flex align="center" gap="8px">
          <Icon as={MdSettings as IconType} boxSize="24px" color="white" />
          <Text fontSize="lg" fontWeight="bold" color="white">
            設定
          </Text>
        </Flex>
      </Link>

      <Spacer />
      <Button color="teal.400" onClick={() => void logout()}>
        ログアウト
      </Button>
    </HStack>
  );
};
