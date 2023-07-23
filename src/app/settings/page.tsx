'use client';

import { Button, Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';

import { userAtom } from '@/globalState/user';
import { logout } from '@/lib/auth';

const SettingsPage = () => {
  const user = useAtomValue(userAtom);
  return (
    <Flex direction="column">
      <Text>Settings Page</Text>
      <Text>{user?.name}</Text>
      <Button onClick={() => void logout()}>log out</Button>
    </Flex>
  );
};

export default SettingsPage;
