'use client';

import { Button, Flex, HStack, Icon, Spacer, Text } from '@chakra-ui/react';
import { MdOutlineSpaceDashboard, MdSettings } from 'react-icons/md';
import { FaWeight } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Link from 'next/link';

import { logout } from '@/lib/auth';

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
      <Link href="/settings">
        <Flex align="center" gap="8px">
          <Icon as={MdSettings as IconType} boxSize="24px" color="white" />
          <Text fontSize="lg" fontWeight="bold" color="white">
            設定
          </Text>
        </Flex>
      </Link>

      <Spacer />
      <Button color="teal.400" border="2px" borderColor="white" onClick={() => void logout()}>
        ログアウト
      </Button>
    </HStack>
  );
};
